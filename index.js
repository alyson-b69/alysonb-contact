const express = require("express");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");x

const cors = require('cors')
dotenv.config();

const app = express();
app.use(cors())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://alyson-b.fr");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 30, // per IP
});

app.use(limiter);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post("/send-email", (req, res, next) => {

    const transporter = nodeMailer.createTransport({
        host: "smtp.sfr.fr",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: `Alyson CV  <${process.env.EMAIL}>`,
        to: process.env.EMAILTOSEND,
        subject: req.body.subject,
        html: `<html lang="fr">
                <body>
                    <div>
                         <header style="background: #fa6862; color: #ffffff; padding: 8px 12px">${req.body.name} ( ${req.body.from} ) a envoyé ce message : </header>
                         <div style="color: #111827; padding: 8px 12px" >${req.body.message.replaceAll('\n', '<br />')}</div>
                    </div>
                </body>
              </html>`,
    };


    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
             res.send(err);
        } else {
             res.status(200).json({
                success: true,
                message: "Email_sent",
                info: info
            });
        }
    })

});

app.listen(process.env.PORT || 5001, () => {
    const port = process.env.PORT;
    console.log("Server started at", port);
});
