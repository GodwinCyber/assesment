import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./api/users/userRoutes";
import movieRouter from "./api/movies/movieRoutes";
import rentalRouter from "./api/rentals/rentalRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount the routers
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

