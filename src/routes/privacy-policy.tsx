import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BCS Ratna Award 2026" },
      { name: "description", content: "Privacy Policy for BCS Ratna Award 2026 nominations." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <section className="max-w-4xl mx-auto px-6 pt-[70px] md:pt-[168px] pb-24">
        <h1 className="font-display text-5xl font-bold text-gold-gradient mb-3">Privacy Policy</h1>
        <p className="font-cinzel text-[11px] text-[#C9A84C] tracking-[0.2em] mb-12">Last Updated: January 2026</p>

        <div className="space-y-8">
          <Section title="1. Information We Collect">
            <p>
              When you submit a nomination for the BCS Ratna Award 2026, we collect the following personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Full name, designation, and organisation details</li>
              <li>Email address and contact phone numbers</li>
              <li>Business address and location information</li>
              <li>GST number for invoice generation</li>
              <li>Professional biography and achievements</li>
              <li>Payment information (via Razorpay)</li>
              <li>Device and browser information through cookies</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>Your information is used for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Processing and managing your nomination submission</li>
              <li>Sending nomination confirmations and updates</li>
              <li>Processing payments and issuing invoices</li>
              <li>Communicating about award results and event details</li>
              <li>Improving our website and user experience</li>
              <li>Complying with legal and regulatory requirements</li>
            </ul>
          </Section>

          <Section title="3. Data Storage & Security">
            <p>
              We implement industry-standard security measures including 256-bit SSL encryption to protect your personal information. All data is stored on secure servers maintained by trusted hosting providers. We limit access to your information to employees and partners who require it to perform their duties.
            </p>
          </Section>

          <Section title="4. Cookies Policy">
            <p>
              Our website uses cookies to enhance your browsing experience. These include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Session Cookies:</strong> For maintaining your login state</li>
              <li><strong>Analytics Cookies:</strong> To understand website usage patterns</li>
              <li><strong>Preference Cookies:</strong> To remember your choices</li>
            </ul>
            <p className="mt-2">You can disable cookies in your browser settings, but this may affect website functionality.</p>
          </Section>

          <Section title="5. Third-Party Services">
            <p>
              We use Razorpay for secure payment processing. Razorpay is PCI DSS compliant and follows international payment security standards. Your payment information is never stored on our servers—all transactions are handled directly by Razorpay.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at info@aavishkargroup.in</p>
          </Section>

          <Section title="7. Contact for Privacy Concerns">
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> info@aavishkargroup.in<br/>
              <strong>Phone:</strong> +91-9811120650<br/>
              <strong>Address:</strong> B-263, Indra Nagar, Adarsh Nagar, New Delhi-110033
            </p>
          </Section>

          <Section title="8. Policy Updates">
            <p>
              We may update this Privacy Policy from time to time. Your continued use of our website constitutes acceptance of any changes.
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
