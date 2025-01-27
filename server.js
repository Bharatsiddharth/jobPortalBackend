require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Database Connection
connectDB();

// API Routes
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));