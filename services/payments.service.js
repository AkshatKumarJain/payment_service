import conn from "../config/connection.js";
import Stripe from "stripe";
import { publishPaymentEvents } from "../events/publisher.event.js";
import { stripe } from "../utils/stripe.js";

export const createPaymentIntent = async ({ bookingId, userId, amount }) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "rs",
        metadata: { bookingId, userId },
    });

    const [result] = await conn.query(
        `INSERT INTO payments (booking_id, user_id, amount, provider, provider_payment_id, status)
         VALUES (?, ?, ?, 'stripe', ?, 'pending'`,
         [bookingId, userId, paymentIntent.id]
    )
    return { payment_id: result.insertId, client_secret: paymentIntent.client_secret };
}

export const confirmPayment = async (paymentIntentId) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    let status = 'failed';
    if(paymentIntent.status==='succeeded')
    status = 'succeeded';
    else if (paymentIntent.status === 'requires_capture') 
    status = 'pending';
    await conn.query(
    `UPDATE payments SET status = ? WHERE provider_payment_id = ?`,
    [status, paymentIntentId]
  );

  // Notify booking service via Redis
  const eventData = {
    booking_id: paymentIntent.metadata.bookingId,
    user_id: paymentIntent.metadata.userId,
    status,
  };
  await publishPaymentEvents(eventData);

  return status;
}



