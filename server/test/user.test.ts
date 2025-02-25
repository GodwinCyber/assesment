import request from "supertest";
import express from "express";
import userRoutes from "../api/users/userRoutes";
import pool from "../config/db";


// creating route and temporary express app
const app = express();
app.use(express.json()); // setting up middleware to parse JSON
app.use("/api/users", userRoutes); // mounting the user routes

// mocking the pool.query method so that we don't actually make a database connection
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

// testing the user routes
describe("Users API Endpoints", () => {
    afterEach(() => {
      jest.clearAllMocks(); // clear all mocks after each test
    });

    // mock user data
    const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
    const updatedUser = { id: "1", name: "Jane Doe", email: "jane@example.com" };

    test("should create a new user", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

        const response = await request(app)
            .post("/api/users")
            .send({ name: "John Doe", email: "john@example.com" });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
    });

    test("should get a user by ID", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

        const response = await request(app).get("/api/users/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    test("should return 404 for a non-existent user", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const response = await request(app).get("/api/users/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "User not found" });
    });

    test("should update a user by ID", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedUser] });

        const response = await request(app)
            .put("/api/users/1")
            .send({ name: "Jane Doe", email: "jane@example.com" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedUser);
    });

    test("should delete a user by ID", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "1" }] });

        const response = await request(app).delete("/api/users/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User deleted successfully" });
    });

    test("should return 404 for deleting non-existent user", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const response = await request(app).delete("/api/users/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "User not found" });
    });
});
