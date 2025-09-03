const dotenv = require("dotenv");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app", // Replace with your actual frontend domain
  // Add your Render frontend URL here if you have one, e.g., "https://meditrakk-frontend.onrender.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/test", require("./routes/testRoute"));
app.use("/api", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/appointments", require("./routes/appointmentRoute"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reports", require("./routes/reportRoute"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
