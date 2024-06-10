const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const employeeRoutes = require("./routes/routes");
const PORT = 5000 || process.env.PORT;
const jobPostingRoutes = require("./routes/jobPostingRoutes");
const jobApplicantRoutes = require("./routes/jobApplicantRoutes");
const masterDataRoutes = require("./routes/masterDataRoutes");
const recruitmentDetailsRoutes = require("./routes/recruitmentDetailsRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const scheduleInterviewRoutes = require("./routes/scheduleInterviewRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true, //access-control-allow-credentials:true
  // optionSuccessStatus:200
};
app.use(cors(corsOptions));
app.use(cookieParser());

// mongoose.connect(`mongodb://192.168.0.122:27017/aapmor360Db`);
// mongoose.connect(`mongodb+srv://chsrinivas4a:${process.env.DB_PASSWORD}@cluster0.mzzwimz.mongodb.net/Aapmor360?retryWrites=true&w=majority&appName=Cluster0`)
mongoose.connect(
  `mongodb+srv://aapmor360:aapmor360@aapmor360.axrpjra.mongodb.net/Aapmor360?retryWrites=true&w=majority&appName=Aapmor360`
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

app.use("/api/v1/employee", employeeRoutes);
app.use("/api/jobPosting", jobPostingRoutes);
app.use("/api/jobApplicant", jobApplicantRoutes);
app.use("/api/masterData", masterDataRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/recruitmentDetails", recruitmentDetailsRoutes);
app.use("/api/scheduleInterview", scheduleInterviewRoutes);
app.get('/helo', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

module.exports = app;
