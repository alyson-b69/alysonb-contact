const express = require("express")
const path = require('path')
const nodeMailer = require('nodemailer')
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/send-email', (req, res) {
  const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      port: 465,
      secure: true,
  });

    const mailOptions = {
      from: req.body.email
      to: process.env.EMAIL,
      subject: req.body.subject,
      html:
        req.body.name +
        " (" +
        req.body.email +
        ") " +
        " send this message : " +
        req.body.message
  };

  transporter.sendMail(mailOptions, (err, info) => {
      if (error) {
          res.send(err);
      }
      else {
          res.status(200).json({
              success: true,
              message: 'Email Sent'
          })
      }
  });

});

const server = app.listen(4000, function(){
    const port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});