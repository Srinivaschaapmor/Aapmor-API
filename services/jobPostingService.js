const JobPosting = require("../models/jobPostingModel");
const mongoose = require("mongoose");

// CREATE a JobPosting
const create = async (job) => {
  try {
    const jobPosting = await JobPosting.create(job);
    return jobPosting;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error creating data");
  }
};

// GET all JobPostings
const getAll = async () => {
  try {
    const jobPostings = await JobPosting.find().sort({
      createdAt: -1,
    });
    return jobPostings;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};
const getAllOpenJobs = async () => {
  try {
    const jobPostings = await JobPosting.find({ status: "open" }).sort({
      createdAt: -1,
    });
    return jobPostings;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

const getAllKeywords = async () => {
  try {
    let keywords = await JobPosting.aggregate([
      {
        $project: {
          _id: 0,
          department: 1,
          position: 1,
          mandatorySkills: 1,
          technicalSkills: 1,
          employmentType: 1,
          experience: 1,
          location: 1,
        },
      },
    ]);

    return keywords;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

const getOne = async (id) => {
  const jobPostingId = new mongoose.Types.ObjectId(id);
  try {
    const particularJobDesc = await JobPosting.findById(jobPostingId);
    return particularJobDesc;
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateJob = async (jobId, jobDetails) => {
  const jobPostingId = new mongoose.Types.ObjectId(jobId);
  try {
    const job = await JobPosting.findByIdAndUpdate(jobPostingId, jobDetails);
    // cannot find any job with this id in database
    if (!job) {
      return job;
    }
    const updatedJobDetails = await JobPosting.findById(jobPostingId);
    console.log(`Hey I am updateJob from Api:`, updatedJobDetails);
    return updatedJobDetails;
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error("Error updating data");
  }
};

const getSimilarJobs = async (department) => {
  try {
    // const jobPostingId = new mongoose.Types.ObjectId(jobId);
    // const job = await JobPosting.findById(jobPostingId);
    // console.log(job);

    // const department = job.department;

    let similarJobs = await JobPosting.aggregate([
      {
        $match: {
          department,
        },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          _id: 1,
          position: 1,
          about: 1,
          createdAt: 1,
          location: 1,
        },
      },
    ]);

    if (similarJobs.length === 0) {
      similarJobs = await JobPosting.aggregate([
        {
          $limit: 3,
        },
        {
          $project: {
            _id: 1,
            position: 1,
            about: 1,
            createdAt: 1,
            location: 1,
          },
        },
      ]);
    }

    return similarJobs;
  } catch (error) {
    console.error("Error fetching similar jobs:", error);
    throw new Error("Error fetching similar jobs");
  }
};

const searchJobs = async ({ keyword, location }) => {
  try {
    let query = { status: { $regex: "^open$", $options: "i" } }; // Filter by status "open" by default

    if (keyword && location) {
      // Case-insensitive search for keyword in title or department
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { department: { $regex: keyword, $options: "i" } },
      ];

      // Case-insensitive search for location
      query.location = { $regex: location, $options: "i" };
    } else if (keyword) {
      // Case-insensitive search for keyword in title or department
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { department: { $regex: keyword, $options: "i" } },
      ];
    } else if (location) {
      // Case-insensitive search for location
      query.location = { $regex: location, $options: "i" };
    } else {
      // If no keyword or location is provided, return all jobs
      query = {}; // Reset query to empty object to remove status filter
    }

    // Include both mandatory and technical skills in the query
    if (keyword) {
      query.$or.push(
        { mandatorySkills: { $in: [new RegExp(keyword, "i")] } },
        { technicalSkills: { $in: [new RegExp(keyword, "i")] } }
      );
    }

    const matchingJobs = await JobPosting.find(query);
    return matchingJobs;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  updateJob,
  getSimilarJobs,
  getAllOpenJobs,
  getAllKeywords,
  searchJobs,
};
