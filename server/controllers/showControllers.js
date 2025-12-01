// get list of movie
// get from TMDB
import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { err } from "inngest/types";
import { inngest } from "../inngest/index.js";
// get now playing movie
//use axios to fetch api endpoint
export const getNowPlayingMovies = async (req, res) => {
  try {
    /* cú pháp của Object Destructuring
     */
    // res from tmdb api
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );
    const movies = data.results;

    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, movies: error.message });
  }
};
// api to add new show from TMDB
export const addShow = async (req, res) => {
  try {
    const { movieId, showInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);
    if (!movie) {
      //fetch movie details from tmdb api
      const [movieDetailsReponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsReponse.data;
      const movieCreditData = movieCreditsResponse.data;
      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      //add movie to db
      movie = await Movie.create(movieDetails);
    }

    const showToCreate = [];
    showInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });
    if (showToCreate.length > 0) {
      await Show.insertMany(showToCreate);
    }

    //inngest event trigger
    await inngest.send({
      name: "app/show.added",
      data: { movieTitle: movie.title },
    });
    res.json({
      success: true,
      movies: " Show Added successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, movies: error.message });
  }
};

// api to get all show from tmdb

// getShows controller – DÁN NGUYÊN VÀO, KHÔNG SỬA GÌ
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    // Lấy danh sách phim duy nhất
    const movieMap = new Map();
    shows.forEach((show) => {
      if (show.movie && !movieMap.has(show.movie._id.toString())) {
        movieMap.set(show.movie._id.toString(), show.movie);
      }
    });

    const uniqueMovies = Array.from(movieMap.values());

    console.log("Now Showing: tìm được", uniqueMovies.length, "phim");
    uniqueMovies.forEach((m) => console.log("- ", m.title, m._id));

    res.json({ success: true, shows: uniqueMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//api to get a single show from tmdb
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });
    const movie = await Movie.findById(movieId);
    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });
    res.json({
      success: true,
      movie,
      dateTime,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
