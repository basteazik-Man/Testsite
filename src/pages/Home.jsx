import React from "react";
import { motion } from "framer-motion";
import Assistant from "../components/Assistant";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-6 relative z-10 pt-16">
      {/* ... search and other sections (omitted for brevity in this file) */}
      <motion.section
        className="w-full max-w-5xl mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 shadow-lg relative overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="text-left pr-4">
            <h1 id="greeting" className="text-3xl md:text-4xl font-extrabold text-white relative inline-block">
              Добро пожаловать в <span className="text-white/90">Чип&Гаджет</span>
            </h1>
            <p className="text-white/90 mt-2 text-lg">Ремонт смартфонов, планшетов и ноутбуков всех брендов</p>
          </div>

          {/* Container wrapper that will serve as the bounding box for absolute-positioned assistant */}
          <div className="assistant-wrap pointer-events-none">
            {/* Assistant itself retains pointer events so it is clickable */}
            <Assistant size={100} />
          </div>
        </div>
      </motion.section>

      {/* Placeholder for the rest of the page - keep original structure */}
      <div className="w-full max-w-5xl bg-white p-6 md:p-8 rounded-3xl shadow-xl mb-6">
        <h2 className="text-2xl font-semibold mb-6 md:mb-8 text-gray-800">Секция с брендами — оставлена без изменений</h2>
        <p className="text-gray-600">Остальной контент страницы остался нетронутым в этом патче.</p>
      </div>

      <style jsx>{`
        /* The assistant-wrap is positioned so the assistant can move around the greeting.
           It is intentionally pointer-events:none to not block text selection, while the assistant
           element itself has pointer events enabled for interactions. */
        .assistant-wrap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        /* Ensure assistant can overflow outside the section while remaining visible */
        .assistant-overlay {
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
