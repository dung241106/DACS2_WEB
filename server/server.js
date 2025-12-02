import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
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
}

//stripe webhook route
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

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
// TEST API – GỬI THÔNG BÁO PHIM MỚI CHO TẤT CẢ USER (chỉ để test)
app.get("/test-new-show-notification", async (req, res) => {
  try {
    console.log("BẮT ĐẦU TEST GỬI MAIL PHIM MỚI...");

    await inngest.send({
      name: "app/show.added",
      data: {
        movieTitle: "DEADPOOL & WOLVERINE – PHIM SIÊU HOT ĐÃ LÊN SÓNG!!!",
      },
    });

    res.send(`
      <h2>ĐÃ GỬI EVENT app/show.added THÀNH CÔNG!</h2>
      <p>Chờ 10-20 giây rồi làm 2 việc:</p>
      <ol>
        <li>Mở <a href="https://app.inngest.com" target="_blank">Inngest Dashboard → Runs</a> → tìm "send-new-show-notifications" → phải chuyển thành <strong>Completed</strong></li>
        <li>Check Gmail của tất cả user (hoặc của bạn) → phải nhận được mail</li>
      </ol>
      <hr>
      <p>Nếu cả 2 đều OK → XONG 100%!</p>
      <p>Nếu vẫn không → chụp ảnh Inngest Run (có Failed không?) gửi mình ngay!</p>
    `);
  } catch (error) {
    console.error("Lỗi test:", error);
    res.status(500).send("Lỗi: " + error.message);
  }
});
app.listen(port, () =>
  console.log(`Server listening at: http://localhost:${port} `)
);
