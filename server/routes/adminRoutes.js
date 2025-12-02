import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import {
  getAllBookings,
  getAllShows,
  getDashBoardData,
  isAdmin,
} from "../controllers/adminControllers.js";
const adminRouter = express.Router();
adminRouter.get("/is-admin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashBoardData);
adminRouter.get("/all-shows", protectAdmin, getAllShows);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);

/* // Thiếu trong adminRoutes.js hoặc showRoutes.js:
router.get('/movies', getAllMovies);           // READ all movies
router.get('/movies/:id', getMovieById);       // READ movie detail
router.post('/movies', addMovie);              // CREATE movie
router.put('/movies/:id', updateMovie);        // UPDATE movie
router.delete('/movies/:id', deleteMovie);     // DELETE movie
router.put('/shows/:id', updateShow);          // UPDATE show
router.delete('/shows/:id', deleteShow);       // DELETE show */
export default adminRouter;
