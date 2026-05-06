const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hobbyhub",
  password: "mysecretpassword",
  port: 5432,
});

// TEST
app.get("/", (req, res) => {
  res.send("Server funker!");
});

// registrer bruker
app.post("/registrer", async (req, res) => {
  const { navn, alder } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (navn, alder) VALUES ($1, $2) RETURNING *",
      [navn, alder]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Feil i server");
  }
});

// hent brukere
app.get("/brukere", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Feil i server");
  }
});

app.listen(3000, () => {
  console.log("Server kjører på http://localhost:3000");
});