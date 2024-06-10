const JobApplicant = require("../models/jobApplicantModel");
const mongoose = require("mongoose");
const JobPosting = require("../models/jobPostingModel");

// CREATE a JobApplicant
const create = async (applicant) => {
  try {
    // check if the given job id is valid
    let jobId = new mongoose.Types.ObjectId(applicant.jobPostingId);
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return "jobNotFound";
    }

    // check if applicant with this email or phone already applied to this job
    const existingApplicant = await JobApplicant.aggregate([
      {
        // get rows from JobApplicants collection for this job
        // with given email or mobile number
        $match: {
          jobPostingId: jobId,
          $or: [
            { email: applicant.email },
            { phoneNumber: applicant.phoneNumber },
          ],
        },
      },
    ]);

    if (existingApplicant.length >= 1) {
      // console.log(applicant.email, existingApplicant);
      return null;
    }

    const jobApplicant = await JobApplicant.create(applicant);
    return jobApplicant;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error creating data");
  }
};

// GET all JobApplicants
const getAll = async () => {
  try {
    const jobApplicants = await JobApplicant.find();
    return jobApplicants;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

// GET all JobApplicants for a particular job
const getByJobId = async (id) => {
  const jobPostingId = new mongoose.Types.ObjectId(id);
  try {
    const applicants = await JobApplicant.aggregate([
      {
        // get rows from JobApplicants collection with given jobPostingId
        $match: { jobPostingId },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     jobPostingId: 1,
      //     firstName: 1,
      //     lastName: 1,
      //     phoneNumber: 1,
      //     email: 1,
      //     resume: 1,
      //     source: 1,
      //   },
      // },
    ]);

    return applicants;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

// UPDATE a JobApplicant
const updateOne = async (applicantId, detailsToUpdate) => {
  try {
    const jobApplicant = await JobApplicant.findByIdAndUpdate(
      applicantId,
      detailsToUpdate
    );

    // cannot find any applicant with this id in database
    if (!jobApplicant) {
      return jobApplicant;
    }

    const updatedJobApplicant = await JobApplicant.findById(applicantId);
    return updatedJobApplicant;
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error("Error updating data");
  }
};

// DELETE a JobApplicant
const deleteById = async (applicantId) => {
  try {
    const jobApplicant = await JobApplicant.findByIdAndDelete(applicantId);
    if (!jobApplicant) {
      return jobApplicant;
      // res.status(404);
      // throw new Error(`cannot find any product with ID ${id}`);
    }

    return jobApplicant;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error("Error deleting data");
  }
};

module.exports = {
  create,
  getAll,
  updateOne,
  deleteById,
  getByJobId,
};
