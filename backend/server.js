// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import fs from "fs";
// import path from "path";

// const app = express();
// const PORT = 5000;

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// // CSV file path
// const csvFile = path.join(process.cwd(), "ab_test_logs.csv");

// // Ensure CSV headers
// if (!fs.existsSync(csvFile)) {
//   fs.writeFileSync(csvFile, "timestamp,event,variant,meal\n");
// }

// // API: Log event
// app.post("/api/log", (req, res) => {
//   const { event, variant, meal } = req.body;
//   const timestamp = new Date().toISOString();

//   const row = `${timestamp},${event},${variant},${meal || ""}\n`;
//   fs.appendFileSync(csvFile, row);

//   res.json({ message: "Event logged successfully" });
// });

// // API: Download CSV
// app.get("/api/export", (req, res) => {
//   res.download(csvFile, "ab_test_logs.csv");
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT ||5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middlewares
app.use(cors({
  origin: FRONTEND_URL
}));
app.use(bodyParser.json());

// Store logs in a CSV file
const logFilePath = path.join(process.cwd(), "ab_test_logs.csv");

// Ensure file has headers if new
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "timestamp,event,variant,meal\n");
}

// API to receive logs
app.post("/log", (req, res) => {
  const { timestamp, event, variant, meal } = req.body;
  const row = `${timestamp},${event},${variant},${meal || ""}\n`;

  fs.appendFileSync(logFilePath, row);
  res.json({ success: true, message: "Log saved" });
});

// API to download logs
app.get("/download", (req, res) => {
  res.download(logFilePath, "ab_test_results.csv");
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

