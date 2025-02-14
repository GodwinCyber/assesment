import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST || "localhost",
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWRD,
    port: Number(process.env.DB_PORT) || 5432,
});

export default pool;


