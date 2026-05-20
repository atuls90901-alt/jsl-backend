import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import routes from "./routes/userroutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

/* ---------------- CORS SETUP ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://jsl-frontend.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // fallback (prevents production crash)
      return callback(null, true);
    },
    credentials: true,
  })
);



app.use("/api/users", routes);



app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });