import * as PaymentService from "../services/payments.service.js"

export const createIntent = async (req, res) => {
    try {
        const {booking_id, amount} = req.body;
        const userId = req.user.id;
        const result = await PaymentService.createPaymentIntent({ bookingId: booking_id, userId, amount });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            message: error,
            stack: error.stack
        })
    }
}

export const confirm = async (req, res) => {
  try {
    const { payment_intent_id } = req.body;
    const status = await PaymentService.confirmPayment(payment_intent_id);
    res.json({ success: true, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};