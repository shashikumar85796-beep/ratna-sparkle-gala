import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — BCS Ratna Award 2026" },
      { name: "description", content: "Terms & Conditions for BCS Ratna Award 2026 nominations. Read before submitting your nomination." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Terms & Conditions — BCS Ratna Award 2026" },
      { property: "og:url", content: "https://bcsratnaaward.com/terms-conditions" },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/terms-conditions" }],
  }),
  component: TermsConditionsPage,
});

function TermsConditionsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <section className="max-w-4xl mx-auto px-6 pt-[70px] md:pt-[168px] pb-24">
        <h1 className="font-display text-5xl font-bold text-gold-gradient mb-3">Terms & Conditions</h1>
        <p className="font-cinzel text-[11px] text-[#C9A84C] tracking-[0.2em] mb-12">Effective: January 2026</p>

        <div className="space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing and using the BCS Ratna Award 2026 website and submitting a nomination, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this website.
            </p>
          </Section>

          <Section title="2. Eligibility to Nominate">
            <p>
              To submit a nomination, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Be 18 years of age or older</li>
              <li>Be actively involved in India's Broadcasting, Cable, Satellite, Digital Media, or related technology sectors</li>
              <li>Provide accurate and truthful information</li>
              <li>Have authority to submit the nomination</li>
            </ul>
          </Section>

          <Section title="3. Nomination Submission Rules">
            <p>
              When submitting a nomination, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide only accurate and verified information</li>
              <li>Not submit false, misleading, or fraudulent information</li>
              <li>Ensure all documentation and claims are truthful</li>
              <li>Accept responsibility for the accuracy of your submission</li>
              <li>Not submit duplicate or multiple nominations for the same category</li>
            </ul>
          </Section>

          <Section title="4. Jury Decision is Final">
            <p>
              The jury's evaluation and decision regarding all nominations is final and binding. No appeals or reconsiderations will be entertained. Winners will be announced on the official award ceremony date.
            </p>
          </Section>

          <Section title="5. Intellectual Property Rights">
            <p>
              The "BCS Ratna Award" name, logo, branding, and all associated intellectual property are the exclusive property of Aavishkar Media Pvt. Ltd. By submitting a nomination, you acknowledge our intellectual property rights and agree not to use our branding without written permission.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or submission of a nomination.
            </p>
          </Section>

          <Section title="7. Governing Law & Jurisdiction">
            <p>
              These Terms & Conditions are governed by the laws of India. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
            </p>
          </Section>

          <Section title="8. Contact for Legal Inquiries">
            <p>
              For legal inquiries or concerns regarding these Terms & Conditions, please contact:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> info@aavishkargroup.in<br/>
              <strong>Phone:</strong> +91-9811120650<br/>
              <strong>Address:</strong> B-263, Indra Nagar, Adarsh Nagar, New Delhi-110033
            </p>
          </Section>

          <Section title="9. Policy Changes">
            <p>
              We reserve the right to modify these Terms & Conditions at any time. Continued use of our website following such changes constitutes your acceptance of the new terms.
            </p>
          </Section>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white mb-3">{title}</h2>
      <div className="text-white/75 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}
