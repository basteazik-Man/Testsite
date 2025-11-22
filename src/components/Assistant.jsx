import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Assistant - Disney/Pixar inspired cartoon character.
 * - size prop controls rendered box (defaults 100)
 * - performs a cyclical "walk around text" path (4 key points)
 * - internal walk-cycle (legs/arms/head) looped with stagger
 * - hover: excited jump + look toward cursor
 * - click: navigates to /diagnosis and dispatches assistant:click event
 * - respects prefers-reduced-motion
 *
 * Performance notes:
 * - SVG is intentionally kept moderately simple (vector shapes)
 * - Heavy continuous animations are limited; main position animation uses keyframes with modest fps
 */

export default function Assistant({ size = 100 }) {
  const nav = useNavigate();
  const controls = useAnimation();
  const walkControls = useAnimation();
  const rootRef = useRef(null);
  const blinkRef = useRef(null);

  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Points around the heading where character will "visit" — relative coordinates (%)
  // These will be converted to px at runtime based on container size provided by Home.jsx via CSS.
  const pathPoints = [
    { x: -40, y: 0 },   // left-bottom of heading
    { x: 0, y: -36 },   // top-middle (above heading)
    { x: 48, y: 0 },    // right-bottom
    { x: 0, y: 24 },    // below-center
  ];

  // Idle/walk loop: cycles between path points with walking motion
  useEffect(() => {
    let mounted = true;
    if (prefersReduced) return;

    (async () => {
      while (mounted) {
        // choose a random pattern/delay to feel alive
        const idxStart = Math.floor(Math.random() * pathPoints.length);
        // iterate through 4 points starting from idxStart
        for (let i = 0; i < pathPoints.length && mounted; i++) {
          const p = pathPoints[(idxStart + i) % pathPoints.length];
          // move to point with a "walk" duration based on distance
          await controls.start({
            x: p.x,
            y: p.y,
            transition: { duration: 1.0 + Math.random() * 1.0, ease: "easeInOut" },
          });
          // play a short walk-cycle burst
          walkControls.start({ cycle: 1 });
          // small pause with look-around
          await new Promise((r) => setTimeout(r, 600 + Math.random() * 1200));
        }
        // longer pause between loops
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));
      }
    })();

    return () => { mounted = false; };
  }, [controls, walkControls, prefersReduced]);

  // blink loop (simple)
  useEffect(() => {
    if (prefersReduced) return;
    let mounted = true;
    (async () => {
      while (mounted) {
        const delay = 2500 + Math.random() * 3000;
        await new Promise((r) => setTimeout(r, delay));
        if (!mounted) break;
        if (blinkRef.current) {
          blinkRef.current.setAttribute("data-blink", "1");
          setTimeout(() => blinkRef.current && blinkRef.current.removeAttribute("data-blink"), 120);
        }
      }
    })();
    return () => { mounted = false; };
  }, [prefersReduced]);

  const handleMouseEnter = (e) => {
    if (prefersReduced) return;
    // excited quick hop and wider smile
    controls.start({ y: -18, transition: { duration: 0.35, ease: "easeOut" } });
    setTimeout(() => controls.start({ y: 0, transition: { duration: 0.45, ease: "easeIn" } }), 350);
    if (blinkRef.current) {
      blinkRef.current.setAttribute("data-blink", "1");
      setTimeout(() => blinkRef.current && blinkRef.current.removeAttribute("data-blink"), 120);
    }
  };

  const handleMouseMove = (e) => {
    if (prefersReduced) return;
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    const tilt = Math.max(-12, Math.min(12, (mx / rect.width) * 24));
    const lift = Math.max(-10, Math.min(10, (my / rect.height) * 20));
    controls.start({ rotate: tilt, y: lift, transition: { duration: 0.18 } });
  };

  const handleMouseLeave = () => {
    if (prefersReduced) return;
    controls.start({ rotate: 0, y: 0, transition: { duration: 0.45 } });
  };

  const handleClick = () => {
    try { window.dispatchEvent(new CustomEvent("assistant:click", { detail: { from: "assistant" } })); } catch (e) {}
    nav("/diagnosis");
  };

  // Walk-cycle animation: we animate a "cycle" prop and drive transform via style attr.
  // Framer Motion doesn't animate custom props to inline styles directly, so we use animate keyframes on child parts.
  return (
    <motion.div
      ref={rootRef}
      className="assistant-overlay"
      style={{
        width: size,
        height: size,
        position: "absolute",
        right: "calc(50% - 120px)", // default placement; Home.jsx will create container that allows movement
        top: "12px",
        zIndex: 60,
        pointerEvents: "auto",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={controls}
      initial={{ x: pathPoints[2].x, y: pathPoints[2].y, rotate: 0 }}
      title="Нажмите, чтобы пройти диагностику"
      aria-label="Помощник Чип и Гаджет"
    >
      <svg viewBox="0 0 180 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="false">
        <defs>
          <linearGradient id="gradSkin" x1="0" x2="1">
            <stop offset="0" stopColor="#FFD9B3"/>
            <stop offset="1" stopColor="#FFBC80"/>
          </linearGradient>
          <linearGradient id="gradHair" x1="0" x2="1">
            <stop offset="0" stopColor="#37251f"/>
            <stop offset="1" stopColor="#4b342b"/>
          </linearGradient>
          <linearGradient id="gradShirt" x1="0" x2="1">
            <stop offset="0" stopColor="#60a5fa"/>
            <stop offset="1" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="90" cy="184" rx="42" ry="8" fill="rgba(0,0,0,0.15)" />

        {/* body */}
        <g transform="translate(30,40)">
          <motion.g
            // torso with slight bob tied to controls via keyframes animation imitation
            animate={walkControls}
            initial={{}}
            transition={{ duration: 0.9 }}
            style={{ originX: "75px", originY: "80px" }}
          >
            <rect x="40" y="60" rx="20" ry="20" width="70" height="70" fill="url(#gradShirt)"/>
          </motion.g>

          {/* Left leg */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{
              rotate: [0, -24, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            style={{ originX: "50px", originY: "140px" }}
            transform="translate(-6,100)"
          >
            <rect x="48" y="0" width="12" height="36" rx="6" fill="#2d2d2d" />
            <rect x="44" y="36" width="20" height="8" rx="4" fill="#111827"/>
          </motion.g>

          {/* Right leg (opposite phase) */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{
              rotate: [0, 24, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.3 }}
            style={{ originX: "110px", originY: "140px" }}
            transform="translate(4,100)"
          >
            <rect x="48" y="0" width="12" height="36" rx="6" fill="#2d2d2d" />
            <rect x="44" y="36" width="20" height="8" rx="4" fill="#111827"/>
          </motion.g>

          {/* Left arm */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [6, -12, 6] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            transform="translate(8,56)"
            style={{ originX: "8px", originY: "8px" }}
          >
            <rect x="0" y="0" width="14" height="40" rx="7" fill="url(#gradSkin)"/>
            <circle cx="7" cy="48" r="9" fill="url(#gradSkin)"/>
          </motion.g>

          {/* Right arm */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [-6, 12, -6] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.2 }}
            transform="translate(148,56)"
            style={{ originX: "-8px", originY: "8px" }}
          >
            <rect x="-14" y="0" width="14" height="40" rx="7" fill="url(#gradSkin)"/>
            <circle cx="-7" cy="48" r="9" fill="url(#gradSkin)"/>
          </motion.g>

          {/* head group */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            transform="translate(24,-10)"
            style={{ originX: "75px", originY: "10px" }}
          >
            <circle cx="75" cy="20" r="28" fill="url(#gradSkin)" stroke="#f0c9a0" strokeWidth="1.2"/>
            {/* hair */}
            <path d="M60 4 Q75 -12 92 6" stroke="url(#gradHair)" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* eye whites */}
            <ellipse cx="64" cy="20" rx="6" ry="5" fill="#fff" />
            <ellipse cx="86" cy="20" rx="6" ry="5" fill="#fff" />
            {/* pupils */}
            <motion.circle cx="64" cy="21" r="2.8" fill="#1f2937" />
            <motion.circle cx="86" cy="21" r="2.8" fill="#1f2937" />
            {/* blink masks */}
            <rect ref={blinkRef} x="58" y="17" width="12" height="6" rx="3" fill="url(#gradSkin)" style={{ transition: 'transform 0.12s, opacity 0.12s' }} />
            <rect x="80" y="17" width="12" height="6" rx="3" fill="url(#gradSkin)" style={{ transition: 'transform 0.12s, opacity 0.12s' }} />
            {/* mouth - expressive */}
            <path d="M68 30 Q75 36 82 30" stroke="#7a3b2b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </motion.g>
        </g>

        <style>{`
          rect[data-blink="1"] {
            transform-origin: center;
            transform: scaleY(0.06);
            opacity: 0.99;
          }
        `}</style>
      </svg>
    </motion.div>
  );
}
