import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import trophyImg from "@/assets/Trophy.png";
import logoTextImg from "@/assets/BCS-Website-Logo.png";

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#C9A84C]/20 pt-20 pb-8 relative overflow-hidden">
      <img
        src={trophyImg}
        alt=""
        aria-hidden="true"
        className="footer-trophy footer-trophy-left"
      />
      <img
        src={trophyImg}
        alt=""
        aria-hidden="true"
        className="footer-trophy footer-trophy-right"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-12 border-b border-[#C9A84C]/15">
          <div className="lg:col-span-2">
            <img
              src={logoTextImg}
              alt="BCS Ratna Award"
              style={{ height: "60px", width: "auto", objectFit: "contain" }}
              className="mb-2"
            />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "#B0B0B0", letterSpacing: "2px", textTransform: "uppercase", marginTop: "8px" }}>
              Broadcasting | Content | Social
            </p>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "12px", color: "#666666", marginTop: "4px" }}>
              by Aavishkar Media Pvt. Ltd.
            </p>
            <p className="text-sm text-white/60 mt-4 leading-relaxed max-w-sm">
              India's most prestigious Broadcasting, Cable & Satellite industry award by Aavishkar Media Group.
            </p>
            <form className="mt-6 flex flex-col sm:flex-row gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className="input-gold text-sm flex-1" style={{ minHeight: "48px", fontSize: "15px" }} />
              <button className="btn-gold font-cinzel" style={{ minWidth: "130px", whiteSpace: "nowrap", padding: "12px 20px", fontSize: "14px", height: "48px" }}>SUBSCRIBE</button>
            </form>
          </div>

          <FooterCol title="Quick Links" links={[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/categories", label: "Categories" },
            { to: "/events", label: "Past Events" },
            { to: "/contact", label: "Contact" },
          ]} />

          <FooterCol title="Event Info" links={[
            { to: "/schedule", label: "Schedule & Programme" },
            { to: "/venue", label: "Venue & Directions" },
            { to: "/accreditation", label: "Press Accreditation" },
            { to: "/nominate", label: "Nominate Now" },
          ]} />

          <FooterCol title="Legal" links={[
            { to: "/privacy-policy", label: "Privacy Policy" },
            { to: "/terms-conditions", label: "Terms & Conditions" },
            { to: "/refund-policy", label: "Refund Policy" },
          ]} />

          <div>
            <h4 className="font-cinzel text-xs text-[#C9A84C] mb-5">Reach Us</h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex gap-2"><MapPin size={16} className="text-[#C9A84C] shrink-0 mt-0.5" /><span>B-263, Indra Nagar, Adarsh Nagar, New Delhi-110033</span></li>
              <li className="flex gap-2"><Phone size={16} className="text-[#C9A84C] shrink-0 mt-0.5" /><span>+91-9811120650<br/>+91-9811930420</span></li>
              <li className="flex gap-2"><Mail size={16} className="text-[#C9A84C] shrink-0 mt-0.5" /><a href="mailto:info@aavishkargroup.in">info@aavishkargroup.in</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
          <p className="text-xs text-white/50 text-center md:text-left">
            © 2026 BCS Ratna Award · Aavishkar Media Pvt. Ltd. · All Rights Reserved
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-cinzel text-xs text-[#C9A84C] mb-5">{title}</h4>
      <ul className="space-y-2.5 text-sm text-white/65">
        {links.map((l, i) => (
          <li key={i}><Link to={l.to} className="hover:text-[#C9A84C] transition">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
