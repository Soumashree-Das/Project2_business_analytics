import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middlewares
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Define paths - use absolute paths for better deployment compatibility
const publicDir = path.join(__dirname, "public");
const logFilePath = path.join(publicDir, "ab_test_logs.csv");

console.log("📁 Public directory:", publicDir);
console.log("📄 Log file path:", logFilePath);

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log("✅ Created public directory");
}

// Initialize CSV file with headers if it doesn't exist
if (!fs.existsSync(logFilePath)) {
  const headers = "timestamp,event,variant,meal\n";
  fs.writeFileSync(logFilePath, headers);
  console.log("✅ Created CSV file with headers");
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    logFileExists: fs.existsSync(logFilePath)
  });
});

// API to receive logs
app.post("/log", (req, res) => {
  try {
    const { timestamp, event, variant, meal } = req.body;
    
    // Validate required fields
    if (!timestamp || !event) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: timestamp and event" 
      });
    }

    // Escape commas and quotes in data to prevent CSV corruption
    const escapeCsvField = (field) => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const row = `${escapeCsvField(timestamp)},${escapeCsvField(event)},${escapeCsvField(variant)},${escapeCsvField(meal || "")}\n`;
    
    fs.appendFileSync(logFilePath, row);
    console.log(`📝 Logged: ${event} - ${variant} - ${meal || 'N/A'}`);
    
    res.json({ success: true, message: "Log saved successfully" });
  } catch (error) {
    console.error("❌ Error saving log:", error);
    res.status(500).json({ success: false, message: "Failed to save log" });
  }
});

// API to download logs with proper error handling
app.get("/download", (req, res) => {
  try {
    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({ 
        error: 'CSV file not found',
        message: 'No logs have been recorded yet'
      });
    }

    const stats = fs.statSync(logFilePath);
    console.log(`📥 Downloading CSV file (${stats.size} bytes)`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ab_test_results.csv"');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.download(logFilePath, "ab_test_results.csv", (err) => {
      if (err) {
        console.error("❌ Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      }
    });
  } catch (error) {
    console.error("❌ Download error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Alternative endpoint for direct CSV access
app.get("/csv", (req, res) => {
  try {
    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({ 
        error: 'CSV file not found' 
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ab_test_logs.csv"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const fileStream = fs.createReadStream(logFilePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("❌ CSV access error:", error);
    res.status(500).json({ error: 'Failed to access CSV file' });
  }
});

// Get logs as JSON for preview
app.get("/logs", (req, res) => {
  try {
    if (!fs.existsSync(logFilePath)) {
      return res.json({ logs: [], message: "No logs found" });
    }

    const csvContent = fs.readFileSync(logFilePath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    const logs = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    });

    res.json({ 
      logs: logs.slice(-100), // Return last 100 logs
      total: logs.length,
      message: `Found ${logs.length} log entries`
    });
  } catch (error) {
    console.error("❌ Error reading logs:", error);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// Serve static files from public directory
app.use('/public', express.static(publicDir));

// Root endpoint with API information
app.get('/', (req, res) => {
  res.json({
    message: 'A/B Test Backend Server',
    endpoints: {
      health: '/health',
      log: 'POST /log',
      download: '/download',
      csv: '/csv',
      logs: '/logs (JSON preview)'
    },
    status: 'running'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: ['/', '/health', '/log', '/download', '/csv', '/logs']
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📥 Download CSV: http://localhost:${PORT}/download`);
  console.log(`📄 Direct CSV: http://localhost:${PORT}/csv`);
  console.log(`📋 Logs JSON: http://localhost:${PORT}/logs`);
});




// // import express from "express";
// // import bodyParser from "body-parser";
// // import cors from "cors";
// // import fs from "fs";
// // import path from "path";

// // const app = express();
// // const PORT = 5000;

// // // Middlewares
// // app.use(cors());
// // app.use(bodyParser.json());

// // // CSV file path
// // const csvFile = path.join(process.cwd(), "ab_test_logs.csv");

// // // Ensure CSV headers
// // if (!fs.existsSync(csvFile)) {
// //   fs.writeFileSync(csvFile, "timestamp,event,variant,meal\n");
// // }

// // // API: Log event
// // app.post("/api/log", (req, res) => {
// //   const { event, variant, meal } = req.body;
// //   const timestamp = new Date().toISOString();

// //   const row = `${timestamp},${event},${variant},${meal || ""}\n`;
// //   fs.appendFileSync(csvFile, row);

// //   res.json({ message: "Event logged successfully" });
// // });

// // // API: Download CSV
// // app.get("/api/export", (req, res) => {
// //   res.download(csvFile, "ab_test_logs.csv");
// // });

// // app.listen(PORT, () => {
// //   console.log(`✅ Server running at http://localhost:${PORT}`);
// // });

// // import dotenv from "dotenv";
// // dotenv.config();
// // import express from "express";
// // import cors from "cors";
// // import bodyParser from "body-parser";
// // import fs from "fs";
// // import path from "path";

// // const app = express();
// // const PORT = process.env.PORT ||5000;
// // const FRONTEND_URL = process.env.FRONTEND_URL;

// // // Middlewares
// // app.use(cors({
// //   origin: FRONTEND_URL
// // }));
// // app.use(bodyParser.json());

// // // Store logs in a CSV file
// // const logFilePath = path.join(process.cwd(), "ab_test_logs.csv");

// // // Ensure file has headers if new
// // if (!fs.existsSync(logFilePath)) {
// //   fs.writeFileSync(logFilePath, "timestamp,event,variant,meal\n");
// // }

// // // API to receive logs
// // app.post("/log", (req, res) => {
// //   const { timestamp, event, variant, meal } = req.body;
// //   const row = `${timestamp},${event},${variant},${meal || ""}\n`;

// //   fs.appendFileSync(logFilePath, row);
// //   res.json({ success: true, message: "Log saved" });
// // });

// // // API to download logs
// // app.get("/download", (req, res) => {
// //   res.download(logFilePath, "ab_test_results.csv");
// // });

// // app.listen(PORT, () => {
// //   console.log(`✅ Backend running on http://localhost:${PORT}`);
// // });

// // import dotenv from "dotenv";
// // dotenv.config();
// // import express from "express";
// // import cors from "cors";
// // import bodyParser from "body-parser";
// // import fs from "fs";
// // import path from "path";

// // const app = express();
// // const PORT = process.env.PORT || 5000;
// // const FRONTEND_URL = process.env.FRONTEND_URL;

// // // Middlewares
// // app.use(cors({
// //   origin: FRONTEND_URL,
// // }));
// // app.use(bodyParser.json());

// // // Define paths
// // const publicDir = path.join(process.cwd(), "public");
// // const logFilePath = path.join(publicDir, "ab_test_logs.csv");

// // // Ensure public directory exists
// // if (!fs.existsSync(publicDir)) {
// //   fs.mkdirSync(publicDir);
// // }

// // // Ensure file has headers if new
// // if (!fs.existsSync(logFilePath)) {
// //   fs.writeFileSync(logFilePath, "timestamp,event,variant,meal\n");
// // }

// // // API to receive logs
// // app.post("/log", (req, res) => {
// //   const { timestamp, event, variant, meal } = req.body;
// //   const row = `${timestamp},${event},${variant},${meal || ""}\n`;

// //   fs.appendFileSync(logFilePath, row);
// //   res.json({ success: true, message: "Log saved" });
// // });

// // // API to download logs directly
// // app.get("/download", (req, res) => {
// //   res.download(logFilePath, "ab_test_results.csv");
// // });

// // // Also serve the public folder statically
// // app.use(express.static(publicDir));

// // app.listen(PORT, () => {
// //   console.log(`✅ Backend running on http://localhost:${PORT}`);
// //   console.log(`📂 Logs available at http://localhost:${PORT}/ab_test_logs.csv`);
// // });



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

// // API to download logs directly (keep this)
// app.get("/download", (req, res) => {
//   res.download(logFilePath, "ab_test_results.csv");
// });

// // Specific route for the CSV file with proper headers
// app.get("/ab_test_logs.csv", (req, res) => {
//   // Set proper headers
//   res.setHeader('Content-Type', 'text/csv');
//   res.setHeader('Content-Disposition', 'attachment; filename="ab_test_logs.csv"');
//   res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
  
//   // Check if file exists
//   if (!fs.existsSync(logFilePath)) {
//     return res.status(404).json({ error: 'CSV file not found' });
//   }
  
//   // Send the file
//   res.sendFile(logFilePath);
// });

// // Serve static files from public directory (keep this for other files)
// app.use(express.static(publicDir));

// app.listen(PORT, () => {
//   console.log(`✅ Backend running on http://localhost:${PORT}`);
//   console.log(`📂 Logs available at http://localhost:${PORT}/ab_test_logs.csv`);
//   console.log(`📁 Download endpoint: http://localhost:${PORT}/download`);
// });

