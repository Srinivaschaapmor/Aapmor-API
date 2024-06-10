const express = require("express");

const {
  createJobPosting,
  getJobPostings,
  getJobDescription,
  updateJobDescription,
  getSimilarJobPostings,
  getOpenJobPostings,
  getAllImptKeywords,
  searchQueryJobs,
} = require("../controllers/jobPostingController");

const router = express.Router();

router.post("/", createJobPosting);
router.get("/", getJobPostings);
router.get("/jobs", getOpenJobPostings);
router.get("/:id", getJobDescription);
router.put("/:id", updateJobDescription);
router.get("/similarJobs/:id", getSimilarJobPostings);
router.get("/search/options", getAllImptKeywords);
router.get("/api/jobs/search", searchQueryJobs);

// router.get('/:id', getProduct);

// router.post('/', createProduct);

// // update a product
// router.put('/:id', updateProduct);

// // delete a product

// router.delete('/:id', deleteProduct);

module.exports = router;
