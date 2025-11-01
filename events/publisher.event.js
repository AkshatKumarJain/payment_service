import redis from "../config/redis.js";

export const publishPaymentEvents = async (data) => {
    await redis.publish("payment_events", JSON.stringify(data));
};