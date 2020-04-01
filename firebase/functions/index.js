require("dotenv").config();
const functions = require("firebase-functions");

const domain = "beta.buffalo311.org";
const fromEmail = `info@${domain}`;

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.submitThanks = functions.firestore
  .document("/issues/{id}")
  .onCreate((snap, context) => {
    const isAnonymous = snap.data().anonymous;
    if (!isAnonymous) {
      const toEmail = snap.data().email;
      const msg = {
        to: toEmail,
        from: fromEmail,
        subject: "Sending with Twilio SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>"
      };
      return sgMail.send(msg);
    } else {
      return null;
    }
  });
