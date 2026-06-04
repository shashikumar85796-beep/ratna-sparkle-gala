import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/categories", label: "Categories" },
  { to: "/events", label: "Past Events" },
] as const;

const eventInfoLinks = [
  { to: "/schedule", label: "Schedule & Programme" },
  { to: "/venue", label: "Venue & Directions" },
  { to: "/accreditation", label: "Press Accreditation" },
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

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
      style={{ paddingTop: scrolled ? undefined : undefined }}
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
          <div
            className="relative"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <button className="font-cinzel text-xs text-white/80 hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1">
              Event Info <ChevronDown size={12} />
            </button>
            {dropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64">
                <div className="bg-black/95 backdrop-blur-lg border border-[#C9A84C]/30 rounded p-2 shadow-[0_10px_40px_rgba(201,168,76,0.2)]">
                  {eventInfoLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block px-4 py-3 font-cinzel text-[11px] text-white/80 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            to="/contact"
            className="font-cinzel text-xs text-white/80 hover:text-[#C9A84C] transition-colors"
            activeProps={{ className: "font-cinzel text-xs text-[#C9A84C]" }}
          >
            Contact
          </Link>
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
            <div className="border-t border-[#C9A84C]/20 pt-4">
              <p className="font-cinzel text-[10px] text-[#C9A84C] mb-3">Event Info</p>
              <div className="flex flex-col gap-3 pl-2">
                {eventInfoLinks.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-cinzel text-xs text-white/80">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact" onClick={() => setOpen(false)} className="font-cinzel text-sm text-white/90">Contact</Link>
            <Link to="/nominate" onClick={() => setOpen(false)} className="btn-gold w-fit">Nominate Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}
