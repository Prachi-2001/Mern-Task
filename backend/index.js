const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const userRoute = require("./routes/user");
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.use("/products", userRoute);
