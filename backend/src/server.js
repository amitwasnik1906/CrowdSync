const express = require('express');
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const bodyParser = require('body-parser');

dotenv.config()

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin : "*"}))

// Routes
const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoutes');
const busRoutes = require('./routes/busRoute');
const authRoute = require('./routes/authRoute')

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/auth", authRoute);

// Start the server
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});