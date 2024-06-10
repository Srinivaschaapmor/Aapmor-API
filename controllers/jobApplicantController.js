const {
  create,
  getAll,
  updateOne,
  deleteById,
  getByJobId,
} = require("../services/jobApplicantService");
const xss = require("xss");

const sourcesList = ["linkedIn", "naukri", "employeeReference", "selfApply"];
const statusList = [
  "yetToInitiate",
  "noResponse",
  "notInterested",
  "waitingForInterview",
  "movedToInterview",
];
const genderList = ["Male", "Female", "Other"];

// CREATE a JobApplicant
const createJobApplicant = async (req, res) => {
  const access = JSON.parse(req.cookies.access);
  if (
    !access ||
    (!access.includes("Recent_Openings_View") &&
      !access.includes("Recent_Openings_JobOpenings_View") &&
      !access.includes("Recent_Openings_JobOpenings_Write"))
  ) {
    res.status(401).json({ error: "Unauthorised request" });
  } else {
    let {
      jobPostingId,
      firstName,
      lastName,
      phoneNumber,
      email,
      source,
      status,
      initialImpression,
      comments,
      resume,
      gender,
    } = await req.body;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !resume ||
      !jobPostingId
    ) {
      res.status(400).json({ error: "Missing required fields" });
    }

    if (source && !sourcesList.includes(source)) {
      res.status(400).json({ error: "Invalid source provided" });
    }

    if (status && !statusList.includes(status)) {
      res.status(400).json({ error: "Invalid status provided" });
    }

    if (gender && !genderList.includes(gender)) {
      res.status(400).json({ error: "Invalid gender provided" });
    }

    if (
      initialImpression &&
      (!isValidInteger(initialImpression) ||
        parseInt(initialImpression) > 10 ||
        parseInt(initialImpression) < 0)
    ) {
      res.status(400).json({
        error: "Initial Impression must be a number between 0 and 10",
      });
    }

    if (comments) {
      comments = xss(comments);
    }

    try {
      const jobApplicant = await create(req.body);
      if (jobApplicant === null) {
        res.status(500);
        throw new Error("Applicant already exists");
      } else if (jobApplicant === "jobNotFound") {
        res.status(400);
        throw new Error("Invalid job posting id");
      } else {
        res.status(201).json(jobApplicant);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// GET all JobApplicants
const getJobApplicants = async (req, res) => {
  const access = JSON.parse(req.cookies.access);
  if (
    !access ||
    (!access.includes("Recent_Openings_View") &&
      !access.includes("Recent_Openings_JobOpenings_View"))
  ) {
    res.status(401).json({ error: "Unauthorised request" });
  } else {
    try {
      const jobApplicants = await getAll();
      res.status(200).json(jobApplicants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// GET all JobApplicants
const getApplicantsByJobId = async (req, res) => {
  // console.log("cookie", req.cookies.userEmail);
  const access = JSON.parse(req.cookies.access);
  if (
    !access ||
    (!access.includes("Recent_Openings_View") &&
      !access.includes("Recent_Openings_JobOpenings_View"))
  ) {
    res.status(401).json({ error: "Unauthorised request" });
  } else {
    const { id } = req.params;
    try {
      const jobApplicants = await getByJobId(id);
      res.status(200).json(jobApplicants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// UPDATE a JobApplicant
const updateJobApplicant = async (req, res) => {
  const access = JSON.parse(req.cookies.access);
  if (
    !access ||
    (!access.includes("Recent_Openings_View") &&
      !access.includes("Recent_Openings_JobOpenings_View") &&
      !access.includes("Recent_Openings_JobOpenings_Write"))
  ) {
    res.status(401).json({ error: "Unauthorised request" });
  } else {
    const { id } = req.params;

    let { status, initialImpression, comments } = await req.body;

    if (status && !statusList.includes(status)) {
      res.status(400).json({ error: "Invalid status provided" });
    }

    if (
      initialImpression &&
      (!isValidInteger(initialImpression) ||
        parseInt(initialImpression) > 10 ||
        parseInt(initialImpression) < 0)
    ) {
      res.status(400).json({
        error: "Initial Impression must be a number between 0 and 10",
      });
    }

    if (comments) {
      comments = xss(comments);
    }

    try {
      const updatedJobApplicant = await updateOne(id, {
        status,
        initialImpression,
        comments,
      });

      if (!updatedJobApplicant) {
        res.status(404);
        throw new Error(`Cannot find any jobApplicant with ID: ${id}`);
      }
      res.status(201).json(updatedJobApplicant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// DELETE a JobApplicant
const deleteJobApplicant = async (req, res) => {
  const access = JSON.parse(req.cookies.access);
  if (
    !access ||
    (!access.includes("Recent_Openings_View") &&
      !access.includes("Recent_Openings_JobOpenings_View") &&
      !access.includes("Recent_Openings_JobOpenings_Write"))
  ) {
    res.status(401).json({ error: "Unauthorised request" });
  } else {
    const { id } = req.params;
    try {
      const deletedJobApplicant = await deleteById(id);
      if (!deletedJobApplicant) {
        res.status(404);
        throw new Error(`Cannot find any jobApplicant with ID: ${id}`);
      }
      res.status(200).json(deletedJobApplicant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// HELPER METHODS --------------------------------------------------------
function isValidInteger(str) {
  return !isNaN(parseInt(str)) && Number.isInteger(parseFloat(str));
}

module.exports = {
  createJobApplicant,
  getJobApplicants,
  updateJobApplicant,
  deleteJobApplicant,
  getApplicantsByJobId,
};
