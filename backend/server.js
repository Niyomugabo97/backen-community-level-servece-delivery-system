const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//////////////// CONNECT DB //////////////////
const mongoUrl = process.env.MongoDB_Url || process.env.MONGO_URI;
mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//////////////// ROUTES //////////////////
const homeUpdateRoutes = require("./routes/homeUpdates");
const attendanceRoutes = require("./routes/attendance");
const memberRoutes = require("./routes/members");
const uploadRoutes = require("./routes/upload");

app.use("/api/home-updates", homeUpdateRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/upload", uploadRoutes);

//////////////// START //////////////////
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});