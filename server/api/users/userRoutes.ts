import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "assesment_db",
    password: "secret",
    port: 5432,
});

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *",
            [uuidv4(), name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});

// Get user by ID
router.get("/:id", async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Get all users with pagination and search
router.get("/", async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1 LIMIT $2 OFFSET $3",
            [`%${search}%`, limitNumber, offset]
        );
        res.json(result.rows);
    } catch (error: any) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Update user by ID
router.put("/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [name, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});

// Delete user by ID
router.delete("/:id", async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

export default router;
