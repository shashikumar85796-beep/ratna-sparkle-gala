import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Award, Globe, Handshake, TrendingUp, Play, Quote } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { SectionTitle } from "@/components/site/SectionTitle";
import { CATEGORIES } from "@/lib/categories";
import trophyPng from "@/assets/Trophy.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BCS Ratna Award 2026 — India's Premier Broadcasting & Media Award" },
      { name: "description", content: "Celebrating Excellence in Broadcasting, Digital Media & Technology since 2010. Nominations open for BCS Ratna Award 2026." },
      { property: "og:title", content: "BCS Ratna Award 2026" },
      { property: "og:description", content: "India's Most Prestigious Media Industry Award. Nominations Open." },
    ],
  }),
  component: HomePage,
});

const TARGET = new Date("2026-06-30T18:00:00+05:30").getTime();
function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      if (diff === 0) {
        setExpired(true);
      }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return { ...t, expired };
}

function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Hero />
      <Stats />
      <About />
      <Categories />
      <Gallery />
      <WhyUs />
      <VIPs />
      <Videos />
      <Chairman />
      <Partners />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  );
}

function Hero() {
  const { d, h, m, s, expired } = useCountdown();
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-[70px] md:pt-[148px]" style={{ overflow: "hidden" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.15),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
      <GoldParticles count={50} />

      {/* Trophy LEFT — gentle sway */}
      <div className="hero-trophy-wrap" style={{
        position: "absolute",
        left: "3%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src={trophyPng}
          alt="trophy"
          style={{
            height: "680px",
            width: "auto",
            objectFit: "contain",
            opacity: 0.65,
            display: "block",
            transformOrigin: "center bottom",
            animation: "trophySwayLeft 4.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Trophy RIGHT — gentle sway */}
      <div className="hero-trophy-wrap" style={{
        position: "absolute",
        right: "3%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src={trophyPng}
          alt="trophy"
          style={{
            height: "680px",
            width: "auto",
            objectFit: "contain",
            opacity: 0.75,
            display: "block",
            transformOrigin: "center bottom",
            animation: "trophySway 4s ease-in-out infinite",
          }}
        />
      </div>

      <div className="hero-content max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block font-cinzel text-[10px] sm:text-xs text-[#C9A84C] border border-[#C9A84C]/40 rounded-full px-4 py-2 mb-8">
            🏆 Since 2010 · India's Premier Media Award
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-gold-gradient leading-[1.05] tracking-tight"
        >
          BCS RATNA<br/>AWARD
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-display italic text-lg sm:text-2xl text-white/85 mt-6 max-w-3xl mx-auto"
        >
          Celebrating Excellence in Broadcasting, Digital Media &amp; Technology
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12"
        >
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">The 16th Edition · June 30, 2026</p>
          {expired ? (
            <div className="glass-card px-8 py-8">
              <p className="font-cinzel text-2xl sm:text-3xl text-[#C9A84C] font-bold">REGISTRATIONS CLOSED</p>
            </div>
          ) : (
            <>
              <p className="font-cinzel text-xs text-[#C9A84C] mb-3">REGISTRATION CLOSES</p>
              <div className="flex justify-center gap-3 sm:gap-5">
                {[["Days", d], ["Hours", h], ["Minutes", m], ["Seconds", s]].map(([label, val]) => (
                  <div key={label as string} className="glass-card px-3 py-3 sm:px-5 sm:py-4 min-w-[68px] sm:min-w-[88px]">
                    <div className="font-display text-2xl sm:text-4xl text-gold-gradient font-bold">
                      {String(val).padStart(2, "0")}
                    </div>
                    <div className="font-cinzel text-[9px] text-white/60 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/nominate" search={{ category: undefined }} className="btn-gold animate-pulse-gold">
            Nominate Now <ArrowRight size={16} />
          </Link>
          <Link to="/categories" className="btn-outline-gold">Explore Categories</Link>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { num: "14+", label: "Years of Excellence" },
    { num: "500+", label: "Awards Given" },
    { num: "200+", label: "Industry Partners" },
    { num: "50+", label: "Award Categories" },
  ];
  return (
    <section className="py-16 border-y border-[#C9A84C]/20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-4xl md:text-6xl text-gold-gradient font-bold">{s.num}</div>
            <div className="font-cinzel text-[11px] text-white/60 mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-3 bg-gold-gradient opacity-50 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden border-2 border-[#C9A84C]/60">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80"
              alt="BCS Ratna Award ceremony"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">About Us</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            India's Most <span className="text-gold-gradient italic">Celebrated</span><br/>Media Industry Award
          </h2>
          <div className="gold-divider !mx-0" />
          <p className="text-white/70 mt-6 leading-relaxed">
            The BCS Ratna Awards are bestowed annually by Aavishkar Media Group, recognising outstanding
            contributions in Broadcasting, Digital Media, Content, Distribution, Technology, DTH &amp; CATV
            industry. Since 2010, it has become the most awaited evening in India's B&amp;CS calendar — where
            leaders, innovators and storytellers gather to honour the year's defining work.
          </p>
          <div className="mt-8">
            <Link to="/about" className="btn-outline-gold">Read Our Story <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="Honours" title="Award |Categories|" subtitle="Six pillars of recognition across India's broadcasting and digital ecosystem." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="glass-card p-8 group hover:border-[#C9A84C]/70 transition-all duration-500 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full border border-[#C9A84C]/40 flex items-center justify-center mb-6 group-hover:bg-gold-gradient group-hover:text-black transition-all">
                <c.icon size={24} className="text-[#C9A84C] group-hover:text-black" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-white">{c.name}</h3>
              <p className="text-sm text-white/60 mt-3 leading-relaxed">{c.description}</p>
              <Link to="/nominate" search={{ category: c.id }} className="inline-flex items-center gap-2 mt-6 font-cinzel text-[11px] text-[#C9A84C] hover:gap-3 transition-all">
                Nominate <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const images = [
    { year: "2010", src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80" },
    { year: "2011", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80" },
    { year: "2012", src: "https://images.unsplash.com/photo-1493804714600-6edb1cd93080?auto=format&fit=crop&w=800&q=80" },
    { year: "2013", src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80" },
    { year: "2014", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80" },
    { year: "2015", src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80" },
    { year: "2016", src: "https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800&q=80" },
    { year: "2017", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" },
    { year: "2018", src: "https://images.unsplash.com/photo-1493804714600-6edb1cd93080?auto=format&fit=crop&w=800&q=80" },
    { year: "2019", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80" },
  ];
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (openIndex === null) return;
    if (e.key === "ArrowRight") setOpenIndex((openIndex + 1) % images.length);
    if (e.key === "ArrowLeft") setOpenIndex((openIndex - 1 + images.length) % images.length);
    if (e.key === "Escape") setOpenIndex(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">MEMORIES</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">
            Award Ceremony <span className="text-white">Glimpses</span>
          </h2>
          <div className="gold-divider" />
          <p className="text-white/70 mt-6 max-w-2xl mx-auto">
            A decade and more of red carpets, standing ovations and unforgettable nights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] sm:auto-rows-[300px]">
          {images.map((item, i) => (
            <button
              key={i}
              onClick={() => setOpenIndex(i)}
              className={`relative overflow-hidden rounded-lg group transition-all duration-300 hover:translate-y-[-8px] ${
                i % 5 === 0 ? "sm:col-span-1 lg:col-span-1 lg:row-span-2" : ""
              }`}
              style={{
                boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={item.src}
                alt={`Award Ceremony ${item.year}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div />
                <div>
                  <div className="inline-block bg-[#C9A84C] text-black px-3 py-1 rounded-full mb-2">
                    <span className="font-cinzel text-[11px] font-bold">{item.year}</span>
                  </div>
                  <p className="font-cinzel text-sm text-white">Award Ceremony {item.year}</p>
                  <button className="mt-3 text-[#C9A84C] font-cinzel text-[11px] hover:text-white transition flex items-center gap-1">
                    VIEW GALLERY →
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 border border-[#C9A84C]/30 group-hover:border-[#C9A84C] transition-colors duration-300 rounded-lg" />
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={openIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[openIndex].src}
              alt={`Gallery ${images[openIndex].year}`}
              className="w-full max-h-[85vh] object-contain border-2 border-[#C9A84C] rounded-lg"
            />

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full">
              <span className="font-cinzel text-xs text-[#C9A84C]">
                {openIndex + 1} / {images.length}
              </span>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg text-center">
              <p className="font-cinzel text-sm text-white">
                Award Ceremony {images[openIndex].year} — BCS Ratna Award
              </p>
            </div>

            <button
              onClick={() => setOpenIndex((openIndex - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-black text-[#C9A84C] transition-all flex items-center justify-center text-2xl"
            >
              ←
            </button>

            <button
              onClick={() => setOpenIndex((openIndex + 1) % images.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-black text-[#C9A84C] transition-all flex items-center justify-center text-2xl"
            >
              →
            </button>

            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#C9A84C] hover:bg-white text-black hover:text-[#C9A84C] transition-all flex items-center justify-center text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Award, title: "Credibility", text: "14 years of unbiased jury evaluation." },
    { icon: Globe, title: "Reach", text: "Covered by 100+ national media outlets." },
    { icon: Handshake, title: "Networking", text: "Connect with India's top media executives." },
    { icon: TrendingUp, title: "Visibility", text: "National recognition for your brand." },
  ];
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="The Difference" title="Why |BCS Ratna|" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.title} className="glass-card p-8 text-center hover:-translate-y-1 transition">
              <it.icon size={36} className="text-[#C9A84C] mx-auto" />
              <h3 className="font-display text-xl font-semibold mt-5">{it.title}</h3>
              <p className="text-sm text-white/60 mt-3 leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Videos() {
  const vids = [
    { id: "dQw4w9WgXcQ", title: "BCS Ratna 2019 Highlights" },
    { id: "ScMzIvxBSi4", title: "Best Moments 2018" },
    { id: "9bZkp7q19f0", title: "Lifetime Achievement Tribute" },
    { id: "kJQP7kiw5Fk", title: "Chairman's Address" },
    { id: "RgKAFK5djSk", title: "Red Carpet Specials" },
    { id: "OPf0YbXqDm0", title: "Trailer 2026 Edition" },
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="On Screen" title="Video |Gallery|" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vids.map((v) => (
            <button key={v.id} onClick={() => setOpen(v.id)} className="relative aspect-video overflow-hidden border border-[#C9A84C]/30 group">
              <img src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center group-hover:scale-110 transition">
                  <Play size={22} className="text-black ml-1" fill="currentColor" />
                </div>
              </div>
              <p className="absolute bottom-4 left-4 right-4 text-left font-cinzel text-xs text-white">{v.title}</p>
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6" onClick={() => setOpen(null)}>
          <div className="w-full max-w-5xl aspect-video">
            <iframe src={`https://www.youtube.com/embed/${open}?autoplay=1`} className="w-full h-full border border-[#C9A84C]/40" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  );
}

function Chairman() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C9A84C]/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionTitle eyebrow="Leadership" title="Chairman's |Message|" />
        <div className="glass-card p-10 md:p-16 grid md:grid-cols-3 gap-10 items-center">
          <div className="relative">
            <div className="absolute -inset-2 bg-gold-gradient opacity-40 blur-xl" />
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" alt="Chairman" className="relative w-full aspect-square object-cover border-2 border-[#C9A84C]/60" />
          </div>
          <div className="md:col-span-2">
            <Quote size={48} className="text-[#C9A84C]/60" />
            <p className="font-display italic text-xl md:text-2xl text-white/85 mt-4 leading-relaxed">
              "For fifteen years we have stood as the conscience of the Indian broadcasting industry —
              honouring the bold, the brilliant and the relentless. BCS Ratna is more than an award.
              It is a promise that excellence will always be seen, celebrated and remembered."
            </p>
            <div className="mt-8">
              <p className="font-display text-lg text-gold-gradient font-bold">R. K. Sharma</p>
              <p className="font-cinzel text-[10px] text-white/60 mt-1">Chairman · Aavishkar Media Group</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VIPs() {
  const vips = [
    { name: "Sh. Anurag Thakur", title: "Former I&B Minister", org: "Government of India", since: "2018" },
    { name: "Mr. Punit Goenka", title: "CEO", org: "Zee Entertainment", since: "2012" },
    { name: "Mr. Sunil Lulla", title: "MD & CEO", org: "Eros STX", since: "2014" },
    { name: "Ms. Shailja Kejriwal", title: "Chief Creative Officer", org: "Sony LIV", since: "2016" },
    { name: "Mr. Harit Nagpal", title: "MD & CEO", org: "Tata Play", since: "2013" },
    { name: "Mr. Saurabh Dhoot", title: "Chairman", org: "Videocon d2h", since: "2010" },
    { name: "Mr. Anil Malhotra", title: "Former Chairman", org: "TRAI", since: "2015" },
    { name: "Ms. Priya Nair", title: "VP Content", org: "JioStar", since: "2019" },
  ];
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-lg">◆</span>
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">Past Attendees</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient leading-tight">
            Industry Icons Who Graced BCS Ratna
          </h2>
          <div className="gold-divider" />
          <p className="text-white/60 max-w-2xl mx-auto mt-4 text-base leading-relaxed">
            Ministers, CEOs, and Media Veterans who have been part of our journey.
          </p>
        </div>
        <div className="flex md:grid gap-5 md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory">
          {vips.map((v) => (
            <div
              key={v.name}
              className="group relative bg-[#1A1A1A] rounded-2xl p-6 border border-[#C9A84C]/15 hover:border-[#C9A84C]/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(201,168,76,0.25)] min-w-[260px] md:min-w-0 snap-center text-center"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-full bg-gold-gradient opacity-30 blur-md group-hover:opacity-60 transition" />
                <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-[3px] border-[#C9A84C] bg-[#0d0d0d] flex items-center justify-center">
                  <span className="font-display text-4xl text-gold-gradient font-bold">
                    {v.name.split(" ").slice(-2).map(w => w[0]).join("")}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-black text-sm">
                  ★
                </div>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white leading-tight" style={{ fontFamily: '"Raleway", "DM Sans", sans-serif' }}>
                {v.name}
              </h3>
              <p className="text-[15px] text-[#C9A84C] mt-1.5">{v.title}</p>
              <p className="text-sm text-[#B0B0B0] mt-0.5">{v.org}</p>
              <span className="inline-block mt-4 px-3 py-1 rounded-full text-[10px] font-cinzel bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30">
                Since {v.since}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-white/55 text-sm mb-5">And 200+ more industry leaders across 14 years</p>
          <Link to="/events" className="btn-outline-gold">View All Past Attendees</Link>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const title = ["Zee TV", "Sony Pictures", "Star Sports"];
  const associate = ["Hathway", "DEN Networks", "JioStar", "Tata Play", "Dish TV"];
  const others = [
    "Cisco", "Airtel", "Sun TV", "Colors", "Discovery", "NDTV", "Aaj Tak", "ABP",
    "India Today", "Network18", "Republic", "TV9", "Times Now", "CNN-News18",
    "Bloomberg", "ET Now", "Mirror Now", "Zee News", "WION", "DD News",
  ];
  const ph = (label: string, w = 200, h = 80) =>
    `https://placehold.co/${w}x${h}/1a1a1a/888888?text=${encodeURIComponent(label)}`;

  const Card = ({ label, w, h, padding }: { label: string; w: number; h: number; padding: string }) => (
    <div
      className={`group bg-[#1A1A1A] rounded-xl ${padding} border border-transparent hover:border-[#C9A84C] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(201,168,76,0.3)] flex items-center justify-center`}
    >
      <img
        src={ph(label, w, h)}
        alt={label}
        className="max-w-full h-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
        loading="lazy"
      />
    </div>
  );

  return (
    <section className="py-24 md:py-32 border-y border-[#C9A84C]/15 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient">OUR PARTNERS & SPONSORS</h2>
          <div className="gold-divider" />
          <p className="text-white/60 mt-4 text-base">Trusted by India's leading media and broadcast organisations.</p>
        </div>

        <div className="mb-14">
          <p className="font-cinzel text-[13px] text-[#C9A84C] tracking-[0.3em] text-center mb-6">Title Partners</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {title.map((l) => <Card key={l} label={l} w={260} h={120} padding="p-10" />)}
          </div>
        </div>

        <div className="mb-14">
          <p className="font-cinzel text-[13px] text-[#C9A84C] tracking-[0.3em] text-center mb-6">Associate Partners</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {associate.map((l) => <Card key={l} label={l} w={200} h={90} padding="p-6" />)}
          </div>
        </div>

        <div>
          <p className="font-cinzel text-[13px] text-[#C9A84C] tracking-[0.3em] text-center mb-6">Other Partners</p>
          <div className="relative overflow-hidden marquee-group">
            <div className="flex gap-5 marquee-track">
              {[...others, ...others].map((l, i) => (
                <div key={i} className="shrink-0 w-[180px]">
                  <Card label={l} w={160} h={70} padding="p-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { quote: "Receiving the BCS Ratna was the proudest moment of my career — a true reflection of years of dedication.", name: "Anil Kapoor", role: "CEO, Vision Broadcasting" },
    { quote: "There is no platform more credible in Indian broadcasting. The BCS Ratna jury sets the gold standard.", name: "Priya Mehta", role: "Founder, Streamly OTT" },
    { quote: "An evening where the entire industry comes together to honour what truly matters — craft and courage.", name: "Rajesh Iyer", role: "MD, NorthStar Networks" },
  ];
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="Voices" title="What Leaders |Say|" />
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="glass-card p-8">
              <Quote size={28} className="text-[#C9A84C]" />
              <p className="font-display italic text-lg text-white/85 mt-4 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 pt-6 border-t border-[#C9A84C]/20">
                <p className="font-display text-lg text-gold-gradient font-bold">{t.name}</p>
                <p className="font-cinzel text-[10px] text-white/55 mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gold-gradient opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(0,0,0,0.6))]" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <p className="font-cinzel text-xs text-black/80 mb-4">Nominations Now Open</p>
        <h2 className="font-display text-3xl md:text-5xl font-black text-black leading-tight">
          BCS Ratna Award 2026
        </h2>
        <p className="text-black/80 mt-6 max-w-2xl mx-auto">
          Join the legends. Stake your claim. Be celebrated at India's most prestigious media gala.
        </p>
        <div className="mt-10">
          <Link to="/nominate" search={{ category: undefined }} className="inline-flex items-center gap-2 bg-black text-[#C9A84C] font-cinzel text-xs px-10 py-5 hover:bg-[#0a0a0a] hover:scale-105 transition-all border-2 border-black animate-pulse-gold">
            Register &amp; Nominate Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
