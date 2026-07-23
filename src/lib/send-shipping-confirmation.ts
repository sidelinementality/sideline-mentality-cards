import ShippingConfirmationEmail from "@/emails/ShippingConfirmationEmail";
import { resend } from "@/lib/resend";

type ShippingConfirmationData = {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  trackingUrl: string;
};

export async function sendShippingConfirmation({
  customerEmail,
  customerName,
  orderNumber,
  trackingNumber,
  trackingUrl,
}: ShippingConfirmationData) {
  const { data, error } = await resend.emails.send({
    from: "Sideline Mentality Cards <orders@sidelinementalitycards.com>",
    to: customerEmail,
    subject: `Your Sideline Mentality Cards Order #${orderNumber} Has Shipped`,
    react: ShippingConfirmationEmail({
      customerName,
      orderNumber,
      trackingNumber,
      trackingUrl,
    }),
  });

  if (error) {
    throw new Error(
      `Unable to send shipping confirmation email: ${error.message}`,
    );
  }

  return data;
}