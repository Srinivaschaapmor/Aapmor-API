const express = require("express");

const {
  createRecruitmentApplicant,
  getRecruitmentApplicant,
  getApplicantDescription,
  updateApplicantDescription,
  getCandidateDetails,
} = require("../controllers/recruitmentDetailsController");

const router = express.Router();

router.post("/", createRecruitmentApplicant);
router.get("/", getRecruitmentApplicant);
router.get("/:id", getApplicantDescription);
router.put("/:id", updateApplicantDescription);
router.put("/:id", updateApplicantDescription);
router.get("/candidate-details/:id", getCandidateDetails);

module.exports = router;
