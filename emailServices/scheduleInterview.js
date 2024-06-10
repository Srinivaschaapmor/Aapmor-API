const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { EmailModel } = require("../connections/schema");
const path = require("path");
const fs = require("fs");
const htmlPath = path.join(__dirname, "scheduleInterviewMail.html");
const htmlFile = fs.readFileSync(htmlPath, "utf-8");

dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendInterviewScheduleMail = expressAsyncHandler(
  async (request, response) => {
    // HTML FILE FROM REQUEST BODY
    const content = request.body;
    console.log(content);
    const { interviewerEmail, candidateEmail, file, candidateFile } = content;
    console.log(`Interviewer Email:`, interviewerEmail);
    // const resultHtml = replaceHtml(content);

    // CODE FOR GETTING ALL USERS EMAIL ID
    // let emailOfInterviewer  = await sendInterviewScheduleMail.find({interviewerEmail});

    const sampleHtml1 = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Schedule for Interviewer</title>
      </head>
      <body>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7f7f7">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <h1 style="font-size: 24px; margin-bottom: 20px;">Interview Schedule for Interviewer</h1>
                    <p style="text-align: justify; margin-bottom: 20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis augue nec ex posuere commodo. Proin sit amet efficitur justo. Donec vitae aliquam odio.</p>
                    <p style="margin-bottom: 20px;">Random content about interviewer schedule goes here...</p>
                    <a href="https://example.com" style="display: block; width: 100%; padding: 10px; text-align: center; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Read More</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const sampleHtml2 = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Interview Schedule for Candidate</title>
    </head>
    <body>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7f7f7">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <tr>
                <td align="center" style="padding: 20px;">
                  <h1 style="font-size: 24px; margin-bottom: 20px;">Interview Schedule for Candidate</h1>
                  <p style="text-align: justify; margin-bottom: 20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis augue nec ex posuere commodo. Proin sit amet efficitur justo. Donec vitae aliquam odio.</p>
                  <p style="margin-bottom: 20px;">Random content about Candidates interview goes here...</p>
                  <a href="https://example.com" style="display: block; width: 100%; padding: 10px; text-align: center; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Read More</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: interviewerEmail,
      // to: "praveensaik@aapmor.com",
      subject: "Your have a schedule of Interview for a candidate",
      // html: resultHtml,
      html: sampleHtml1,
      attachments: [
        {
          filename: "event.ics",
          content: file,
          method: "request",
        },
      ],
    };

    var mailOptions2 = {
      from: process.env.SMTP_MAIL,
      to: candidateEmail,
      // to: "praveensaik@aapmor.com",
      subject: "Scheduling an interview for you with Aapmore",
      // html: resultHtml,
      html: sampleHtml2,
      attachments: [
        {
          filename: "event.ics",
          content: candidateFile,
          method: "request",
        },
      ],
    };

    Promise.all(
      [mailOptions, mailOptions2].map((opt) =>
        transporter.sendMail(opt).catch(console.log)
      )
    ).then(([sendMail1Res, sendMail2Res]) => {
      console.log("sendMail1Res: ", sendMail1Res);
      console.log("sendMail2Res: ", sendMail2Res);
    });

    // transporter.sendMail(mailOptions, async (error, info) => {
    //   if (error) {
    //     response.send(error);
    //   } else {
    //     response.send(info);
    //   }
    // });
  }
);

module.exports = { sendInterviewScheduleMail };

// const replaceHtml = (content) => {
//   let modifiedHtml;
//   const { title, description, dateObject, blogImage, blogId } = content;
//   const replaceObj = {
//     uniquetitle: title,
//     uniquedescription: description,
//     uniquedate: dateObject,
//   };
//   modifiedHtml = htmlFile.replace(
//     /uniquetitle|uniquedescription|uniquedate/gi,
//     function (matched) {
//       return replaceObj[matched];
//     }
//   );
//   let finalHtml = modifiedHtml.replace(
//     /<img[^>]*\ssrc="[^"]*"/,
//     '<img src="' + blogImage + '"'
//   );
//   let newBlogLink = `http://192.168.0.122/blogs/${blogId}`;
//   let resultHtml = finalHtml.replace(
//     /<a[^>]*\shref="[^"]*"/,
//     '<a href="' + newBlogLink + '"'
//   );
//   return resultHtml;
// };
