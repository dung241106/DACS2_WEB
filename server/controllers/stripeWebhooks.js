import Stripe from "stripe";
import Booking from "../models/Booking.js";
export const stripeWebhooks = async (req, res) => {
  console.log("Webhook received");
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  // Kiểm tra các biến môi trường
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY");
    return res.status(500).send("Server configuration error");
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOKS_SECRET is not set");
    return res.status(500).send("Server configuration error");
  }
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error:${err.message}`);
  }
  try {
    switch (event.type) {
      case payment_intent.succeeded: {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];
        const { bookingId } = session.metadata;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });
        break;
      }

      default:
        console.log("unhandled event type:", event.type);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("internal server error");
  }
};
