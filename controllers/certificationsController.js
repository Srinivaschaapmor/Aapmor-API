
const Certifications = require("../models/certificationsModel")
const {employeeModel} = require("../connections/schema")


const getAllCertifications = async(req, res) => {
    const access = JSON.parse(req.cookies.access);
    
    try{
        if (
            !access ||
            (!access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write"))
          ) {
            res.status(401).json({ error: "Unauthorised request" });
          } else {
        const certifications = await Certifications.find();

        // Send the certifications as a response
        res.status(200).json(certifications);
          }
    }
    catch(err){
        res.status(500).json({error: err.message })
    }
}

const getEmpNameByEmpId = async(req, res) => {
    const access = JSON.parse(req.cookies.access);
    try{
        if (
            !access ||
            (!access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write"))
          ) {
            res.status(401).json({ error: "Unauthorised request" });
          } else {
            const {empId} = req.params;
            console.log(empId);
            const emp = await employeeModel.find({ employeeId: empId })
            if (emp) {
                const employee = emp[0]
                console.log(employee)
                res.status(200).json({ employee });
            } else {
                res.status(404).json({ error: 'Employee not found' });
            }

          }
       
    }
    catch(err){
        res.status(500).json({error: err.message })
    }
}



 const createCertification = async (req, res) => {
    const access = JSON.parse(req.cookies.access);
    try{
        if (
            !access ||
            (!access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write"))
          ) {
            res.status(401).json({ error: "Unauthorised request" });
          }
          else{
            const {
                employeeId,
                employeeName,
                certificationName, 
                certificationId, 
                issuedBy
            } = req.body;
    
            if(!employeeId || !certificationName || !certificationId || !issuedBy || !employeeName){
                res.status(400).json({msg:"missing some details"})
            }
            
            const newCertification = new Certifications({
                employeeId,
                employeeName,
                certificationName,
                certificationId,
                issuedBy
            })
            const savedCertification = await newCertification.save()
            res.status(201).json(savedCertification);
        }
}
catch(err){
    res.status(500).json({error: err.message })
}

  }

const getAllCertificationByempId = async(req, res) =>{
    const access = JSON.parse(req.cookies.access);
    try{

        if (
            !access ||
            (!access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write") &&
              !access.includes("Reports_View_And_Write"))
          ) {
            res.status(401).json({ error: "Unauthorised request" });
          }else{
            const {empId} = req.params;
            console.log(empId);
            const certifications = await Certifications.find({ employeeId: empId });
    
            // Send the certifications as a response
            res.json(certifications);
          }
       

    }
    catch(err){
        res.status(500).json({error: err.message })
    }
}

module.exports = {
    createCertification,
    getAllCertifications,
    getAllCertificationByempId,
    getEmpNameByEmpId
};