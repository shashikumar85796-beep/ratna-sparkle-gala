import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let ticking = false;

    const calc = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(calc);
        ticking = true;
      }
    };

    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: `${pct}%`,
        background: "linear-gradient(90deg, #BF953F, #FCF6BA, #C9A84C)",
        zIndex: 99999,
        pointerEvents: "none",
        transition: "width 0.1s linear",
      }}
    />
  );
}
