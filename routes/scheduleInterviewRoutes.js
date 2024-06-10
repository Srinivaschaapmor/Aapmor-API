const express = require("express");

const {
  createInterviewSchedule,
  getInterviewSchedule,
  getCandidateInfo,
} = require("../controllers/scheduleInterviewController");
const {
  sendInterviewScheduleMail,
} = require("../emailServices/scheduleInterview");

const router = express.Router();

router.post("/", createInterviewSchedule);
router.post("/sendEmail", sendInterviewScheduleMail);
router.get("/", getInterviewSchedule);
router.get("/candidate-details", getCandidateInfo);

module.exports = router;
