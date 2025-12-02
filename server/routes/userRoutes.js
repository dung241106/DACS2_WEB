import express from "express";
import {
  getFavorites,
  getuserBookings,
  UpdateFavorites,
} from "../controllers/userControllers.js";
const userRouter = express.Router();
userRouter.get("/bookings", getuserBookings);

userRouter.post("/update-favorite", UpdateFavorites);
userRouter.get("/favorites", getFavorites);
export default userRouter;
/* // Thiếu trong userRoutes.js:
router.get('/me', getCurrentUser);             // Thông tin user hiện tại
router.put('/me', updateProfile);              // Cập nhật profile */
