// import packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./api/users/userRoutes";
import movieRouter from "./api/movies/movieRoutes";
import rentalRouter from "./api/rentals/rentalRoutes";

// Load environment variables
dotenv.config();

// Create an express application
const app = express();

// apply the middleware
app.use(cors()); // allow all origins
app.use(express.json()); // parse the request body to json

// Mount the routers
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);


//  define server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;


