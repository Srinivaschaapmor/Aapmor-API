const express = require("express");

const {
    createCertification, 
    getAllCertifications,
    getAllCertificationByempId,
    getEmpNameByEmpId
} = require("../controllers/certificationsController")
const router = express.Router();

router.post("/createcertification", createCertification)
router.get("/getAllCertfications",getAllCertifications )
router.get("/getAllCertificationByempId/:empId", getAllCertificationByempId)
router.get("/getEmpNameByEmpId/:empId",getEmpNameByEmpId)
module.exports = router;