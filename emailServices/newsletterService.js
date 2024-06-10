const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { EmailModel } = require("../connections/schema");
const path = require("path");
const fs = require("fs");
const htmlPath = path.join(__dirname, "newsLetter.html");
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

const replaceHtml = (content) => {
  let modifiedHtml;
  const { title, description, dateObject, blogImage, blogId } = content;
  const replaceObj = {
    uniquetitle: title,
    uniquedescription: description,
    uniquedate: dateObject,
  };
  modifiedHtml = htmlFile.replace(
    /uniquetitle|uniquedescription|uniquedate/gi,
    function (matched) {
      return replaceObj[matched];
    }
  );
  let finalHtml = modifiedHtml.replace(
    /<img[^>]*\ssrc="[^"]*"/,
    '<img src="' + blogImage + '"'
  );
  let newBlogLink = `http://192.168.0.122/blogs/${blogId}`;
  let resultHtml = finalHtml.replace(
    /<a[^>]*\shref="[^"]*"/,
    '<a href="' + newBlogLink + '"'
  );
  return resultHtml;
};

const sendBlogsMail = expressAsyncHandler(async (request, response) => {
  // HTML FILE FROM REQUEST BODY
  const content = request.body;
  console.log(content);
  const { description, blogImage, dateObject, blogId, title } = content;
  // const resultHtml = replaceHtml(content);

  // CODE FOR GETTING ALL USERS EMAIL ID
  let userMap = await EmailModel.find({}, { _id: 0 });
  const emailsArray = [];
  userMap.forEach((user) => {
    emailsArray.push(user._doc.email);
  });

  const sampleHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Newsletter</title>
  </head>
  <body style="margin: 0;padding: 0;font-family: Arial, sans-serif;background-color: #f7f7f7;">
    <div style="max-width: 600px;margin: 20px auto;padding: 20px;background-color: #fff;border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h1 style="text-align: center;font-size: 24px;margin-bottom: 20px;">Your Weekly Newsletter Update</h1>
      <p style="text-align: center;margin-bottom: 20px;">${title}</p>
      <div style="margin-bottom: 20px;">
        <p>${description}</p>
      </div>
      <img src=${blogImage} alt="Newsletter Image" style="display: block;margin: 0 auto;max-width: 100%;height: auto;border-radius: 5px;">
      <button href="http://192.168.0.122/blogs/${blogId}" style="width: 140px;padding: 10px;text-align: center;background-color: #007bff;color: #fff;text-decoration: none;border-radius: 5px;">Read More</button>
    </div>
  </body>
  </html>
  `;

  const sampleHtml2 = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Newsletter</title>
    </head>
    <body>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7f7f7">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <tr>
                <td align="center" style="padding: 20px;">
                  <h1 style="font-size: 24px; margin-bottom: 20px;">Your Weekly Newsletter Update</h1>
                  <p style="text-align: justify; margin-bottom: 20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis augue nec ex posuere commodo. Proin sit amet efficitur justo. Donec vitae aliquam odio.</p>
                  <p style="margin-bottom: 20px;">Random content goes here...</p>
                  <a href="https://example.com" style="display: block; width: 100%; padding: 10px; text-align: center; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Read More</a>
                  <img src="${blogImage}" alt="Newsletter Image" width="600" height="300" style="display: block; margin: 20px auto; border-radius: 5px;">
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
    to: emailsArray,
    // to: "praveensaik@aapmor.com",
    subject: "Stay Connected: Your Weekly Company Updates",
    // html: resultHtml,
    html: sampleHtml2,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      response.send(error);
    } else {
      response.send(info);
    }
  });
});
module.exports = { sendBlogsMail };
