const { Router } = require("express");
const controller = require("../src/components/employees/controller");
const { sendEmail } = require("../emailServices/otpService");
const { sendBlogsMail } = require("../emailServices/newsletterService");
const jwt = require("jsonwebtoken");

const router = Router();

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(202);
    response.send("Authorization failed");
  } else {
    jwt.verify(jwtToken, "ABPPBH_ST", (error, payload) => {
      if (error) {
        response.status(202);
        response.send("Invalid JWT Token");
      } else {
        request.email = payload.email;
        next();
      }
    });
  }
};

router.post("/sendEmail", sendEmail);
router.post("/publishBlog", sendBlogsMail);
router.post("/login", controller.postLoginDetails);
router.post("/blogs", controller.createBlog);
router.get("/blogs/filter/", controller.getAllBlogsByFilter);
router.get("/savedblogs", controller.getUserSavedBlogs);
router.put("/saveblog", authenticateToken, controller.unSaveBlog);
router.post("/saveblog", authenticateToken, controller.saveBlog);
router.put("/blog/likes", controller.updateLikes);
router.post("/comments", controller.postComments);
router.get("/blogs/:id", controller.getBlogById);
router.get("/feedback/data", controller.getFeedback);
router.put("/updaterecruit/:id", controller.updateRecruitmentDetails);
router.post("/postrecruit", controller.postRecruitmentDetails);
router.get("/recruit-details", controller.getRecruitmentDetails);
router.get("/recruit/:id", controller.getRecruitmentDetailsById);
router.get("/getquote", controller.quoteGenerator);
router.get("/", controller.getEmployees);
router.post("/upload", controller.createEmployee);
router.get("/:id", controller.getEmpId);
router.post("/feedback", controller.postFeedback);

module.exports = router;
