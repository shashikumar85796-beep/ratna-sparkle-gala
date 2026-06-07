import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — BCS Ratna Award" },
      { name: "description", content: "Get in touch with the BCS Ratna Award team. New Delhi office, phone, email and contact form." },
    ],
  }),
  component: ContactPage,
});

type ContactForm = { name: string; email: string; phone: string; subject: string; message: string };
type ContactErrors = Partial<Record<keyof ContactForm, string>>;

function validateContact(f: ContactForm): ContactErrors {
  const e: ContactErrors = {};
  if (!f.name.trim()) e.name = "Please enter your name";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
  if (f.phone && !/^[\d+\-\s()]{7,}$/.test(f.phone)) e.phone = "Enter a valid phone number";
  if (!f.message.trim()) e.message = "Please share a brief message";
  else if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters";
  return e;
}

function ContactPage() {
  const [f, setF] = useState<ContactForm>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const update = <K extends keyof ContactForm>(k: K, v: ContactForm[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (Object.keys(errors).length) setErrors(validateContact(next));
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(f);
    setErrors(errs);
    const keys = Object.keys(errs);
    if (keys.length) {
      toast.error(errs[keys[0] as keyof ContactForm] ?? "Please check the highlighted fields");
      return;
    }
    toast.success("Message sent — we'll be in touch within 24 hours.");
    setF({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
  };
  const inputCls = (k: keyof ContactForm) => `input-gold${errors[k] ? " has-error" : ""}`;

  return (
    <div className="bg-background min-h-screen">
      <Toaster theme="dark" position="top-center" />
      <Navigation />

      <section className="relative pt-[70px] md:pt-[148px] pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4 tracking-[0.3em]">Get in Touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">Contact Us</h1>
          <div className="gold-divider" />
          <p className="font-sans text-[17px] text-white/70 mt-4 leading-relaxed">We respond to every enquiry within one business day.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-10">
        <form onSubmit={submit} noValidate className="lg:col-span-3 glass-card p-10 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Name" required error={errors.name}>
              <input className={inputCls("name")} value={f.name} onChange={(e) => update("name", e.target.value)} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" className={inputCls("email")} value={f.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="Phone" error={errors.phone} helper="Optional — include country code.">
              <input className={inputCls("phone")} value={f.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
            <Field label="Subject"><input className="input-gold" value={f.subject} onChange={(e) => update("subject", e.target.value)} /></Field>
          </div>
          <Field label="Message" required error={errors.message} helper="Tell us how we can help.">
            <textarea rows={6} className={`${inputCls("message")} resize-none`} value={f.message} onChange={(e) => update("message", e.target.value)} />
          </Field>
          <button type="submit" className="btn-gold">Send Message</button>
        </form>

        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: MapPin, title: "Visit Us", text: "B-263, Indra Nagar, Adarsh Nagar,\nNew Delhi - 110033" },
            { icon: Phone, title: "Call Us", text: "+91-9811120650\n+91-9811930420" },
            { icon: Mail, title: "Email Us", text: "info@aavishkargroup.in" },
            { icon: Clock, title: "Office Hours", text: "Mon - Sat · 10 AM - 7 PM" },
          ].map((i) => (
            <div key={i.title} className="glass-card p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                <i.icon size={20} className="text-[#C9A84C]" />
              </div>
              <div>
                <p className="font-cinzel text-[10px] text-[#C9A84C] mb-1 tracking-[0.3em]">{i.title}</p>
                <p className="font-sans text-[15px] text-white/80 whitespace-pre-line leading-relaxed">{i.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#C9A84C]/15">
        <iframe
          title="Aavishkar Media Group Location"
          src="https://www.google.com/maps?q=Adarsh+Nagar+New+Delhi&output=embed"
          className="w-full h-96 grayscale contrast-125"
          loading="lazy"
        />
      </section>

      <Footer />
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
