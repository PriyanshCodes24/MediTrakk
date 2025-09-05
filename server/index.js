const dotenv = require("dotenv");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // For local development
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    // or if the origin is in our allowed list.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      callback(new Error(msg), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/api/test", require("./routes/testRoute"));
app.use("/api", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/appointments", require("./routes/appointmentRoute"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reports", require("./routes/reportRoute"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware must be last
app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
