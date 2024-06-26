const { sequelize } = require("../../config/sequelize");
const { sendMail } = require("../../config/mailer");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { synopsis } = require("../../model/synopsis.model");
const { Op, Model } = require('sequelize');
const multer = require('multer');
const upload = require('../../middleware/multer');
const { registrations } = require("../../model/thesistwo/registration.model");



// Theis - 2 --------------

const thesisTwoRegistration = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have a way to retrieve the user ID
        const student = await students.findOne({ where: { rollno: userId } });

        if (!student) {
            return res.json({ message: 'User not found or not authorized' });
        }

        // Check if the student is eligible for Thesis-2 registration
        if (student.comingevaluation !== 'Mid2' || student.thesisstatus !== 2) {
            return res.json({ message: 'You are not eligible for Thesis-2 registration' });
        }

        const {
            stdname,
            rollno,
            thesistitle,
            facultyid,
            supervisorname,
            internals,
            internalsid,
            tasktitles,
            objectives,
            completiondates } = req.body;


        const existingRegistration = await registrations.findOne({ where: { rollno } });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Request already exists for this roll number' });
        }


        const newRegistration = await registrations.create({
            stdname,
            rollno,
            thesistitle,
            facultyid,
            supervisorname,
            internals,
            internalsid,
            tasktitles,
            objectives,
            completiondates,
            supervisorapproval: 'Pending',
            gcapproval: 'Pending',
            hodapproval: 'Pending',
            gcmidevalpermission: false
        });



        res.json({ message: 'Registration created successfully', registration: newRegistration });



    } catch (error) {

        console.error('Error registering for thesis two:', error);
        res.status(500).json({ message: 'An error occurred while registering for thesis two' });

    }
    
}



module.exports =
{
    // fillSynopsis,
    // sendFaculties,
    thesisTwoRegistration
};
