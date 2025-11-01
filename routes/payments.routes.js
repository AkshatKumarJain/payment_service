import express from "express";
import { authMiddleware } from "redis-jwt-auth";
import { createIntent, confirms } from "../controllers/payments.controller.js";

const router = express.Router();

router.post('/intent', authMiddleware({ require: true }), createIntent);
router.post('/confirm', authMiddleware({ require: true }), confirms);

export default router;