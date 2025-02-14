import express from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../../config/db";

const router = express.Router();

// Create a new movie
router.post("/", async (req, res) => {
    const { name, genre } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO movies (id, name, genre) VALUES ($1, $2, $3) RETURNING *",
            [uuidv4(), name, genre]
        );
        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ message: "Error creating movie: " + error.message });
    }
});

// Get a movie by ID
router.get("/:id", async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching movie: " + error.message });
    }
});

// Get all movies (pagination and search)
router.get("/", async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    try {
        const result = await pool.query(
            "SELECT * FROM movies WHERE title ILIKE $1 OR genre ILIKE $1 LIMIT $2 OFFSET $3",
            [`%${search}%`, limitNumber, offset]
        );
        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching movies: " + error.message });
    }
});

// Update a movie by ID
router.put("/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const { name, genre } = req.body;

    try {
        const result = await pool.query(
            "UPDATE movies SET name = $1, genre = $2 WHERE id = $3 RETURNING *",
            [name, genre, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ message: "Error updating movie: " + error.message });
    }
});

// Delete a movie by ID
router.delete("/:id", async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM movies WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json({ message: "Movie deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting movie: " + error.message });
    }
});

export default router;

