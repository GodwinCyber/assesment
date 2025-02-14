import express from "express";
import pool from "../../config/db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Rent a movie
router.post("/", async (req, res) => {
    const { user_id, movie_id, due_date } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO rentals (id, user_id, movie_id, rented_at, due_date) VALUES ($1, $2, $3, NOW(), $4) RETURNING *",
            [uuidv4(), user_id, movie_id, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error("Error renting movie:", error); // Log the full error
        res.status(500).json({ message: "Error renting movie: " + error.message });
    }
});

// Return a movie
router.put("/:id", async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE rentals SET returned_at = NOW() WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Rental not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error: any) {
        console.error("Error returning movie:", error); // Log the full error
        res.status(500).json({ message: "Error returning movie: " + error.message });
    }
});

// Get all rentals with pagination
router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    try {
        const result = await pool.query(
            "SELECT * FROM rentals ORDER BY rented_at DESC LIMIT $1 OFFSET $2",
            [limitNumber, offset]
        );
        res.json(result.rows);
    } catch (error: any) {
        console.error("Error fetching rentals:", error); // Log the full error
        res.status(500).json({ message: "Error fetching rentals: " + error.message });
    }
});

export default router;
