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

// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import fs from "fs";
// import path from "path";

// const app = express();
// const PORT = process.env.PORT ||5000;
// const FRONTEND_URL = process.env.FRONTEND_URL;

// // Middlewares
// app.use(cors({
//   origin: FRONTEND_URL
// }));
// app.use(bodyParser.json());

// // Store logs in a CSV file
// const logFilePath = path.join(process.cwd(), "ab_test_logs.csv");

// // Ensure file has headers if new
// if (!fs.existsSync(logFilePath)) {
//   fs.writeFileSync(logFilePath, "timestamp,event,variant,meal\n");
// }

// // API to receive logs
// app.post("/log", (req, res) => {
//   const { timestamp, event, variant, meal } = req.body;
//   const row = `${timestamp},${event},${variant},${meal || ""}\n`;

//   fs.appendFileSync(logFilePath, row);
//   res.json({ success: true, message: "Log saved" });
// });

// // API to download logs
// app.get("/download", (req, res) => {
//   res.download(logFilePath, "ab_test_results.csv");
// });

// app.listen(PORT, () => {
//   console.log(`✅ Backend running on http://localhost:${PORT}`);
// });

// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import fs from "fs";
// import path from "path";

// const app = express();
// const PORT = process.env.PORT || 5000;
// const FRONTEND_URL = process.env.FRONTEND_URL;

// // Middlewares
// app.use(cors({
//   origin: FRONTEND_URL,
// }));
// app.use(bodyParser.json());

// // Define paths
// const publicDir = path.join(process.cwd(), "public");
// const logFilePath = path.join(publicDir, "ab_test_logs.csv");

// // Ensure public directory exists
// if (!fs.existsSync(publicDir)) {
//   fs.mkdirSync(publicDir);
// }

// // Ensure file has headers if new
// if (!fs.existsSync(logFilePath)) {
//   fs.writeFileSync(logFilePath, "timestamp,event,variant,meal\n");
// }

// // API to receive logs
// app.post("/log", (req, res) => {
//   const { timestamp, event, variant, meal } = req.body;
//   const row = `${timestamp},${event},${variant},${meal || ""}\n`;

//   fs.appendFileSync(logFilePath, row);
//   res.json({ success: true, message: "Log saved" });
// });

// // API to download logs directly
// app.get("/download", (req, res) => {
//   res.download(logFilePath, "ab_test_results.csv");
// });

// // Also serve the public folder statically
// app.use(express.static(publicDir));

// app.listen(PORT, () => {
//   console.log(`✅ Backend running on http://localhost:${PORT}`);
//   console.log(`📂 Logs available at http://localhost:${PORT}/ab_test_logs.csv`);
// });



import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middlewares
app.use(cors({
  origin: FRONTEND_URL,
}));
app.use(bodyParser.json());

// Define paths
const publicDir = path.join(process.cwd(), "public");
const logFilePath = path.join(publicDir, "ab_test_logs.csv");

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

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

// API to download logs directly (keep this)
app.get("/download", (req, res) => {
  res.download(logFilePath, "ab_test_results.csv");
});

// Specific route for the CSV file with proper headers
app.get("/ab_test_logs.csv", (req, res) => {
  // Set proper headers
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ab_test_logs.csv"');
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Check if file exists
  if (!fs.existsSync(logFilePath)) {
    return res.status(404).json({ error: 'CSV file not found' });
  }
  
  // Send the file
  res.sendFile(logFilePath);
});

// Serve static files from public directory (keep this for other files)
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📂 Logs available at http://localhost:${PORT}/ab_test_logs.csv`);
  console.log(`📁 Download endpoint: http://localhost:${PORT}/download`);
});

