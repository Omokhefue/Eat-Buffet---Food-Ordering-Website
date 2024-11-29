const express = require("express");
const connectDB = require("./config/db");

require("dotenv").config({ path: "./.env" });
const app = express();

const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ hello: "<p>helo </p>" });
});

connectDB().then(() => {
  app.listen(PORT || 3000, () => {
    console.log(`http://localhost:${PORT ? PORT : 3000}`);
  });
});
