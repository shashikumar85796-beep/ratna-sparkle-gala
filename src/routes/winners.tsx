import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Award } from "lucide-react";

export const Route = createFileRoute("/winners")({
  head: () => ({
    meta: [
      { title: "Hall of Fame — BCS Ratna Award Winners" },
      { name: "description", content: "Celebrating all past winners of BCS Ratna Award — India's premier broadcasting and media industry honour since 2010." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Hall of Fame — BCS Ratna Award Winners" },
      { property: "og:description", content: "Celebrating all past winners of BCS Ratna Award — India's premier broadcasting and media industry honour since 2010." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bcsratnaaward.com/winners" },
      { property: "og:image", content: "/assets/BCS-Website-Logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hall of Fame — BCS Ratna Award Winners" },
      { name: "twitter:description", content: "India's premier broadcasting award winners since 2010." },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/winners" }],
  }),
  component: WinnersPage,
});

const WINNERS = [
  { year: "2024", name: "Zee Entertainment Enterprises", category: "Best Broadcaster of the Year", award: "Content Sector" },
  { year: "2024", name: "Tata Play", category: "Best DTH Service Provider", award: "Distribution Sector" },
  { year: "2024", name: "JioStar", category: "Best OTT Platform", award: "Digital Platform" },
  { year: "2023", name: "Sony Pictures Networks", category: "Best Entertainment Channel", award: "Content Sector" },
  { year: "2023", name: "DEN Networks", category: "Best Cable Operator (Metro)", award: "Distribution Sector" },
  { year: "2023", name: "Dish TV India", category: "Best DTH Service Provider", award: "Distribution Sector" },
  { year: "2022", name: "Star Sports", category: "Best Sports Channel", award: "Content Sector" },
  { year: "2022", name: "Hathway Cable", category: "Best MSO of the Year", award: "Distribution Sector" },
  { year: "2022", name: "Airtel Xstream", category: "Best Streaming Service", award: "Digital Platform" },
  { year: "2021", name: "NDTV 24x7", category: "Best News Channel (Hindi)", award: "Content Sector" },
  { year: "2021", name: "Sun TV Network", category: "Best News Channel (Regional)", award: "Content Sector" },
  { year: "2021", name: "R. K. Sharma", category: "Lifetime Achievement Award", award: "Individual Sector" },
];

function WinnersPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      {/* HERO */}
      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={35} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/assets/Trophy.png"
              alt=""
              aria-hidden="true"
              className="animate-float"
              style={{ width: "80px", height: "80px", objectFit: "contain", opacity: 0.9 }}
            />
            <div>
              <p className="font-cinzel text-xs text-[#C9A84C] mb-2">Hall of Fame</p>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">
                WINNERS
              </h1>
            </div>
          </div>
          <div className="gold-divider" />
          <p className="text-white/70 mt-4">
            Celebrating the best in Indian broadcasting, cable, satellite and digital media since 2010.
          </p>
        </div>
      </section>

      {/* WINNERS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle eyebrow="Past Laureates" title="BCS Ratna |Honourees|" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {WINNERS.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="glass-card p-8 group hover:border-[#C9A84C]/70 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-cinzel text-[10px] text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1 rounded-full">
                    {w.year}
                  </span>
                  <Award size={20} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mt-2">{w.name}</h3>
                <p className="text-sm text-[#C9A84C] mt-1 font-cinzel text-[11px]">{w.category}</p>
                <p className="text-xs text-white/50 mt-2">{w.award}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-white/50 text-sm mb-6">500+ awards given across 15 editions · More records being added</p>
            <Link to="/events" search={{}} className="btn-outline-gold">
              View All Past Events →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
