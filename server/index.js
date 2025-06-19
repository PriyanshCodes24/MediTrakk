const dotenv = require("dotenv");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/test", require("./routes/testRoute"));
app.use("/api", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/appointments", require("./routes/appointmentRoute"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
