import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/assistant.css";
import pricelist from "../data/pricelist.json";

/**
 * Assistant.jsx
 * Interactive assistant component for a mobile repair site.
 *
 * Requirements implemented:
 * - Soft 3D SVG character with animations (Framer Motion)
 * - Welcome text flow, hover/click interactions
 * - Click navigates to /diagnosis (expects react-router in app)
 * - Diagnosis page with voice input (Web Speech API) + text input
 * - Keyword-based matching to pricelist.json
 * - Appointment form that opens WhatsApp prefilled message
 *
 * Usage:
 * - Place <Assistant /> where the blue welcome box is.
 * - Ensure framer-motion is installed.
 * - Add route for /diagnosis to render the Diagnosis page included in package.
 */

const KEYWORDS = [
  { words: ["не включ", "не вкл", "не включается", "не загружается"], id: "power" },
  { words: ["экран", "разбит", "треск", "стекло"], id: "screen" },
  { words: ["заряд", "не заряжается", "не заряжает"], id: "battery" },
  { words: ["звук", "микрофон", "динамик"], id: "audio" },
  { words: ["камера", "фото", "снимать"], id: "camera" }
];

function findService(text) {
  const lower = text.toLowerCase();
  for (const k of KEYWORDS) {
    for (const w of k.words) {
      if (lower.includes(w)) return pricelist.services.find(s => s.id === k.id) || null;
    }
  }
  // fallback: try matching service names
  for (const s of pricelist.services) {
    if (lower.includes(s.title.toLowerCase()) || lower.includes(s.tags.join(" "))) return s;
  }
  return null;
}

export default function Assistant({ navigateTo = (p)=>window.location.href = p }) {
  const [stage, setStage] = useState("welcome"); // welcome, idle, prompt
  const [bubbleText, setBubbleText] = useState("Добро пожаловать!");
  const [hoverLabel, setHoverLabel] = useState("");
  const waving = useRef(true);

  useEffect(() => {
    // Welcome flow
    setTimeout(()=> setBubbleText("Я ИИ-помощник! Помогу диагностировать ваше устройство 🛠️"), 3000);
    const idleTimer = setTimeout(()=> {
      setStage("idle");
      setBubbleText("Нажмите на меня!");
    }, 7000);
    return ()=> clearTimeout(idleTimer);
  }, []);

  function handleHover(on) {
    setHoverLabel(on ? "Нажмите на меня!" : "");
  }

  function handleClick() {
    // animate move then navigate
    setStage("navigate");
    setBubbleText("Пойдем к диагностике →");
    setTimeout(()=> navigateTo("/diagnosis"), 600);
  }

  return (
    <div className="assistant-wrapper" aria-live="polite">
      <motion.div
        className="assistant-window"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div className="assistant-topline">Добро пожаловать в Чип?Гаджет</div>

        <div className="assistant-stage">
          <motion.div
            className="character"
            onMouseEnter={()=>handleHover(true)}
            onMouseLeave={()=>handleHover(false)}
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            {/* Simple cute 3D-like SVG character */}
            <motion.svg viewBox="0 0 200 200" className="char-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#6fb3ff"/>
                  <stop offset="1" stopColor="#2b78ff"/>
                </linearGradient>
                <filter id="f" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2b78ff" floodOpacity="0.18"/>
                </filter>
              </defs>

              {/* Shadow */}
              <ellipse cx="100" cy="170" rx="52" ry="10" fill="#08316a" opacity="0.12"/>
              {/* Body */}
              <motion.g animate={{ y: stage==="welcome" ? [0,-4,0] : 0 }} transition={{ duration: 1.2, repeat: Infinity }}>
                <rect x="50" y="70" rx="24" ry="24" width="100" height="90" fill="url(#g)" filter="url(#f)"/>
                {/* Head */}
                <circle cx="100" cy="50" r="36" fill="#ffffff" stroke="#e6f0ff" strokeWidth="3"/>
                {/* Eyes */}
                <circle cx="88" cy="46" r="4" fill="#233040"/>
                <circle cx="112" cy="46" r="4" fill="#233040"/>
                {/* Smile */}
                <path d="M85 58 Q100 70 115 58" stroke="#2b78ff" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* Hand waving */}
                <motion.circle className="hand" cx="145" cy="90" r="10" fill="#ffffff" stroke="#cfe8ff" strokeWidth="2"
                  animate={{ rotate: [0, -20, 0, -12, 0] }}
                  transition={{ repeat: stage==="welcome" ? Infinity : 0, duration: 1.2 }}
                />
              </motion.g>
            </motion.svg>

            <div className="hover-label">{hoverLabel}</div>
          </motion.div>

          <div className="bubble-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={bubbleText}
                className="speech-bubble"
                initial={{ opacity:0, scale:0.9, y:6 }}
                animate={{ opacity:1, scale:1, y:0 }}
                exit={{ opacity:0, scale:0.95, y:4 }}
                transition={{ duration:0.28 }}
              >
                {bubbleText}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
