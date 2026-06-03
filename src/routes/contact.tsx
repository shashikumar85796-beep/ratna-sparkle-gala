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

function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.message) return toast.error("Please fill required fields");
    toast.success("Message sent — we'll be in touch within 24 hours.");
    setF({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="bg-background min-h-screen">
      <Toaster theme="dark" position="top-center" />
      <Navigation />

      <section className="relative pt-36 pb-20 overflow-hidden">
        <GoldParticles count={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-4">Get in Touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">Contact Us</h1>
          <div className="gold-divider" />
          <p className="text-white/70 mt-4">We respond to every enquiry within one business day.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-10">
        <form onSubmit={submit} className="lg:col-span-3 glass-card p-10 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name" required><input className="input-gold" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Email" required><input type="email" className="input-gold" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
            <Field label="Phone"><input className="input-gold" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
            <Field label="Subject"><input className="input-gold" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></Field>
          </div>
          <Field label="Message" required>
            <textarea rows={6} className="input-gold resize-none" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
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
                <p className="font-cinzel text-[10px] text-[#C9A84C] mb-1">{i.title}</p>
                <p className="text-sm text-white/80 whitespace-pre-line">{i.text}</p>
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

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-cinzel text-[10px] text-[#C9A84C] mb-2">{label}{required && " *"}</label>
      {children}
    </div>
  );
}
