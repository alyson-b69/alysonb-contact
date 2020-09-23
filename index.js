const express = require("express");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://alyson-b.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 100, // per IP
});

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/send-email", function (req, res, next) {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    port: 465,
    secure: true,
  });

  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL,
    subject: req.body.subject,
    html:
      req.body.name +
      " (" +
      req.body.email +
      ") " +
      " send this message : " +
      req.body.message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({
        success: true,
        message: "Email Sent",
      });
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  const port = process.env.PORT;
  console.log("Server started at", port);
});
