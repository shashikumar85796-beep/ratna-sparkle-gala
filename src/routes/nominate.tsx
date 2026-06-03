import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy, Lock, Shield, Upload, Award, Sparkles, Download } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { CATEGORIES, INDIAN_STATES } from "@/lib/categories";
import { toast } from "sonner";
import { Toaster } from "sonner";

export const Route = createFileRoute("/nominate")({
  head: () => ({
    meta: [
      { title: "Register Your Nomination — BCS Ratna Award 2025" },
      { name: "description", content: "Secure your nomination for India's most prestigious media award. Choose your category and complete registration." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: NominatePage,
});

type FormData = {
  fullName: string;
  designation: string;
  organisation: string;
  orgType: string;
  experience: string;
  email: string;
  mobile: string;
  whatsapp: string;
  website: string;
  bio: string;
  achievements: string;
  whyDeserve: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst: string;
  referral: string;
  referralCode: string;
  terms: boolean;
  truth: boolean;
};

const EMPTY: FormData = {
  fullName: "", designation: "", organisation: "", orgType: "", experience: "",
  email: "", mobile: "", whatsapp: "", website: "",
  bio: "", achievements: "", whyDeserve: "",
  address: "", city: "", state: "", pincode: "", gst: "",
  referral: "", referralCode: "", terms: false, truth: false,
};

function NominatePage() {
  const search = Route.useSearch();
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<string>(search.category ?? "");
  const [subCategory, setSubCategory] = useState("");
  const [form, setForm] = useState<FormData>(EMPTY);
  const [done, setDone] = useState<{ id: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const gst = category ? Math.round(category.fee * 0.18) : 0;
  const total = category ? category.fee + gst : 0;

  return (
    <div className="bg-background min-h-screen">
      <Toaster theme="dark" position="top-center" />
      <Navigation />

      {!done && (
        <>
          <NominateHero />
          <Stepper step={step} />
          <div className="max-w-5xl mx-auto px-6 pb-24">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepWrap key="1">
                  <Step1
                    selectedId={categoryId}
                    onSelect={setCategoryId}
                    sub={subCategory}
                    onSub={setSubCategory}
                    onNext={() => {
                      if (!categoryId) return toast.error("Please choose a category");
                      if (!subCategory) return toast.error("Please choose a sub-category");
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </StepWrap>
              )}
              {step === 2 && (
                <StepWrap key="2">
                  <Step2
                    form={form}
                    setForm={(f) => { setForm(f); if (Object.keys(errors).length) setErrors(validateForm(f)); }}
                    errors={errors}
                    onBack={() => setStep(1)}
                    onNext={() => {
                      const e = validateForm(form);
                      setErrors(e);
                      const keys = Object.keys(e);
                      if (keys.length) {
                        toast.error(e[keys[0] as keyof FormData] ?? "Please check the highlighted fields");
                        return;
                      }
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </StepWrap>
              )}
              {step === 3 && category && (
                <StepWrap key="3">
                  <Step3
                    fee={category.fee}
                    gst={gst}
                    total={total}
                    categoryName={category.name}
                    subCategory={subCategory}
                    nominee={form.fullName}
                    onBack={() => setStep(2)}
                    onConfirm={() => {
                      const id = "BCS2025" + Math.random().toString(36).slice(2, 8).toUpperCase();
                      setDone({ id });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </StepWrap>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {done && (
        <Success
          id={done.id}
          category={category?.name ?? ""}
          subCategory={subCategory}
          name={form.fullName}
        />
      )}

      <Footer />
    </div>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
      {children}
    </motion.div>
  );
}

function NominateHero() {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      <GoldParticles count={30} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <p className="font-cinzel text-xs text-[#C9A84C] mb-4">BCS Ratna 2025</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-gold-gradient">
          Register Your Nomination
        </h1>
        <div className="gold-divider" />
        <p className="text-white/70 mt-4">Join India's Most Prestigious Media Industry Award</p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {["Secure Payment", "Official Recognition", "Expert Jury Panel"].map((t) => (
            <span key={t} className="flex items-center gap-2 px-4 py-2 border border-[#C9A84C]/30 rounded-full font-cinzel text-[10px] text-[#C9A84C]">
              <Check size={14} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["Select Category", "Personal Details", "Payment"];
  return (
    <div className="sticky top-16 z-40 bg-black/85 backdrop-blur-md border-y border-[#C9A84C]/20 py-5">
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-cinzel text-xs transition-all ${active ? "bg-gold-gradient text-black" : done ? "bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]" : "border border-white/20 text-white/40"}`}>
                  {done ? <Check size={14} /> : n}
                </div>
                <span className={`hidden sm:block font-cinzel text-[10px] ${active || done ? "text-[#C9A84C]" : "text-white/40"}`}>{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-3 ${done ? "bg-[#C9A84C]" : "bg-white/10"}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step1({ selectedId, onSelect, sub, onSub, onNext }: {
  selectedId: string; onSelect: (s: string) => void; sub: string; onSub: (s: string) => void; onNext: () => void;
}) {
  const selected = CATEGORIES.find((c) => c.id === selectedId);
  return (
    <div className="pt-14">
      <h2 className="font-display text-3xl font-bold text-center">Choose Your <span className="text-gold-gradient">Nomination Category</span></h2>
      <div className="gold-divider" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {CATEGORIES.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => { onSelect(c.id); onSub(""); }}
              className={`text-left glass-card p-6 transition-all relative ${active ? "border-[#C9A84C] !bg-[#C9A84C]/10 shadow-[0_0_30px_rgba(201,168,76,0.3)]" : "hover:border-[#C9A84C]/60"}`}
            >
              {active && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
                  <Check size={14} className="text-black" />
                </div>
              )}
              <c.icon size={28} className="text-[#C9A84C]" />
              <h3 className="font-display text-xl font-semibold mt-4">{c.name}</h3>
              <p className="text-xs text-white/55 mt-2">{c.short}</p>
              <p className="font-cinzel text-[11px] text-[#C9A84C] mt-5 pt-4 border-t border-[#C9A84C]/20">
                ₹{c.fee.toLocaleString("en-IN")} + GST
              </p>
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 glass-card p-8">
          <p className="font-cinzel text-[10px] text-[#C9A84C] mb-3">Select Sub-Category</p>
          <h3 className="font-display text-xl mb-5">{selected.name}</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {selected.subcategories.map((s) => (
              <button
                key={s}
                onClick={() => onSub(s)}
                className={`text-left px-4 py-3 border text-sm transition-all ${sub === s ? "border-[#C9A84C] bg-[#C9A84C]/10 text-white" : "border-white/15 text-white/70 hover:border-[#C9A84C]/50"}`}
              >
                {sub === s && <Check size={14} className="inline text-[#C9A84C] mr-2" />}
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex justify-end mt-10">
        <button onClick={onNext} className="btn-gold">Next: Fill Details <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function Field({ label, required, helper, error, children }: {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        {label}{required && <span className="req">*</span>}
      </label>
      {children}
      {error ? (
        <p className="field-error">{error}</p>
      ) : helper ? (
        <p className="field-helper">{helper}</p>
      ) : null}
    </div>
  );
}

function Step2({ form, setForm, onBack, onNext }: {
  form: FormData; setForm: (f: FormData) => void; onBack: () => void; onNext: () => void;
}) {
  const update = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm({ ...form, [k]: v });
  const [photo, setPhoto] = useState<string | null>(null);

  return (
    <div className="pt-14 space-y-10">
      <Block title="Nominee Information">
        <Field label="Full Name of Nominee" required><input className="input-gold" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
        <Field label="Designation / Title" required><input className="input-gold" value={form.designation} onChange={(e) => update("designation", e.target.value)} /></Field>
        <Field label="Organisation / Company Name" required><input className="input-gold" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} /></Field>
        <Field label="Organisation Type">
          <select className="input-gold" value={form.orgType} onChange={(e) => update("orgType", e.target.value)}>
            <option value="">Select…</option>
            {["Broadcaster","Distributor","Technology Company","Digital Platform","Individual","Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Years in Industry">
          <select className="input-gold" value={form.experience} onChange={(e) => update("experience", e.target.value)}>
            <option value="">Select…</option>
            {["1-5","5-10","10-20","20+"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
      </Block>

      <Block title="Contact Information">
        <Field label="Email Address" required><input type="email" className="input-gold" value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
        <Field label="Mobile Number" required>
          <div className="flex">
            <span className="input-gold !w-auto !rounded-r-none border-r-0 text-white/70">+91</span>
            <input className="input-gold !rounded-l-none" value={form.mobile} onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </div>
        </Field>
        <Field label="WhatsApp Number"><input className="input-gold" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} /></Field>
        <Field label="Official Website URL"><input className="input-gold" placeholder="https://" value={form.website} onChange={(e) => update("website", e.target.value)} /></Field>
      </Block>

      <Block title="Nominee Profile">
        <div className="md:col-span-2">
          <Field label="Upload Profile Photo (max 5MB)">
            <label className="block border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] p-8 text-center cursor-pointer transition">
              {photo ? (
                <img src={photo} alt="" className="w-24 h-24 mx-auto object-cover rounded-full border-2 border-[#C9A84C]" />
              ) : (
                <>
                  <Upload size={28} className="text-[#C9A84C] mx-auto" />
                  <p className="font-cinzel text-[10px] text-white/60 mt-3">Drag & drop or click — JPG / PNG</p>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) return toast.error("File too large (max 5MB)");
                setPhoto(URL.createObjectURL(f));
              }} />
            </label>
          </Field>
        </div>
        <Counter label="Brief Bio" value={form.bio} onChange={(v) => update("bio", v)} max={500} />
        <Counter label="Key Achievements" value={form.achievements} onChange={(v) => update("achievements", v)} max={800} />
        <div className="md:col-span-2">
          <Counter label="Why do you deserve this award?" value={form.whyDeserve} onChange={(v) => update("whyDeserve", v)} max={1000} />
        </div>
      </Block>

      <Block title="Organisation Details">
        <div className="md:col-span-2"><Field label="Company Address" required><input className="input-gold" value={form.address} onChange={(e) => update("address", e.target.value)} /></Field></div>
        <Field label="City" required><input className="input-gold" value={form.city} onChange={(e) => update("city", e.target.value)} /></Field>
        <Field label="State" required>
          <select className="input-gold" value={form.state} onChange={(e) => update("state", e.target.value)}>
            <option value="">Select…</option>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="PIN Code" required><input className="input-gold" maxLength={6} value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} /></Field>
        <Field label="GST Number (for invoice)"><input className="input-gold" value={form.gst} onChange={(e) => update("gst", e.target.value.toUpperCase())} /></Field>
      </Block>

      <Block title="Referral">
        <Field label="How did you hear about us?">
          <select className="input-gold" value={form.referral} onChange={(e) => update("referral", e.target.value)}>
            <option value="">Select…</option>
            {["Social Media","Industry Colleague","Email","Website","Advertisement","Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Referral Code"><input className="input-gold" value={form.referralCode} onChange={(e) => update("referralCode", e.target.value)} /></Field>
      </Block>

      <div className="space-y-3 pt-2">
        {[
          ["terms", "I agree to the Terms & Conditions and Nomination Guidelines"],
          ["truth", "I confirm all information provided is accurate and truthful"],
        ].map(([k, t]) => (
          <label key={k} className="flex items-start gap-3 text-sm text-white/75 cursor-pointer">
            <input type="checkbox" checked={form[k as "terms" | "truth"]} onChange={(e) => update(k as "terms" | "truth", e.target.checked)} className="mt-1 w-4 h-4 accent-[#C9A84C]" />
            <span>{t}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <button onClick={onBack} className="btn-outline-gold"><ArrowLeft size={16} /> Back</button>
        <button onClick={onNext} className="btn-gold">Proceed to Payment <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-8">
      <p className="font-cinzel text-[11px] text-[#C9A84C] mb-6 pb-4 border-b border-[#C9A84C]/20">{title}</p>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Counter({ label, value, onChange, max }: { label: string; value: string; onChange: (v: string) => void; max: number }) {
  return (
    <Field label={label}>
      <textarea
        rows={3}
        className="input-gold resize-none"
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-[10px] text-white/45 mt-1 text-right">{value.length} / {max}</p>
    </Field>
  );
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validateForm(f: FormData): FormErrors {
  const e: FormErrors = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required";
  if (!f.designation.trim()) e.designation = "Designation is required";
  if (!f.organisation.trim()) e.organisation = "Organisation is required";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
  if (f.mobile.length !== 10) e.mobile = "Mobile must be 10 digits";
  if (!f.address.trim()) e.address = "Address is required";
  if (!f.city.trim()) e.city = "City is required";
  if (!f.state) e.state = "Please select a state";
  if (f.pincode.length !== 6) e.pincode = "PIN must be 6 digits";
  if (!f.terms) e.terms = "Please accept the terms & conditions";
  if (!f.truth) e.truth = "Please confirm accuracy";
  return e;
}

function Step3({ fee, gst, total, categoryName, subCategory, nominee, onBack, onConfirm }: {
  fee: number; gst: number; total: number; categoryName: string; subCategory: string; nominee: string;
  onBack: () => void; onConfirm: () => void;
}) {
  const [tab, setTab] = useState<"upi" | "card" | "bank">("upi");
  const [utr, setUtr] = useState("");

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied!"); };

  return (
    <div className="pt-14 grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 glass-card p-8 h-fit lg:sticky lg:top-32">
        <p className="font-cinzel text-[11px] text-[#C9A84C] mb-5 pb-4 border-b border-[#C9A84C]/20">Order Summary</p>
        <Row k="Award" v="BCS Ratna 2025" />
        <Row k="Category" v={categoryName} />
        <Row k="Sub-Category" v={subCategory} />
        <Row k="Nominee" v={nominee || "—"} />
        <div className="border-t border-[#C9A84C]/15 mt-4 pt-4 space-y-2">
          <Row k="Registration Fee" v={`₹${fee.toLocaleString("en-IN")}`} />
          <Row k="GST (18%)" v={`₹${gst.toLocaleString("en-IN")}`} />
        </div>
        <div className="border-t border-[#C9A84C]/40 mt-4 pt-4 flex justify-between items-center">
          <span className="font-cinzel text-xs text-[#C9A84C]">Total</span>
          <span className="font-display text-3xl text-gold-gradient font-bold">₹{total.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {["🔒 256-bit SSL","PCI DSS","Razorpay Verified"].map((b) => (
            <span key={b} className="text-[10px] font-cinzel text-white/60 px-2 py-1 border border-white/15">{b}</span>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="flex border-b border-[#C9A84C]/20">
          {([["upi","UPI / QR"],["card","Card / NetBanking"],["bank","NEFT / RTGS"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-4 font-cinzel text-[11px] transition ${tab === k ? "text-[#C9A84C] border-b-2 border-[#C9A84C]" : "text-white/50"}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="glass-card p-8 mt-6">
          {tab === "upi" && (
            <div className="space-y-5">
              <div className="bg-white p-6 w-fit mx-auto">
                <img alt="UPI QR" className="w-48 h-48" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=awards@aavishkar&pn=Aavishkar%20Media" />
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="font-cinzel text-xs text-white/70">UPI ID:</span>
                <code className="text-[#C9A84C]">awards@aavishkar</code>
                <button onClick={() => copy("awards@aavishkar")} className="text-[#C9A84C] hover:opacity-70"><Copy size={14} /></button>
              </div>
              <Field label="UTR / Transaction ID"><input className="input-gold" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="Enter UTR after payment" /></Field>
              <label className="block border-2 border-dashed border-[#C9A84C]/40 p-6 text-center cursor-pointer hover:border-[#C9A84C]">
                <Upload size={24} className="text-[#C9A84C] mx-auto" />
                <p className="font-cinzel text-[10px] text-white/60 mt-2">Upload Payment Screenshot</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          )}
          {tab === "card" && (
            <div className="text-center py-10 space-y-5">
              <Shield size={40} className="text-[#C9A84C] mx-auto" />
              <p className="text-white/70">Secure checkout via Razorpay</p>
              <p className="text-xs text-white/50">Visa · Mastercard · RuPay · Net Banking · UPI</p>
              <button className="btn-gold mx-auto"><Lock size={14} /> Pay Securely ₹{total.toLocaleString("en-IN")}</button>
            </div>
          )}
          {tab === "bank" && (
            <div className="space-y-3 text-sm">
              {[
                ["Bank Name","HDFC Bank"],
                ["Account Name","Aavishkar Media Pvt Ltd"],
                ["Account No.","50100 4567 89123"],
                ["IFSC Code","HDFC0001234"],
                ["Branch","Adarsh Nagar, New Delhi"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/10 py-3">
                  <span className="font-cinzel text-[10px] text-white/55">{k}</span>
                  <span className="text-[#C9A84C] font-medium flex items-center gap-2">{v} <button onClick={() => copy(v)} className="opacity-60 hover:opacity-100"><Copy size={12} /></button></span>
                </div>
              ))}
              <Field label="Reference Number"><input className="input-gold" placeholder="NEFT/RTGS reference" /></Field>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button onClick={onBack} className="btn-outline-gold"><ArrowLeft size={16} /> Back</button>
          <button onClick={onConfirm} className="btn-gold animate-pulse-gold">
            <Lock size={14} /> Confirm &amp; Pay ₹{total.toLocaleString("en-IN")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between py-1.5 text-sm gap-3"><span className="text-white/55">{k}</span><span className="text-white text-right">{v}</span></div>;
}

function Success({ id, category, subCategory, name }: { id: string; category: string; subCategory: string; name: string }) {
  const confetti = useMemo(
    () => Array.from({ length: 60 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      size: 4 + Math.random() * 6,
      i,
    })),
    []
  );
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      <GoldParticles count={40} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <span key={c.i} className="absolute" style={{
            left: `${c.left}%`, top: "-20px",
            width: `${c.size}px`, height: `${c.size}px`,
            background: "linear-gradient(135deg,#FCF6BA,#C9A84C)",
            animation: `float-up ${c.duration}s linear ${c.delay}s infinite reverse`,
          }} />
        ))}
      </div>
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="w-28 h-28 rounded-full bg-gold-gradient flex items-center justify-center mx-auto animate-pulse-gold">
          <Check size={56} className="text-black" strokeWidth={3} />
        </motion.div>
        <p className="font-cinzel text-xs text-[#C9A84C] mt-8">Nomination Confirmed</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mt-3">Welcome to the Gala</h1>
        <p className="text-white/70 mt-4">Your nomination has been successfully registered. A confirmation email will arrive within 24 hours.</p>
        <div className="glass-card p-6 mt-10 text-left max-w-md mx-auto">
          <p className="font-cinzel text-[10px] text-[#C9A84C] mb-3">Nomination ID</p>
          <div className="flex items-center justify-between">
            <code className="font-display text-2xl text-gold-gradient font-bold">#{id}</code>
            <button onClick={() => { navigator.clipboard.writeText(id); toast.success("Copied!"); }} className="text-[#C9A84C]"><Copy size={16} /></button>
          </div>
          <div className="mt-5 pt-5 border-t border-[#C9A84C]/20 space-y-2 text-sm">
            <Row k="Nominee" v={name} />
            <Row k="Category" v={category} />
            <Row k="Sub-Category" v={subCategory} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <a href="#" className="btn-outline-gold"><Sparkles size={14} /> Share on LinkedIn</a>
          <a href="#" className="btn-outline-gold"><Sparkles size={14} /> Twitter</a>
          <a href="#" className="btn-outline-gold"><Sparkles size={14} /> WhatsApp</a>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <button className="btn-gold"><Download size={14} /> Download Receipt</button>
          <Link to="/" className="btn-outline-gold"><Award size={14} /> Return Home</Link>
        </div>
      </div>
    </section>
  );
}
