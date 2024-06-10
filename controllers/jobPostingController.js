const {
  create,
  getAll,
  getOne,
  getAllOpenJobs,
  updateJob,
  getSimilarJobs,
  getAllKeywords,
  searchJobs,
} = require("../services/jobPostingService");
const JobPosting = require("../models/jobPostingModel");

// CREATE a JobPosting
const createJobPosting = async (req, res) => {
  // insert input validations here
  const validateJobPosting = (jobPosting) => {
    const errors = {};

    // Validation for position
    if (!jobPosting.position || jobPosting.position.trim() === "") {
      errors.position = "Position is required";
    }

    // Validation for experience
    if (
      !jobPosting.experience ||
      ![
        "ENTRY_LEVEL",
        "MID_SENIOR_LEVEL",
        "DIRECTOR",
        "EXECUTIVE",
        "NOT_APPLICABLE",
      ].includes(jobPosting.experience)
    ) {
      errors.experience = "Invalid experience type";
    }

    // Validation for salary
    if (
      !jobPosting.salary ||
      !["notSpecified", "specifyRange"].includes(jobPosting.salary)
    ) {
      errors.salary = "Invalid salary type";
    }

    // Validation for location
    if (!jobPosting.location || jobPosting.location.trim() === "") {
      errors.location = "Location is required";
    }

    // Validation for about
    if (!jobPosting.about || jobPosting.about.trim() === "") {
      errors.about = "About is required";
    }

    // Validation for requirements
    if (!jobPosting.requirements || jobPosting.requirements.trim() === "") {
      errors.requirements = "Requirements are required";
    }

    // Validation for department
    if (!jobPosting.department) {
      errors.department = "Department is required";
    }

    // Validation for employmentType
    if (
      !jobPosting.employmentType ||
      !["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"].includes(
        jobPosting.employmentType
      )
    ) {
      errors.employmentType = "Invalid employment type";
    }

    // Validation for mandatorySkills
    if (
      !Array.isArray(jobPosting.mandatorySkills) ||
      jobPosting.mandatorySkills.length === 0
    ) {
      errors.mandatorySkills = "Mandatory Skills are required";
    }

    // Validation for technicalSkills
    if (
      !Array.isArray(jobPosting.technicalSkills) ||
      jobPosting.technicalSkills.length === 0
    ) {
      errors.technicalSkills = "Technical Skills are required";
    }

    // Validation for numOpenings
    if (
      !jobPosting.numOpenings ||
      isNaN(jobPosting.numOpenings) ||
      jobPosting.numOpenings <= 0
    ) {
      errors.numOpenings = "Invalid number of openings";
    }

    return errors;
  };

  const errors = validateJobPosting(req.body);

  // Check if there are any validation errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Proceed with creating the job posting
    const createdJobPosting = await create(req.body);
    res.status(201).json(createdJobPosting);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to create job posting" });
    console.error("Error:", error);
  }
};

// GET all JobPostings
const getJobPostings = async (req, res) => {
  try {
    const jobPostings = await getAll();
    res.status(200).json(jobPostings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getOpenJobPostings = async (req, res) => {
  try {
    const jobPostings = await getAllOpenJobs();
    res.status(200).json(jobPostings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllImptKeywords = async (req, res) => {
  try {
    const keywords = await getAllKeywords();
    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSimilarJobPostings = async (req, res) => {
  try {
    const { id } = req.params;

    const jobData = await getSimilarJobs(id);

    res.status(200).json(jobData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const JobDesc = await getOne(id);
    res.status(200).json(JobDesc);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`errorMessage: `, error);
    // throw new Error(error.message);
  }
};

//UPDATE JOB DESCRIPTION

const updateJobDescription = async (req, res) => {
  const { id } = req.params;
  let {
    position,
    experience,
    minExperience,
    maxExperience,
    salary,
    minSalary,
    maxSalary,
    location,
    about,
    requirements,
    department,
    employmentType,
    mandatorySkills,
    technicalSkills,
    numOpenings,
    status,
  } = await req.body;

  try {
    const updatedJobDescription = await updateJob(id, {
      position,
      experience,
      minExperience,
      maxExperience,
      salary,
      minSalary,
      maxSalary,
      location,
      about,
      requirements,
      department,
      employmentType,
      mandatorySkills,
      technicalSkills,
      numOpenings,
      status,
    });
    if (!updatedJobDescription) {
      res.status(404);
      throw new Error(`Cannot find any jobApplicant with ID: ${id}`);
    }
    res.status(200).json(updatedJobDescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchQueryJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    const matchingJobs = await searchJobs({ keyword, location });

    res.json(matchingJobs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createJobPosting,
  getJobPostings,
  getJobDescription,
  updateJobDescription,
  getSimilarJobPostings,
  getOpenJobPostings,
  getAllImptKeywords,
  searchQueryJobs,
};
