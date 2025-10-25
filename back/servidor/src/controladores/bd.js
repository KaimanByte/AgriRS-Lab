import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

let pool;

// ⚙️ Localhost
if (process.env.BDUSUARIO) {
  pool = new Pool({
    user: process.env.BDUSUARIO,
    host: process.env.BDHOST,
    database: process.env.BDNOME,
    password: process.env.BDSENHA,
    port: process.env.BDPORTA
  });
}

// ☁️ Render
else {
  pool = new Pool({
    connectionString: process.env.BDURI,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export default pool;
