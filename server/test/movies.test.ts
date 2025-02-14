import request from "supertest";
import express from "express";
import movieRouter from "../api/movies/movieRoutes";
import pool from "../config/db";

const app = express();
app.use(express.json());
app.use("/api/movies", movieRouter);

jest.mock("../config/db");

describe("Movies API Endpoints", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create a new movie", async () => {
        const mockMovie = { id: "1", name: "Bond", genre: "Sci-Fi" };

        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockMovie] });

        const response = await request(app)
            .post("/movies")
            .send({ name: "Bond", genre: "Sci-Fi" });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockMovie);
    });

    test("should get a movie by ID", async () => {
        const mockMovie = { id: "1", name: "Bond", genre: "Sci-Fi" };

        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockMovie] });

        const response = await request(app).get("/movies/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockMovie);
    });

    test("should return 404 for a non-existent movie", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const response = await request(app).get("/movies/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Movie not found" });
    });

    test("should update a movie by ID", async () => {
        const updatedMovie = { id: "1", name: "Interstellar", genre: "Sci-Fi" };

        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedMovie] });

        const response = await request(app)
            .put("/movies/1")
            .send({ name: "Interstellar", genre: "Sci-Fi" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedMovie);
    });

    test("should delete a movie by ID", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "1" }] });

        const response = await request(app).delete("/movies/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Movie deleted successfully" });
    });

    test("should return 404 for deleting non-existent movie", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const response = await request(app).delete("/movies/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Movie not found" });
    });
});
