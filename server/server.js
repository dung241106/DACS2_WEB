import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const port = 3000;

try {
  await connectDB();
} catch (error) {
  console.error("Error");
  process.exit(1);
}
//middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// api route
app.get("/", (req, res) => res.send(" Server is live"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.listen(port, () =>
  console.log(`Server listening at: http://localhost:${port} `)
);
