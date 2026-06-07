import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — BCS Ratna Award 2026" },
      { name: "description", content: "Refund Policy for BCS Ratna Award 2026 nominations." },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <section className="max-w-4xl mx-auto px-6 pt-[70px] md:pt-[168px] pb-24">
        <h1 className="font-display text-5xl font-bold text-gold-gradient mb-3">Refund Policy</h1>
        <p className="font-cinzel text-[11px] text-[#C9A84C] tracking-[0.2em] mb-12">Effective: January 2026</p>

        <div className="space-y-8">
          <Section title="1. General Refund Policy">
            <p>
              Registration fees paid for BCS Ratna Award 2026 are <strong>non-refundable</strong> once a nomination has been submitted and payment has been confirmed. By completing your nomination and payment, you acknowledge and accept this condition.
            </p>
          </Section>

          <Section title="2. Duplicate Payment Refunds">
            <p>
              If you have made a duplicate payment by mistake, you may request a refund within 48 hours of the transaction. Please contact us immediately with your nomination ID and transaction proof.
            </p>
            <p className="mt-2"><strong>Refund Timeline:</strong> Within 7 working days to your original payment method</p>
          </Section>

          <Section title="3. Event Cancellation">
            <p>
              In the unlikely event that the BCS Ratna Award 2026 ceremony is cancelled or postponed:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>A full credit note will be issued for the nomination fee</li>
              <li>You may apply this credit toward participation in the rescheduled event</li>
              <li>Cash refunds will not be provided in case of event cancellation</li>
            </ul>
          </Section>

          <Section title="4. Payment Disputes">
            <p>
              If you believe an unauthorized payment has been made or there is a discrepancy with your transaction:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Contact us within 48 hours of the transaction</li>
              <li>Provide your nomination ID, payment reference, and supporting documents</li>
              <li>We will investigate and respond within 5 working days</li>
              <li>Refunds will be processed after verification</li>
            </ul>
          </Section>

          <Section title="5. Refund Process & Timeline">
            <p>
              <strong>Processing Time:</strong> 7-10 working days<br/>
              <strong>Refund Method:</strong> Original payment method (UPI, credit card, net banking)<br/>
              <strong>Note:</strong> Bank processing may take additional 2-3 days depending on your financial institution
            </p>
          </Section>

          <Section title="6. GST & Taxes">
            <p>
              As per Indian government regulations, GST on services is <strong>non-refundable</strong> once invoiced. If a refund is approved, it will be calculated as the service fee only, excluding GST.
            </p>
          </Section>

          <Section title="7. Contact for Refund Requests">
            <p>
              To initiate a refund request or report a payment issue, please contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> info@aavishkargroup.in<br/>
              <strong>Phone:</strong> +91-9811120650<br/>
              <strong>Address:</strong> B-263, Indra Nagar, Adarsh Nagar, New Delhi-110033<br/>
              <strong>Response Time:</strong> Within 24 hours
            </p>
          </Section>

          <Section title="8. Policy Exception Cases">
            <p>
              While our standard policy is non-refundable, exceptions may be considered on a case-by-case basis for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Medical emergencies preventing participation</li>
              <li>Significant technical errors on our platform</li>
              <li>Payment processing failures</li>
            </ul>
            <p className="mt-2">Exception requests must be submitted with supporting documentation.</p>
          </Section>

          <Section title="9. Policy Updates">
            <p>
              We reserve the right to update this Refund Policy at any time. Any changes will be posted on this page with an updated effective date.
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
