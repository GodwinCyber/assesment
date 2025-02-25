import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST || "localhost",
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

export default pool;


// The above code snippet is the configuration file for the database connection. It uses the pg package to create a connection pool to the PostgreSQL database. The configuration is read from environment variables using the dotenv package. The pool is exported to be used in other parts of the application.
