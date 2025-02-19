import request from "supertest";
import express from "express";
import rentalRoutes from "../api/rentals/rentalRoutes";
import pool from "../config/db";

const app = express();
app.use(express.json());
app.use("/api/rentals", rentalRoutes);

jest.mock("../config/db", () => ({
    query: jest.fn(),
}));

// mock cconsole.error to supress error logs
beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe("Rental API Endpoint", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockRental = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        user_id: "1",
        movie_id: "1",
        rented_at: new Date().toISOString(),
        due_date: new Date().toISOString(),
        returned_at: null,
    };

    const mockReturnedRental = {
        ...mockRental,
        returned_at: new Date().toISOString(),
    };

    // testing for renting a movie
    test("should rent a movie", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockRental] });

        const response = await request(app)
            .post("/api/rentals")
            .send({ user_id: "1", movie_id: "1", due_date: new Date().toISOString()} );

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockRental);
    });

    test("should return 500 if renting a movie fails", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Datebase eror"));

    const response = await request(app)
        .post("/api/rentals")
        .send({ user_id: "1", movie_id: "1", due_date: new Date().toISOString() });

    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Error renting movie");
    });

    // test for returning a movie
    test("should return a movie", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockReturnedRental] });

        const response = await request(app)
            .put(`/api/rentals/${mockRental.id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockReturnedRental);
    });

    //non-existent rental
    test("should return 404 for a non-existent rental", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const response = await request(app)
            .put("/api/rentals/non-existent-id")
            .send();

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Rental not found" });
    });

    // failed to return a movie
    test("should return 500 if returning a movie fails", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        const response = await request(app)
            .put(`/api/rentals/${mockRental.id}`)
            .send();

        expect(response.status).toBe(500);
        expect(response.body.message).toContain("Error returning movie");
    });

    // test for getting all rentals with pagination
    test("should get all rentals with pagination", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockRental] });

        const response = await request(app)
            .get("/api/rentals")
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockRental]);
    });

    // failed to get all rentals
    test("should return 500 if fetching rentals fails", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        const response = await request(app)
            .get("/api/rentals")
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(500);
        expect(response.body.message).toContain("Error fetching rentals");
    });
});


