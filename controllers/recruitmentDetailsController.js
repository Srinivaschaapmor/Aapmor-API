const {
  create,
  getAll,
  getOne,
  updateApplicantDesc,
  getOneCandidateDetails,
} = require("../services/recruitmentDetailsService");

const genderList = ["Male", "Female", "Other"];

const createRecruitmentApplicant = async (req, res) => {
  try {
    const {
      jobPostingId,
      jobApplicantId,
      firstName,
      lastName,
      phoneNumber,
      email,
      source,
      role,
      gender,
      resume,
      education,
      experience,
      technicalSkills,
      interviewRounds,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !resume ||
      !jobPostingId ||
      !jobApplicantId ||
      !role
    ) {
      res.status(400).json({ error: "Missing required fields" });
    }

    if (gender && !genderList.includes(gender)) {
      res.status(400).json({ error: "Invalid gender provided" });
    }

    const applicantDetails = await create(req.body);

    if (applicantDetails === "invalid job") {
      res.status(400);
      throw new Error("Invalid job posting id");
    } else if (applicantDetails === "invalid applicant") {
      res.status(400);
      throw new Error("Invalid job applicant id");
    } else {
      res.status(201).json(applicantDetails);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all JobApplicants
const getRecruitmentApplicant = async (req, res) => {
  try {
    const jobApplicants = await getAll();
    res.status(200).json(jobApplicants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApplicantDescription = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const applicantDesc = await getOne(id);
    res.status(200).json(applicantDesc);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`errorMessage: `, error);
    // throw new Error(error.message);
  }
};
const getCandidateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const applicantDesc = await getOneCandidateDetails(id);
    if (!applicantDesc) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(applicantDesc);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`errorMessage: `, error);
  }
};

const updateApplicantDescription = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  let { interviewType, interviewer, techRating, commRating, feedback, status } =
    await req.body;
  console.log(req.body);
  try {
    const updatedJobDescription = await updateApplicantDesc(id, req.body);
    if (!updatedJobDescription) {
      res.status(404);
      throw new Error(`Cannot find any jobApplicant with ID: ${id}`);
    }
    res.status(200).json(updatedJobDescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRecruitmentApplicant,
  getRecruitmentApplicant,
  getApplicantDescription,
  updateApplicantDescription,
  getCandidateDetails,
};
