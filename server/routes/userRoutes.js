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
