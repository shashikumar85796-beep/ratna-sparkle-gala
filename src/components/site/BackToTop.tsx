import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: isMobile ? 80 : 90,
        right: isMobile ? 16 : 24,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#C9A84C",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 15px rgba(201,168,76,0.4)",
        border: "none",
        cursor: "pointer",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transform: show ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
        transition: "opacity 0.3s ease, transform 0.3s ease, background 0.3s ease",
        zIndex: 9998,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1.1)";
        e.currentTarget.style.background = "#FCF6BA";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.background = "#C9A84C";
      }}
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}
