// Assistant.jsx - animated "living" cartoon character using Framer Motion
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Lightweight SVG-based cartoon head/body for good performance
export default function Assistant({ size = 90 }) {
  const controls = useAnimation();
  const blinkRef = useRef(null);
  const navigate = useNavigate();

  // Idle animations: bob, subtle arm swing, head tilt cycles
  useEffect(() => {
    let mounted = true;

    async function loopIdle() {
      while (mounted) {
        // small random delay between cycles to feel natural
        const delay = 2000 + Math.random() * 3000;
        await controls.start({
          y: [0, -6, 0],
          rotate: [0, -2, 0],
          transition: { duration: 1.8, ease: "easeInOut" },
        });

        // blink (scaleY on eye mask)
        if (blinkRef.current) {
          blinkRef.current.setAttribute("data-blink", "1");
          setTimeout(() => blinkRef.current && blinkRef.current.removeAttribute("data-blink"), 120);
        }

        await new Promise((res) => setTimeout(res, delay));
      }
    }

    loopIdle();

    return () => {
      mounted = false;
    };
  }, [controls]);

  // Hover interactions: excited jump + look at cursor (simple tilt)
  const handleMouseEnter = async (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // quick joyful hop
    controls.start({
      y: [0, -12, 0],
      scale: [1, 1.06, 1],
      transition: { duration: 0.45, ease: "backOut" },
    });
    // trigger a blink for emphasis
    if (blinkRef.current) {
      blinkRef.current.setAttribute("data-blink", "1");
      setTimeout(() => blinkRef.current && blinkRef.current.removeAttribute("data-blink"), 140);
    }
  };

  const handleMouseMove = (e) => {
    // small head tilt toward cursor horizontally
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const tilt = Math.max(-12, Math.min(12, (mx / rect.width) * 24));
    controls.start({ rotate: tilt, transition: { duration: 0.2 } });
  };

  const handleMouseLeave = () => {
    controls.start({ rotate: 0, transition: { duration: 0.5 } });
  };

  const handleClick = () => {
    // emit a custom event so any existing logic can hook into it (voice/diagnosis)
    try {
      window.dispatchEvent(new CustomEvent("assistant:click", { detail: { from: "assistant" } }));
    } catch (e) {}
    // navigate to diagnosis page smoothly
    navigate("/diagnosis");
  };

  // Accessibility: reduced motion respect
  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const containerStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    cursor: "pointer",
  };

  return (
    <motion.div
      className="assistant-root"
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={controls}
      initial={{ y: 0, rotate: 0 }}
      aria-label="Помощник Чип&Гаджет"
      title="Нажмите, чтобы пройти диагностику"
    >
      {/* SVG cartoon - head, eyes, body and simple arms. Eyes will blink via small rectangles scaled */}
      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="false">
        <defs>
          <linearGradient id="skin" x1="0" x2="1">
            <stop offset="0" stopColor="#FFD79D" />
            <stop offset="1" stopColor="#FFB86B" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" x2="1">
            <stop offset="0" stopColor="#6EE7B7" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Body */}
        <g transform="translate(10,20)">
          <motion.ellipse cx="50" cy="68" rx="36" ry="30" fill="url(#shirt)" initial={{}} animate={{}} style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.15))" }} />

          {/* Left arm - swings with bob */}
          <motion.g
            initial={{}}
            animate={{ rotate: [0, -8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            transform="translate(6,50)"
            style={{ originX: "10px", originY: "10px" }}
          >
            <rect x="0" y="-6" width="12" height="20" rx="6" fill="#FFD79D" />
            <circle cx="6" cy="18" r="6" fill="#FFD79D" />
          </motion.g>

          {/* Right arm */}
          <motion.g
            initial={{}}
            animate={{ rotate: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            transform="translate(92,50)"
            style={{ originX: "6px", originY: "10px" }}
          >
            <rect x="-12" y="-6" width="12" height="20" rx="6" fill="#FFD79D" />
            <circle cx="-6" cy="18" r="6" fill="#FFD79D" />
          </motion.g>

          {/* Head group */}
          <motion.g transform="translate(14,0)">
            <motion.circle cx="50" cy="24" r="22" fill="url(#skin)" stroke="#f3d1a3" strokeWidth="1" />

            {/* Hair tuft */}
            <path d="M36 12 Q50 2 64 12" fill="none" stroke="#3b3f45" strokeWidth="2" strokeLinecap="round" />

            {/* Eyes - we'll animate a blink by scaling the eye mask */}
            <g>
              <rect x="36" y="20" width="12" height="6" rx="3" fill="#fff" />
              <rect x="72" y="20" width="12" height="6" rx="3" fill="#fff" />

              {/* pupils */}
              <motion.circle cx="42" cy="23" r="2.5" fill="#222" />
              <motion.circle cx="78" cy="23" r="2.5" fill="#222" />

              {/* blink mask overlay (animated via data attribute toggle) */}
              <rect ref={blinkRef} x="36" y="20" width="12" height="6" rx="3" fill="#FFD79D" style={{ transition: 'transform 0.12s, opacity 0.12s' }} />
              <rect x="72" y="20" width="12" height="6" rx="3" fill="#FFD79D" style={{ transition: 'transform 0.12s, opacity 0.12s' }} />
            </g>

            {/* Mouth - simple smiling path */}
            <path d="M44 30 Q50 36 56 30" stroke="#7a3b2b" strokeWidth="2" fill="none" strokeLinecap="round" />
          </motion.g>
        </g>

        {/* subtle shadow */}
        <ellipse cx="60" cy="110" rx="30" ry="6" fill="rgba(0,0,0,0.12)" />

        <style>{`
          /* blink effect toggled by data-blink attribute on rects inside svg */
          rect[data-blink="1"] {
            transform-origin: center;
            transform: scaleY(0.08);
            opacity: 0.98;
          }
        `}</style>
      </svg>
    </motion.div>
  );
}
