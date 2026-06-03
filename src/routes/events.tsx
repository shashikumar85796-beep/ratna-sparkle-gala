import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Past Events — BCS Ratna Award Editions" },
      { name: "description", content: "Relive every edition of the BCS Ratna Award from 2010 to 2024 — galleries, winners and highlights." },
    ],
  }),
  component: EventsPage,
});

const YEARS = Array.from({ length: 15 }, (_, i) => 2024 - i);
const POOL = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600&q=80",
];

function EventsPage() {
  const [open, setOpen] = useState<number | null>(2024);
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <section className="relative pt-36 pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">The Archive</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">Past Editions</h1>
          <div className="gold-divider" />
          <p className="text-white/70 mt-4">Fifteen years of unforgettable evenings.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-3">
        {YEARS.map((y) => {
          const isOpen = open === y;
          return (
            <div key={y} className="glass-card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : y)} className="w-full flex items-center justify-between p-6 text-left">
                <div className="flex items-center gap-6">
                  <span className="font-display text-3xl text-gold-gradient font-bold">{y}</span>
                  <span className="font-cinzel text-[11px] text-white/65">BCS Ratna Award · {y - 2009}{nth(y - 2009)} Edition</span>
                </div>
                <ChevronDown size={20} className={`text-[#C9A84C] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="p-6 pt-0 border-t border-[#C9A84C]/15">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                    {POOL.map((src, i) => (
                      <img key={i} src={src} alt={`${y} ceremony`} className="aspect-square object-cover border border-[#C9A84C]/20" />
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div>
                      <h4 className="font-cinzel text-[11px] text-[#C9A84C] mb-3">Notable Winners</h4>
                      <ul className="space-y-2 text-sm text-white/75">
                        <li>◆ Lifetime Achievement — Industry Veteran of {y}</li>
                        <li>◆ Best News Channel — National Network</li>
                        <li>◆ Best OTT Platform — Streaming Brand</li>
                        <li>◆ Best Innovation — Technology Solution</li>
                      </ul>
                    </div>
                    <div className="aspect-video border border-[#C9A84C]/20">
                      <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <Footer />
    </div>
  );
}

function nth(n: number) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
