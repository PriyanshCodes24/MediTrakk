const dotenv = require("dotenv");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// app.use(cors());
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app", // replace with your actual frontend domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
