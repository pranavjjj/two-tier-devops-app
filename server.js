const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database configuration via environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'devops_db',
  port: process.env.DB_PORT || 5432,
});

// Initialize table on startup
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database table initialized.");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

initDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Main HTML Page
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    let rowsHtml = result.rows.map(r => `<li>${r.content} <small>(${r.created_at})</small></li>`).join('');
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Two-Tier DevOps App</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f4f4f9; }
          .container { max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h1 { color: #333; }
          input[type=text] { width: 70%; padding: 10px; margin-right: 10px; }
          button { padding: 10px 15px; background: #28a745; color: white; border: none; cursor: pointer; }
          ul { list-style-type: none; padding: 0; }
          li { background: #eee; margin: 5px 0; padding: 10px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Two-Tier App: Node.js + PostgreSQL</h1>
          <form action="/add" method="POST">
            <input type="text" name="message" placeholder="Enter a message..." required />
            <button type="submit">Submit to DB</button>
          </form>
          <h3>Entries from Database:</h3>
          <ul>${rowsHtml.length > 0 ? rowsHtml : '<li>No messages in database yet.</li>'}</ul>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Database error: " + err.message);
  }
});

// Post route to save data
app.post('/add', async (req, res) => {
  const { message } = req.body;
  if (message) {
    try {
      await pool.query('INSERT INTO messages (content) VALUES ($1)', [message]);
    } catch (err) {
      console.error(err);
    }
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
