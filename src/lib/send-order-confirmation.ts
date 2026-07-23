import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import { resend } from "@/lib/resend";

type OrderItem = {
  playerName: string;
  year: number | null;
  brand: string | null;
  quantity: number;
  price: number;
};

type ShippingAddress = {
  line1: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
};

type OrderConfirmationEmailData = {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
};

export async function sendOrderConfirmation({
  customerEmail,
  customerName,
  orderNumber,
  items,
  shippingAddress,
  subtotal,
  shippingCost,
  total,
}: OrderConfirmationEmailData) {
  const { data, error } = await resend.emails.send({
    from: "Sideline Mentality Cards <orders@sidelinementalitycards.com>",
    to: customerEmail,
    subject: `Your Sideline Mentality Cards Order #${orderNumber}`,
    react: OrderConfirmationEmail({
      customerName,
      orderNumber,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
    }),
  });

  if (error) {
    throw new Error(
      `Unable to send order confirmation email: ${error.message}`,
    );
  }

  return data;
}