import express from "express";
import {
  createBooking,
  getOccupiedSeats,
} from "../controllers/bookingControllers.js";
const bookingRouter = express.Router();
bookingRouter.post("/create", createBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);

/* // Thiếu trong bookingRoutes.js:
router.get('/bookings/:id', getBookingById);   // Chi tiết booking
router.put('/bookings/:id/cancel', cancelBooking); // Hủy booking
router.post('/bookings/:id/confirm', confirmPayment); // Xác nhận thanh toán */
export default bookingRouter;
