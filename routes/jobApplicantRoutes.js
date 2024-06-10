const express = require("express");

const {
  createJobApplicant,
  getJobApplicants,
  updateJobApplicant,
  deleteJobApplicant,
  getApplicantsByJobId,
} = require("../controllers/jobApplicantController");

const router = express.Router();

router.post("/", createJobApplicant);
router.get("/", getJobApplicants);
router.get("/:id", getApplicantsByJobId);
router.put("/:id", updateJobApplicant);
router.delete("/:id", deleteJobApplicant);

module.exports = router;
