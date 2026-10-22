const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.use(
  cors({
    origin: "https://wavify-nu.vercel.app/",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);


module.exports = app;