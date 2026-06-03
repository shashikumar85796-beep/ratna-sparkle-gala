import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/categories", label: "Categories" },
  { to: "/events", label: "Past Events" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/90 backdrop-blur-lg border-b border-[#C9A84C]/20 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-gold-gradient leading-none">BCS</span>
          <span className="font-cinzel text-xs text-[#C9A84C] hidden sm:block">Ratna Award</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-cinzel text-xs text-white/80 hover:text-[#C9A84C] transition-colors"
              activeProps={{ className: "font-cinzel text-xs text-[#C9A84C]" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/nominate" className="hidden md:inline-flex btn-gold animate-pulse-gold !py-2.5 !px-5 text-[10px]">
            Nominate Now
          </Link>
          <button className="lg:hidden text-[#C9A84C]" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-black/95 border-t border-[#C9A84C]/20 mt-3">
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-cinzel text-sm text-white/90">
                {l.label}
              </Link>
            ))}
            <Link to="/nominate" onClick={() => setOpen(false)} className="btn-gold w-fit">Nominate Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}
