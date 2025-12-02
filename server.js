// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// connect DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// routes
app.get("/", (req, res) => {
  res.send("DevTools Hub API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
