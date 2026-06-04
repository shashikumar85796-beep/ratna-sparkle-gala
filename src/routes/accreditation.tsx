import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { toast, Toaster } from "sonner";
import { Upload, Mail, Phone, Newspaper, Camera, Video, Check } from "lucide-react";

export const Route = createFileRoute("/accreditation")({
  head: () => ({
    meta: [
      { title: "Press & Media Accreditation | BCS Ratna Award 2026" },
      { name: "description", content: "Apply for press accreditation to cover BCS Ratna Award 2026. Official media passes for journalists, photographers and videographers." },
      { property: "og:title", content: "Press & Media Accreditation | BCS Ratna Award 2026" },
      { property: "og:description", content: "Apply for official media accreditation for BCS Ratna Award 2026." },
      { property: "og:url", content: "/accreditation" },
    ],
    links: [{ rel: "canonical", href: "/accreditation" }],
  }),
  component: AccreditationPage,
});

type Form = {
  name: string; designation: string; org: string; mediaType: string;
  email: string; phone: string; website: string;
  coverage: string[]; idFile: File | null; clips: File[];
  plan: string; confirm1: boolean; confirm2: boolean;
};

const EMPTY: Form = {
  name: "", designation: "", org: "", mediaType: "",
  email: "", phone: "", website: "",
  coverage: [], idFile: null, clips: [],
  plan: "", confirm1: false, confirm2: false,
};

const COVERAGE_OPTS = ["Print Article", "Online Article", "TV Coverage", "YouTube Video", "Social Media", "Photography Only"];

function AccreditationPage() {
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const toggleCov = (c: string) => {
    set("coverage", f.coverage.includes(c) ? f.coverage.filter(x => x !== c) : [...f.coverage, c]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<keyof Form, string>> = {};
    if (!f.name.trim()) err.name = "Required";
    if (!f.designation) err.designation = "Select a designation";
    if (!f.org.trim()) err.org = "Required";
    if (!f.mediaType) err.mediaType = "Select media type";
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = "Valid organisation email required";
    if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 10) err.phone = "Valid mobile required";
    if (!f.website.trim()) err.website = "Required";
    if (f.coverage.length === 0) err.coverage = "Select at least one";
    if (!f.idFile) err.idFile = "Upload Press ID / valid ID proof";
    if (!f.confirm1) err.confirm1 = "Required";
    if (!f.confirm2) err.confirm2 = "Required";
    setErrors(err);
    if (Object.keys(err).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const ref = `#PRESS2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmitted(ref);
    toast.success("Accreditation request submitted");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen">
      <Toaster theme="dark" position="top-center" />
      <Navigation />

      <section className="relative pt-36 pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">For Media</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient leading-tight">PRESS & MEDIA<br/>ACCREDITATION</h1>
          <div className="gold-divider" />
          <p className="text-white/75 mt-4 text-lg">Official Media Coverage — BCS Ratna Award 2026</p>
          <span className="inline-block mt-5 px-5 py-2 rounded-full font-cinzel text-[10px] bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/40">
            Applications Close: March 1, 2026
          </span>
        </div>
      </section>

      {submitted ? (
        <section className="max-w-2xl mx-auto px-6 pb-24">
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gold-gradient text-black flex items-center justify-center mx-auto"><Check size={32} /></div>
            <h2 className="font-display text-3xl font-bold text-white mt-6">Application Submitted!</h2>
            <p className="text-white/70 mt-4 leading-relaxed">
              Your accreditation request has been received. Our media team will review and respond within 5 working days to <span className="text-[#C9A84C]">{f.email}</span>.
            </p>
            <p className="font-cinzel text-sm text-[#C9A84C] mt-6">Reference ID: {submitted}</p>
          </div>
        </section>
      ) : (
        <>
          <section className="max-w-7xl mx-auto px-6 pb-16">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: Newspaper, title: "Print Journalists", text: "Newspaper & magazine reporters" },
                { icon: Camera, title: "Photographers", text: "Professional event photographers" },
                { icon: Video, title: "Video Journalists", text: "TV crew and digital video creators" },
              ].map((c) => (
                <div key={c.title} className="glass-card p-7 text-center">
                  <c.icon size={32} className="text-[#C9A84C] mx-auto" />
                  <h3 className="font-display text-xl font-semibold text-white mt-4">{c.title}</h3>
                  <p className="text-sm text-white/60 mt-2">{c.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-4xl mx-auto px-6 pb-16">
            <div className="glass-card p-8 md:p-10">
              <p className="font-cinzel text-xs text-[#C9A84C] mb-4 text-center">What You Get</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "Official Media Pass & Lanyard",
                  "Dedicated Press Area with power outlets",
                  "High-resolution press kit & photos",
                  "Press conference access (pre-ceremony)",
                  "Direct access to winners post-ceremony",
                  "Official spokesperson for quotes",
                  "Wi-Fi access in press area",
                  "Refreshments in press lounge",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-[#C9A84C] mt-0.5">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="max-w-3xl mx-auto px-6 pb-20">
            <form onSubmit={submit} className="glass-card p-8 md:p-10 space-y-6">
              <div className="text-center mb-2">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Apply for Media Accreditation</h2>
                <p className="text-white/60 text-sm mt-2">Applications reviewed within 5 working days.</p>
              </div>

              <Field label="Full Name" required error={errors.name}>
                <input className={`input-gold ${errors.name ? "has-error" : ""}`} value={f.name} onChange={(e) => set("name", e.target.value)} />
              </Field>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Designation" required error={errors.designation}>
                  <select className={`input-gold ${errors.designation ? "has-error" : ""}`} value={f.designation} onChange={(e) => set("designation", e.target.value)}>
                    <option value="">Select…</option>
                    {["Reporter","Photographer","Videographer","Editor","Blogger/Digital Creator","Other"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Media Organisation / Publication" required error={errors.org}>
                  <input className={`input-gold ${errors.org ? "has-error" : ""}`} value={f.org} onChange={(e) => set("org", e.target.value)} />
                </Field>
              </div>

              <Field label="Type of Media" required error={errors.mediaType}>
                <select className={`input-gold ${errors.mediaType ? "has-error" : ""}`} value={f.mediaType} onChange={(e) => set("mediaType", e.target.value)}>
                  <option value="">Select…</option>
                  {["National Newspaper","Regional Newspaper","Magazine","News Channel","Digital News Portal","YouTube Channel","Podcast","Freelance"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Official Email" required helper="Use your organisation email" error={errors.email}>
                  <input type="email" className={`input-gold ${errors.email ? "has-error" : ""}`} value={f.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
                <Field label="Mobile Number" required error={errors.phone}>
                  <input className={`input-gold ${errors.phone ? "has-error" : ""}`} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
              </div>

              <Field label="Publication Website / Channel URL" required error={errors.website}>
                <input className={`input-gold ${errors.website ? "has-error" : ""}`} value={f.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
              </Field>

              <Field label="Expected Coverage Type" required error={errors.coverage}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {COVERAGE_OPTS.map((c) => (
                    <label key={c} className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer text-sm transition ${f.coverage.includes(c) ? "border-[#C9A84C] bg-[#C9A84C]/10 text-white" : "border-[#C9A84C]/20 text-white/70 hover:border-[#C9A84C]/40"}`}>
                      <input type="checkbox" checked={f.coverage.includes(c)} onChange={() => toggleCov(c)} className="accent-[#C9A84C]" />
                      {c}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Upload Press ID / Valid ID Proof" required helper="PDF or JPG, max 5MB" error={errors.idFile}>
                <FileDrop accept=".pdf,.jpg,.jpeg,.png" onFile={(file) => set("idFile", file)} file={f.idFile} />
              </Field>

              <Field label="Upload Last 3 Published Articles / Clips" helper="Optional. Multiple files supported.">
                <input type="file" multiple className="input-gold !py-2 file:bg-[#C9A84C] file:text-black file:font-cinzel file:text-[10px] file:px-3 file:py-1 file:border-0 file:rounded file:mr-3" onChange={(e) => set("clips", Array.from(e.target.files ?? []))} />
              </Field>

              <Field label="Brief about your coverage plan" helper={`${f.plan.length}/300`}>
                <textarea maxLength={300} rows={4} className="input-gold" value={f.plan} onChange={(e) => set("plan", e.target.value)} />
              </Field>

              <div className="space-y-3">
                <Consent checked={f.confirm1} onChange={(v) => set("confirm1", v)} error={errors.confirm1}>
                  I confirm I am a working journalist / media professional.
                </Consent>
                <Consent checked={f.confirm2} onChange={(v) => set("confirm2", v)} error={errors.confirm2}>
                  I agree to follow the event photography & coverage guidelines.
                </Consent>
              </div>

              <button type="submit" className="btn-gold w-full justify-center">Submit Accreditation Request</button>
            </form>
          </section>
        </>
      )}

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="glass-card p-8 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3">Media Contact</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center text-white/80">
            <a href="mailto:media@aavishkargroup.in" className="inline-flex items-center gap-2 hover:text-[#C9A84C]"><Mail size={16} /> media@aavishkargroup.in</a>
            <a href="tel:+919811120650" className="inline-flex items-center gap-2 hover:text-[#C9A84C]"><Phone size={16} /> +91-9811120650</a>
          </div>
          <p className="text-white/50 text-xs mt-3">For urgent media queries, WhatsApp only.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <p className="font-cinzel text-[13px] text-[#C9A84C] tracking-[0.3em] text-center mb-8">Previously Covered By</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["DD News","ABP","Zee News","ANI","PTI","Aaj Tak","NDTV","Business Standard"].map((l) => (
            <div key={l} className="bg-[#1A1A1A] rounded-xl p-6 border border-transparent hover:border-[#C9A84C] transition flex items-center justify-center">
              <img src={`https://placehold.co/200x80/1a1a1a/888888?text=${encodeURIComponent(l)}`} alt={l} className="max-w-full h-auto grayscale hover:grayscale-0 transition" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, required, helper, error, children }: { label: string; required?: boolean; helper?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}{required && <span className="req">*</span>}</label>
      {children}
      {error ? <p className="field-error">{error}</p> : helper ? <p className="field-helper">{helper}</p> : null}
    </div>
  );
}

function Consent({ checked, onChange, error, children }: { checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer text-sm text-white/80">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 accent-[#C9A84C]" />
        <span>{children}</span>
      </label>
      {error && <p className="field-error mt-1 ml-7">{error}</p>}
    </div>
  );
}

function FileDrop({ accept, file, onFile }: { accept: string; file: File | null; onFile: (f: File | null) => void }) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      className={`block border border-dashed rounded p-6 text-center cursor-pointer transition ${drag ? "border-[#C9A84C] bg-[#C9A84C]/10" : "border-[#C9A84C]/30 hover:border-[#C9A84C]/60"}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
    >
      <Upload size={22} className="text-[#C9A84C] mx-auto mb-2" />
      <p className="text-sm text-white/70">{file ? file.name : "Drop file here or click to browse"}</p>
      <input type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
    </label>
  );
}
