const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(bodyParser.json());

app.use(cors());
app.post("/bfhl", (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, error: "Invalid data format. Expected an array." });
  }

  const alphabets = data.filter(item => typeof item === 'string' && /^[A-Za-z]$/.test(item));
  const numbers = data.filter(item => !isNaN(item) && typeof item !== 'boolean' && item !== '');

  const highest_alphabet = alphabets.length > 0
    ? [alphabets.reduce((a, b) => (a.toLowerCase() > b.toLowerCase() ? a : b))]
    : [];

  res.json({
    is_success: true,
    user_id: "saksham_botke_09112003",
    email: "sa9607@srmist.edu.in",
    roll_number: "RA2111008020027",
    numbers,
    alphabets,
    highest_alphabet,
  });
});


app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
