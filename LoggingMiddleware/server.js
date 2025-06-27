// server.js
// This is just a basic express server to test the logger thingy

const express = require("express");
const { Log } = require("./logger");

const app = express();
app.use(express.json());

// Just a test route
app.get("/", (req, res) => {
  Log("backend", "info", "route", "Home route was hit");
  res.send("Hello, this is the home route!");
});

// Route to simulate an error
app.get("/error", (req, res) => {
  Log("backend", "error", "handler", "received string, expected bool");
  res.status(400).send("Oops, something went wrong!");
});

// Route to test other log levels
app.get("/warn", (req, res) => {
  Log("backend", "warn", "service", "This is just a warning, nothing serious");
  res.send("Warning was logged!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Express server running on port", PORT);
});
