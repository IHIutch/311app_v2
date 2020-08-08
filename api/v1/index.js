import express from "express";
import reports from "./routes/reports";
import upload from "./routes/upload";

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use("/reports", reports);
app.use("/upload", upload);

module.exports = app;
