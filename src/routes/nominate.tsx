import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy, Lock, Shield, Upload, Award, Download, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { CATEGORIES, INDIAN_STATES } from "@/lib/categories";
import { toast } from "sonner";
import { Toaster } from "sonner";

export const Route = createFileRoute("/nominate")({
  head: () => ({
    meta: [
      { title: "Register Your Nomination — BCS Ratna Award 2026" },
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
  mobile: string;
  whatsapp: string;
  whatsappSame: boolean;
  email: string;
  city: string;
  state: string;
  category: string;
  subCategories: string[];
  bio: string;
  achievements: string;
  whyDeserve: string;
  website: string;
  address: string;
  pincode: string;
  gst: string;
  terms: boolean;
  truth: boolean;
  contactConsent: boolean;
};

const EMPTY: FormData = {
  fullName: "", designation: "", organisation: "", orgType: "", mobile: "",
  whatsapp: "", whatsappSame: false, email: "", city: "", state: "",
  category: "", subCategories: [],
  bio: "", achievements: "", whyDeserve: "", website: "", address: "",
  pincode: "", gst: "",
  terms: false, truth: false, contactConsent: false,
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validateStep1(f: FormData): FormErrors {
  const e: FormErrors = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required";
  if (!f.designation.trim()) e.designation = "Designation is required";
  if (!f.organisation.trim()) e.organisation = "Organisation is required";
  if (!f.orgType) e.orgType = "Organisation type is required";
  if (f.mobile.length !== 10) e.mobile = "Mobile must be 10 digits";
  if (!f.email.trim() || !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Valid email is required";
  if (!f.city.trim()) e.city = "City is required";
  if (!f.state) e.state = "State is required";
  return e;
}

function validateStep3(f: FormData): FormErrors {
  const e: FormErrors = {};
  if (!f.bio.trim()) e.bio = "Bio is required";
  if (!f.achievements.trim()) e.achievements = "Achievements are required";
  if (!f.whyDeserve.trim()) e.whyDeserve = "Please explain why you deserve this award";
  if (!f.address.trim()) e.address = "Address is required";
  if (f.pincode.length !== 6) e.pincode = "PIN must be 6 digits";
  if (!f.terms) e.terms = "Please accept the terms & conditions";
  if (!f.truth) e.truth = "Please confirm accuracy";
  return e;
}

function NominatePage() {
  const search = Route.useSearch();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>({
    ...EMPTY,
    category: search.category ?? "",
  });
  const [done, setDone] = useState<{ id: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const category = CATEGORIES.find((c) => c.id === form.category);
  const gst = 0;
  const total = 11800;

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen">
      <Toaster theme="dark" position="top-center" />
      <Navigation />

      {!done && (
        <>
          <NominateHero />
          <Stepper step={step} />
          <div className="max-w-5xl mx-auto px-6 pb-24 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <StepWrap key="1" direction={direction}>
                  <Step1
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                    onNext={() => goTo(2)}
                  />
                </StepWrap>
              )}
              {step === 2 && (
                <StepWrap key="2" direction={direction}>
                  <Step2
                    form={form}
                    setForm={setForm}
                    onBack={() => goTo(1)}
                    onNext={() => goTo(3)}
                  />
                </StepWrap>
              )}
              {step === 3 && (
                <StepWrap key="3" direction={direction}>
                  <Step3
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                    onBack={() => goTo(2)}
                    onNext={() => goTo(4)}
                  />
                </StepWrap>
              )}
              {step === 4 && category && (
                <StepWrap key="4" direction={direction}>
                  <Step4
                    form={form}
                    category={category}
                    gst={gst}
                    total={total}
                    onBack={() => goTo(3)}
                    onConfirm={() => {
                      const id = "BCS2026" + Math.random().toString(36).slice(2, 8).toUpperCase();
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
          subCategories={form.subCategories}
          name={form.fullName}
        />
      )}

      <Footer />
    </div>
  );
}

function StepWrap({ children, direction }: { children: React.ReactNode; direction: number }) {
  const xOffset = 60;
  return (
    <motion.div
      custom={direction}
      initial={{ opacity: 0, x: direction * xOffset }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -xOffset }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

function NominateHero() {
  return (
    <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
      <GoldParticles count={30} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <p className="font-cinzel text-xs text-[#C9A84C] mb-4">BCS Ratna 2026</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="/assets/Trophy.png"
            alt=""
            aria-hidden="true"
            className="animate-float hidden sm:block"
            style={{ width: "60px", height: "60px", objectFit: "contain" }}
          />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">
            Register Your Nomination
          </h1>
        </div>
        <div className="gold-divider" />
        <p className="text-white/70 mt-4">BCS Ratna Award 2026 — Nominations Close June 30, 2026</p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {["✓ Secure & Confidential", "✓ Expert Jury Panel", "✓ Official Certificate"].map((t) => (
            <span key={t} className="flex items-center gap-2 px-4 py-2 border border-[#C9A84C]/30 rounded-full font-cinzel text-[10px] text-[#C9A84C]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["Basic Info", "Select Category", "Full Details", "Payment"];
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
              {i < 3 && <div className={`flex-1 h-px mx-3 ${done ? "bg-[#C9A84C]" : "bg-white/10"}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step1({ form, setForm, errors, setErrors, onNext }: {
  form: FormData; setForm: (f: FormData) => void; errors: FormErrors; setErrors: (e: FormErrors) => void; onNext: () => void;
}) {
  const update = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    const updated = { ...form, [k]: v };
    setForm(updated);
    if (Object.keys(errors).length) setErrors(validateStep1(updated));
  };

  const inputCls = (k: keyof FormData) => `input-gold${errors[k] ? " has-error" : ""}`;

  const handleNext = () => {
    const errs = validateStep1(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
    else toast.error("Please fill in all required fields");
  };

  return (
    <div className="pt-14">
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">
          Let's Start With Your <span className="text-white">Basic Details</span>
        </h2>
        <p className="text-white/70">Takes less than 2 minutes</p>
      </div>

      <div className="glass-card p-8 space-y-6 max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Full Name" required error={errors.fullName}>
            <input className={inputCls("fullName")} placeholder="Your full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
          </Field>
          <Field label="Designation / Title" required error={errors.designation}>
            <input className={inputCls("designation")} placeholder="e.g. CEO, Director, Manager" value={form.designation} onChange={(e) => update("designation", e.target.value)} />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Organisation / Company Name" required error={errors.organisation}>
            <input className={inputCls("organisation")} placeholder="Your company name" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} />
          </Field>
          <Field label="Organisation Type" required error={errors.orgType}>
            <select className={inputCls("orgType")} value={form.orgType} onChange={(e) => update("orgType", e.target.value)}>
              <option value="">Select Type</option>
              {["Broadcaster", "Cable Operator", "DTH Operator", "Technology Company", "OTT/Digital Platform", "Production House", "Individual / Freelancer", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Mobile Number" required error={errors.mobile}>
            <div className="flex">
              <span className="input-gold !w-auto !rounded-r-none border-r-0 text-white/70">+91</span>
              <input className={`${inputCls("mobile")} !rounded-l-none`} placeholder="10 digits" maxLength={10} value={form.mobile} onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
            </div>
          </Field>
          <Field label="WhatsApp Number">
            <input className="input-gold disabled:opacity-60" disabled={form.whatsappSame} placeholder="10 digits" maxLength={10} value={form.whatsappSame ? form.mobile : form.whatsapp} onChange={(e) => update("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))} />
            <label className="mt-2 flex items-center gap-2 text-xs font-sans text-white/65 cursor-pointer">
              <input type="checkbox" checked={form.whatsappSame} onChange={(e) => update("whatsappSame", e.target.checked)} className="w-3.5 h-3.5 accent-[#C9A84C]" />
              Same as mobile number
            </label>
          </Field>
        </div>

        <Field label="Email Address" required error={errors.email}>
          <input className={inputCls("email")} type="email" placeholder="your@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="City" required error={errors.city}>
            <input className={inputCls("city")} placeholder="Your city" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </Field>
          <Field label="State" required error={errors.state}>
            <select className={inputCls("state")} value={form.state} onChange={(e) => update("state", e.target.value)}>
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button onClick={handleNext} className="btn-gold">
          Start Nomination <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Step2({ form, setForm, onBack, onNext }: {
  form: FormData; setForm: (f: FormData) => void; onBack: () => void; onNext: () => void;
}) {
  const selected = CATEGORIES.find((c) => c.id === form.category);
  
  const toggleCategory = (catId: string) => {
    setForm({ ...form, category: catId, subCategories: [] });
  };

  const toggleSub = (sub: string) => {
    if (form.subCategories.includes(sub)) {
      setForm({ ...form, subCategories: form.subCategories.filter(s => s !== sub) });
    } else {
      setForm({ ...form, subCategories: [...form.subCategories, sub] });
    }
  };

  const handleNext = () => {
    if (!form.category || form.subCategories.length === 0) {
      toast.error("Please select a category and at least one sub-category");
      return;
    }
    onNext();
  };

  return (
    <div className="pt-14">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Welcome, <span className="text-gold-gradient">{form.fullName.split(" ")[0]}</span>! 👋
        </h2>
        <p className="text-white/70">Now select the category you wish to nominate for</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {CATEGORIES.map((c) => {
          const active = c.id === form.category;
          return (
            <button
              key={c.id}
              onClick={() => toggleCategory(c.id)}
              className={`text-left glass-card p-6 transition-all relative group ${active ? "border-[#C9A84C] !bg-[#C9A84C]/10 shadow-[0_0_30px_rgba(201,168,76,0.3)]" : "hover:border-[#C9A84C]/60"}`}
            >
              {active && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
                  <Check size={14} className="text-black" />
                </div>
              )}
              <c.icon size={36} className="text-[#C9A84C]" />
              <h3 className="font-display text-xl font-semibold mt-4">{c.name}</h3>
              <p className="text-xs text-white/55 mt-2">{c.short}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#C9A84C]/20">
            <div>
              <p className="font-cinzel text-[10px] text-[#C9A84C] mb-1">Select Sub-Categories</p>
              <h3 className="font-display text-2xl">{selected.name}</h3>
              <p className="text-xs text-white/60 mt-1">(You can select multiple)</p>
            </div>
            {form.subCategories.length > 0 && (
              <div className="bg-[#C9A84C]/20 px-4 py-2 rounded-full border border-[#C9A84C]/40">
                <span className="font-cinzel text-xs text-[#C9A84C]">{form.subCategories.length} selected</span>
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {selected.subcategories.map((s) => {
              const checked = form.subCategories.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSub(s)}
                  className={`text-left px-4 py-3 h-12 border rounded transition-all flex items-center gap-3 ${checked ? "border-[#C9A84C] bg-[#C9A84C]/10" : "border-white/15 hover:border-[#C9A84C]/50"}`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${checked ? "border-[#C9A84C] bg-[#C9A84C]" : "border-white/30"}`}>
                    {checked && <Check size={14} className="text-black" />}
                  </div>
                  <span className={`text-sm ${checked ? "text-white" : "text-white/70"}`}>{s}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
        <button onClick={onBack} className="btn-outline-gold"><ArrowLeft size={16} /> Back</button>
        <button onClick={handleNext} className="btn-gold">Next: Fill Details <ArrowRight size={16} /></button>
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

function Step3({ form, setForm, errors, setErrors, onBack, onNext }: {
  form: FormData; setForm: (f: FormData) => void; errors: FormErrors; setErrors: (e: FormErrors) => void; onBack: () => void; onNext: () => void;
}) {
  const update = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    const updated = { ...form, [k]: v };
    setForm(updated);
    if (Object.keys(errors).length) setErrors(validateStep3(updated));
  };

  const inputCls = (k: keyof FormData) => `input-gold${errors[k] ? " has-error" : ""}`;
  const category = CATEGORIES.find((c) => c.id === form.category);

  const handleNext = () => {
    const errs = validateStep3(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
    else toast.error("Please fill in all required fields");
  };

  return (
    <div className="pt-14 space-y-8">
      <div>
        <h2 className="font-display text-4xl font-bold text-gold-gradient mb-3">Tell Us More</h2>
        <p className="text-white/70">Provide details that will be reviewed by our jury panel</p>
      </div>

      <div className="glass-card p-4 border-[#C9A84C] bg-[#C9A84C]/5">
        <div className="flex flex-wrap gap-3 text-sm">
          <span>👤 {form.fullName}</span>
          <span>🏢 {form.organisation}</span>
          <span>🏆 {category?.name}</span>
          <span>📋 {form.subCategories.length} sub-categories</span>
        </div>
      </div>

      <Block title="Nominee Profile">
        <div className="md:col-span-2">
          <Field label="Upload Profile Photo" required helper="JPG or PNG · square preferred · max 5MB">
            <label className="block border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] p-8 text-center cursor-pointer transition">
              <Upload size={28} className="text-[#C9A84C] mx-auto" />
              <p className="font-sans text-sm text-white/65 mt-3">Drag &amp; drop or click to upload</p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) return toast.error("File too large (max 5MB)");
              }} />
            </label>
          </Field>
        </div>
        <Counter label="Brief Professional Bio" value={form.bio} onChange={(v) => update("bio", v)} max={500} required helper="A concise introduction shown in the souvenir." />
        <Counter label="Key Achievements in Last 3 Years" value={form.achievements} onChange={(v) => update("achievements", v)} max={800} required />
        <div className="md:col-span-2">
          <Counter label="Why do you deserve this award?" value={form.whyDeserve} onChange={(v) => update("whyDeserve", v)} max={1000} required helper="Tell the jury what sets your work apart." />
        </div>
      </Block>

      <Block title="Organisation Details">
        <Field label="Official Website URL" helper="Optional — include https://"><input className="input-gold" placeholder="https://yourcompany.com" value={form.website} onChange={(e) => update("website", e.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Company / Office Address" required error={errors.address}>
            <input className={inputCls("address")} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </Field>
        </div>
        <Field label="PIN Code" required error={errors.pincode} helper="6 digits">
          <input className={inputCls("pincode")} maxLength={6} value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="GST Number" helper="15 character GST number for invoice (optional)">
          <input className="input-gold" maxLength={15} value={form.gst} onChange={(e) => update("gst", e.target.value.toUpperCase())} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Company Logo" helper="Optional — PNG/SVG preferred">
            <label className="block border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] p-6 text-center cursor-pointer transition">
              <Upload size={22} className="text-[#C9A84C] mx-auto" />
              <p className="font-sans text-xs text-white/60 mt-2">Drag &amp; drop logo or click to upload</p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 3 * 1024 * 1024) return toast.error("File too large (max 3MB)");
              }} />
            </label>
          </Field>
        </div>
      </Block>

      <div className="glass-card p-8 space-y-3">
        <p className="font-cinzel text-[10px] text-[#C9A84C] mb-4 pb-3 border-b border-[#C9A84C]/20">Consent & Agreement</p>
        {([
          ["terms", "I agree to the Terms & Conditions and Nomination Guidelines", true],
          ["truth", "I confirm all information provided is accurate and truthful", true],
          ["contactConsent", "I consent to being contacted regarding my nomination", false],
        ] as const).map(([k, t, req]) => (
          <div key={k}>
            <label className="flex items-start gap-3 text-sm font-sans text-white/80 cursor-pointer leading-relaxed">
              <input type="checkbox" checked={form[k]} onChange={(e) => update(k, e.target.checked)} className="mt-1 w-4 h-4 accent-[#C9A84C]" />
              <span>{t}{req && <span className="text-[#C9A84C] ml-1">*</span>}</span>
            </label>
            {errors[k] && <p className="field-error ml-7">{errors[k]}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button onClick={onBack} className="btn-outline-gold"><ArrowLeft size={16} /> Back</button>
        <button onClick={handleNext} className="btn-gold">Proceed to Payment <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-8">
      <p className="font-cinzel text-[11px] text-[#C9A84C] mb-6 pb-4 border-b border-[#C9A84C]/20 tracking-[0.25em]">{title}</p>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Counter({ label, value, onChange, max, helper, required }: { label: string; value: string; onChange: (v: string) => void; max: number; helper?: string; required?: boolean }) {
  const pct = value.length / max;
  const cls = value.length >= max ? "counter-meta at-limit" : pct > 0.85 ? "counter-meta near-limit" : "counter-meta";
  return (
    <Field label={label} required={required} helper={helper}>
      <textarea
        rows={3}
        className="input-gold resize-none"
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className={cls}>{value.length} / {max}</p>
    </Field>
  );
}

function Step4({ form, category, gst, total, onBack, onConfirm }: {
  form: FormData; category: { name: string }; gst: number; total: number; onBack: () => void; onConfirm: () => void;
}) {
  const [tab, setTab] = useState<"upi" | "card">("upi");

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied!"); };

  return (
    <div className="pt-14 grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 glass-card p-8 h-fit lg:sticky lg:top-32">
        <p className="font-cinzel text-[11px] text-[#C9A84C] mb-5 pb-4 border-b border-[#C9A84C]/20">Order Summary</p>
        <Row k="Award" v="BCS Ratna 2026" />
        <Row k="Nominee" v={form.fullName} />
        <Row k="Organisation" v={form.organisation} />
        <Row k="Category" v={category.name} />
        <Row k="Sub-Categories" v={form.subCategories.length > 0 ? form.subCategories.join(", ") : "—"} />
        <div className="border-t border-[#C9A84C]/40 mt-4 pt-4 flex justify-between items-center">
          <span className="font-cinzel text-xs text-[#C9A84C]">Total Amount</span>
          <div className="text-right">
            <div className="font-display text-3xl text-gold-gradient font-bold">₹11,800</div>
            <div className="font-cinzel text-[10px] text-white/60 mt-1">(GST Included)</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {["🔒 256-bit SSL","PCI DSS","Razorpay Verified"].map((b) => (
            <span key={b} className="text-[10px] font-cinzel text-white/60 px-2 py-1 border border-white/15">{b}</span>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="flex border-b border-[#C9A84C]/20">
          {([["upi","UPI / QR"],["card","Card / Net Banking"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-4 font-cinzel text-[11px] transition ${tab === k ? "text-[#C9A84C] border-b-2 border-[#C9A84C]" : "text-white/50"}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="glass-card p-8 mt-6">
          {tab === "upi" && (
            <div className="space-y-5">
              <div className="bg-white p-6 w-fit mx-auto">
                <img alt="UPI QR" className="w-48 h-48" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=awards@aavishkar&pn=Aavishkar%20Media&am=11800" />
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="font-cinzel text-xs text-white/70">UPI ID:</span>
                <code className="text-[#C9A84C]">awards@aavishkar</code>
                <button onClick={() => copy("awards@aavishkar")} className="text-[#C9A84C] hover:opacity-70"><Copy size={14} /></button>
              </div>
              <Field label="UTR / Transaction ID"><input className="input-gold" placeholder="Enter UTR after payment" /></Field>
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
              <p className="text-xs text-white/50">Visa · Mastercard · RuPay · Net Banking · UPI · Digital Wallets</p>
              <button className="btn-gold mx-auto"><Lock size={14} /> Pay Securely ₹11,800</button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button onClick={onBack} className="btn-outline-gold"><ArrowLeft size={16} /> Back</button>
          <button onClick={onConfirm} className="btn-gold animate-pulse-gold">
            <Lock size={14} /> Confirm &amp; Pay ₹11,800
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between py-1.5 text-sm gap-3"><span className="text-white/55">{k}</span><span className="text-white text-right">{v}</span></div>;
}

function Success({ id, category, subCategories, name }: { id: string; category: string; subCategories: string[]; name: string }) {
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

  const handleDownloadReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>BCS Ratna Award 2026 - Nomination Receipt</title>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
          body {
            font-family: 'Open Sans', Arial, sans-serif;
            background: white;
            color: #000;
            padding: 40px;
            margin: 0;
          }
          .receipt {
            max-width: 600px;
            margin: 0 auto;
            border: 2px solid #C9A84C;
            padding: 40px;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #C9A84C;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: 900;
            color: #C9A84C;
            margin: 0 0 10px 0;
            font-family: 'Playfair Display', serif;
          }
          .tagline {
            font-size: 12px;
            color: #666;
            letter-spacing: 2px;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            color: #000;
            margin-top: 15px;
          }
          .content {
            margin: 30px 0;
          }
          .row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .row .label {
            font-weight: 600;
            color: #333;
          }
          .row .value {
            color: #000;
            text-align: right;
            flex-grow: 1;
            padding-left: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-top: 2px solid #C9A84C;
            border-bottom: 2px solid #C9A84C;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
          }
          .total-row .label {
            color: #C9A84C;
          }
          .total-row .value {
            color: #C9A84C;
            font-size: 20px;
          }
          .gst-note {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #C9A84C;
            font-size: 12px;
          }
          .footer p {
            margin: 8px 0;
            color: #666;
          }
          .contact {
            margin-top: 15px;
            font-size: 13px;
            color: #000;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">BCS RATNA AWARD 2026</div>
            <div class="tagline">by Aavishkar Media Pvt. Ltd.</div>
            <div class="title">NOMINATION RECEIPT</div>
          </div>
          
          <div class="content">
            <div class="row">
              <span class="label">Nomination ID:</span>
              <span class="value">#${id}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${today}</span>
            </div>
            <div class="row">
              <span class="label">Nominee Name:</span>
              <span class="value">${name || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Category:</span>
              <span class="value">${category}</span>
            </div>
            <div class="row">
              <span class="label">Sub-Categories:</span>
              <span class="value">${subCategories.join(', ')}</span>
            </div>
            <div class="row">
              <span class="label">Amount Paid:</span>
              <span class="value">₹11,800/-</span>
            </div>
            
            <div class="total-row">
              <span class="label">Total Amount:</span>
              <span class="value">₹11,800</span>
            </div>
            <div class="gst-note">(GST Included)</div>
          </div>
          
          <div class="footer">
            <p><strong>Status: PAYMENT SUBMITTED</strong></p>
            <p>This receipt confirms submission of your nomination.</p>
            <p>Official confirmation will be sent within 48 hours.</p>
            <div class="contact">
              <strong>Contact Information</strong><br>
              Email: info@aavishkargroup.in<br>
              Phone: +91-9811120650
            </div>
          </div>
        </div>
        
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

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
        <motion.div
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto mb-4"
          style={{ width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src="/assets/Trophy.png"
            alt="Trophy"
            style={{
              width: "160px",
              height: "160px",
              objectFit: "contain",
              filter: "drop-shadow(0 0 30px rgba(201,168,76,0.8))",
            }}
          />
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
            <Row k="Sub-Categories" v={subCategories.join(", ")} />
          </div>
        </div>
        <p className="font-cinzel text-[10px] text-[#C9A84C] mt-10 mb-3">Share Your Nomination</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {(() => {
            const text = `I'm proud to be nominated for BCS Ratna Award 2026 in ${category}! India's most prestigious media industry award. #BCSRatnaAward2026`;
            const url = typeof window !== "undefined" ? window.location.origin : "https://bcsratnaaward.com";
            return (
              <>
                <a target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} className="btn-outline-gold"><Linkedin size={14} /> LinkedIn</a>
                <a target="_blank" rel="noopener" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} className="btn-outline-gold"><Twitter size={14} /> Twitter / X</a>
                <a target="_blank" rel="noopener" href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`} className="btn-outline-gold"><MessageCircle size={14} /> WhatsApp</a>
              </>
            );
          })()}
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <button onClick={handleDownloadReceipt} className="btn-gold"><Download size={14} /> Download Receipt</button>
          <Link to="/" className="btn-outline-gold"><Award size={14} /> Return Home</Link>
        </div>
      </div>
    </section>
  );
}
