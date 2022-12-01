const connectToMongo = require("./db");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// MongoDB connection
connectToMongo();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//available routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/notes", require("./routes/note"));

// listening on port 3000
app.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});