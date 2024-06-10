const mongoose = require("mongoose");

const certificationsSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
        },
        employeeName:{
            type: String,
            required: true
        },
        certificationName: {
            type: String,
            required: true,
        },
        certificationId: {
            type: String,
            required: true,
        },
        issuedBy: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


const Certifications = 
        mongoose.models.Certifications ||
        mongoose.model("Certifications", certificationsSchema);
module.exports = Certifications;
