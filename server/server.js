import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showroutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();
const port = 3000;

try {
  await connectDB();
} catch (error) {
  console.error("Error");
  process.exit(1);
}

/* //stripe webhook route
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);


 */
// ============= STRIPE WEBHOOK =============
// POST endpoint cho Stripe webhook (cần signature)
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// GET endpoint để test (không cần signature)
app.get("/api/stripe", (req, res) => {
  res.json({
    message: "✅ Stripe webhook endpoint is active",
    method: "POST",
    info: "This endpoint receives Stripe webhook events",
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint để verify server hoạt động
app.get("/api/stripe/health", (req, res) => {
  res.json({
    status: "healthy",
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOKS_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
    },
  });
});

//middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// api route

app.get("/", (req, res) => res.send(" Server is live"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);

app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

/* app.listen(port, () =>
  console.log(`Server listening at: http://localhost:${port} `)
); */
