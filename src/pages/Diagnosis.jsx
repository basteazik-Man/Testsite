import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/assistant.css";
import pricelist from "../data/pricelist.json";
import findServiceFromText from "../utils/findServiceFromText";

/**
 * Diagnosis.jsx
 * Full diagnosis page: voice input + text + matching + booking form
 */

export default function Diagnosis() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [note, setNote] = useState("");
  const [messenger, setMessenger] = useState("WhatsApp");
  const [phone, setPhone] = useState("");
  const recognitionRef = useRef(null);

  useEffect(()=> {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = "ru-RU";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setText(t);
      handleAnalyze(t);
      setListening(false);
    };
    rec.onend = ()=> setListening(false);
    recognitionRef.current = rec;
  },[]);

  function toggleListen() {
    if (!recognitionRef.current) return alert("Ваш браузер не поддерживает Web Speech API");
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  function handleAnalyze(inputText=null) {
    const q = (inputText ?? text).trim();
    if (!q) {
      setResult({ type: "error", message: "Пожалуйста опишите проблему."});
      return;
    }
    const service = findServiceFromText(q, pricelist);
    if (service) {
      setResult({ type: "ok", service });
    } else {
      setResult({ type: "complex", message: "Похоже на сложную или необычную проблему. Рекомендуем очную диагностику."});
    }
  }

  function sendBooking() {
    if (!phone) {
      alert("Укажите номер телефона");
      return;
    }
    const msg = `Заявка на ремонт%0AПроблема: ${encodeURIComponent(text)}%0AУслуга: ${result && result.service ? encodeURIComponent(result.service.title) : "Диагностика"}%0AТелефон: ${encodeURIComponent(phone)}`;
    // WhatsApp link format
    let url = "";
    if (messenger === "WhatsApp") {
      url = `https://wa.me/${phone.replace(/\D/g,"")}?text=${msg}`;
    } else if (messenger === "Telegram") {
      // Telegram deep link works differently; fallback to t.me
      url = `https://t.me/share/url?url=&text=${msg}`;
    } else {
      url = `mailto:service@example.com?subject=Заявка&body=${msg}`;
    }
    window.open(url, "_blank");
  }

  return (
    <div className="diagnosis-page">
      <motion.h2 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>Диагностика устройства</motion.h2>

      <div className="diagnosis-card">
        <p className="lead">Расскажите о проблеме с устройством — голосом или текстом</p>

        <div className="controls">
          <button className={`mic ${listening ? "listening":""}`} onClick={toggleListen}>
            {listening ? "Остановить запись" : "Голосовой ввод"}
          </button>

          <input placeholder='Примеры: "не включается", "разбит экран", "не заряжается"' value={text} onChange={(e)=>setText(e.target.value)} />

          <button onClick={()=>handleAnalyze()}>Проанализировать</button>
        </div>

        <div className="result-area">
          {result && result.type === "ok" && (
            <div className="result-ok">
              <strong>Найдена услуга:</strong>
              <div className="service-card">
                <div className="s-title">{result.service.title}</div>
                <div className="s-price">{result.service.price} ₽</div>
                <div className="s-desc">{result.service.desc}</div>
              </div>
            </div>
          )}

          {result && result.type === "complex" && (
            <div className="result-complex">
              <strong>Сложный случай</strong>
              <p>{result.message}</p>
              <p>Причины: повреждения внутренней платы, нестабильные симптомы, необходимость тестов с оборудованием.</p>
            </div>
          )}

          {result && result.type === "error" && (
            <div className="result-error">{result.message}</div>
          )}
        </div>

        <hr />

        <div className="booking">
          <h3>Запись на ремонт</h3>
          <label>На какой мессенджер может написать мастер?</label>
          <div className="messengers">
            <label><input type="radio" checked={messenger==="WhatsApp"} onChange={()=>setMessenger("WhatsApp")} /> WhatsApp</label>
            <label><input type="radio" checked={messenger==="Telegram"} onChange={()=>setMessenger("Telegram")} /> Telegram</label>
            <label><input type="radio" checked={messenger==="SMS"} onChange={()=>setMessenger("SMS")} /> SMS</label>
          </div>

          <input placeholder="+7 900 123-45-67" value={phone} onChange={(e)=>setPhone(e.target.value)} />

          <textarea placeholder="Доп. информация (необязательно)" value={note} onChange={(e)=>setNote(e.target.value)} />

          <button className="send" onClick={sendBooking}>Отправить заявку</button>
        </div>
      </div>
    </div>
  );
}
