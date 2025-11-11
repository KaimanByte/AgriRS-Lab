import fs from 'fs';
import pool from './src/controladores/bd.js';

async function recreateDB() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./src/suporte/clausulasnoticias_SQL.txt', 'utf8');

    // Split into individual statements
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (const statement of statements) {
      if (statement) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        await pool.query(statement);
      }
    }

    console.log('Database recreated successfully');
  } catch (error) {
    console.error('Error recreating database:', error);
  } finally {
    process.exit();
  }
}

recreateDB();
