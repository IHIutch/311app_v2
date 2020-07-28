import express from "express";
import reports from "./routes/reports";

const app = express();
app.use(express.json());

app.use("/reports", reports);

module.exports = app;
