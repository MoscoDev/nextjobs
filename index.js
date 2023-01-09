const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require('dotenv').config();
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");
const nodeCron = require("node-cron");
// routes
const usersRoute = require("./routes/users.routes");
const jobsRoute = require("./routes/job.routes");
const authRoute = require("./routes/auth.routes");
const industryRoute = require("./routes/industry.routes")
const employerRoute = require("./routes/employers.routes");
const applicationRoute = require("./routes/application.routes");
const savedJobRoute = require("./routes/savedJob.routes");

const { ExpireAJob } = require("./controllers/jobController");

// mongoDB connection string.
const db = process.env.MONGODB_URI;

// initialise express
const app = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))


/* 
@description    For CORS (To allow for every request set `corsOption.origin` to true)
*/
const allowlist = ["http://localhost:5000","http://localhost:5173","https://nextjob.onrender.com"];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // enable CORS for this request.
  } else {
    corsOptions = { origin: false }; // disable CORS for this request.
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.options("*", cors()); // enable preflight request for DELETE request
app.use(cors(corsOptionsDelegate));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs (100request per minute)
  message: "You have exceeded the 100 requests in 1 min limit!",
  headers: true,
});
// limited on all requests
app.use(limiter);

/* 
@description    MongoDB Connection using Mongoose ORM
*/
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("MONGODB CONNECTION ERROR: " + err));

/* 
@description    Use route.
*/
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/jobs", jobsRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/industries", industryRoute);
app.use("/api/v1/applications", applicationRoute);
app.use("/api/v1/savedjobs", savedJobRoute);
app.use("/api/v1/employers", employerRoute);

app.get("/", (req, res) => {
  res.json({
    app_name: "nextjobs",
    description:
      "A job listing application for both job seekers and employers. We're the link to your next jobs and employmenet",
  });
});


nodeCron.schedule("0 5 0 * * *", () => {
  ExpireAJob();
  console.log(new Date().toLocaleString());
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server started on port " + port);
});
