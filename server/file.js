import express from "express";
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST || "localhost",
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWRD,
    port: Number(process.env.DB_PORT) || 5432,
}); // Import your database pool

// console.log(process.env, typeof (process.env));

const app = express();
app.use(express.json());


// Test endpoint: Fetch users from the database
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Database error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log`(Server running on port ${PORT}`);

export default app; // For testing

