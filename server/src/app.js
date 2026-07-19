const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const stockRoutes = require("./routes/stockRoutes");


const app = express();


app.use(express.json());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes)
app.use("/api/transactions", transactionRoutes);
app.use("/api/stocks", stockRoutes);


module.exports = app;