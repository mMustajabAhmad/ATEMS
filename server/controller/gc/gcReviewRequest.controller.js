const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { Op, Model } = require('sequelize');


// fetch all thesis for the logged in gc
const getThesis = async (req, res) => {
    try {
        const allThesis = await thesis.findAll({
            where: {
                gcapproval: 'Pending' // only pending thesis will be fetched
            }, 
            attributes: ['thesisid', 'rollno', 'facultyid' , 'thesistitle', 'potentialareas'],
        });

        res.json({ allThesis });

    } catch (error) {
        console.error('Error fetching thesis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const viewAllThesis = async (req, res) => {
    try {
        const viewallThesis = await thesis.findAll({
            attributes: ['thesisid', 'thesistitle', 'potentialareas', 'gcApproval', 'hodapproval'],
        });

        res.json({ viewallThesis });

    } catch (error) {
        console.error('Error fetching thesis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Function to get details of a single thesis
const getThesisDetails = async (req, res) => {
    try {
        // gc will choose an id for review
        const { thesisId } = req.params;


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'thesis not found' });
        }


        const fileURL = `/uploads/${selectedThesis.proposalfilename}`; // Construct the file URL
        selectedThesis.dataValues.fileURL = fileURL; // Add the file URL to the slectedThesis object


        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name', 'role'],
            where: {
                role: { [Op.contains]: ['Internal'] }
            }
        });



        res.json({ selectedThesis, facultyList });

    } catch (error) {
        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to approve the fetched Thesis from above function
const approveThesis = async (req, res) => {
    try {
        // gc will choose an id for review
        const { thesisId } = req.params;
        const { final_internal1, final_internal2 } = req.body; // if GC wants to change internals, he/she can.


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'thesis not found' });
        }

        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name'],
        });

        const supervisorid = selectedThesis.facultyid;
        // fetch facultyID for selected internals by the GC
        const final_internal1id = facultyList.find(faculty => faculty.name === final_internal1)?.facultyid;
        const final_internal2id = facultyList.find(faculty => faculty.name === final_internal2)?.facultyid;

        if (!final_internal1id || !final_internal2id) {
            return res.status(400).json({ error: 'Invalid internal faculty names' });
        }

        // Validating that supervisor and internal members are not the same
        if (supervisorid === final_internal1id || supervisorid === final_internal2id || final_internal1id === final_internal2id) {
            return res.status(400).json({ error: 'Supervisor and Internals must be different for a thesis' });
        }

        // New check to ensure supervisor is not selected as an internal
        if (supervisorid === final_internal1id || supervisorid === final_internal2id) {
            return res.status(400).json({ error: 'Supervisor cannot be selected as an internal for the same thesis' });
        }

        const [rowsAffected, [updatedThesis]] = await thesis.update( // Update the thesis internals
            {
                gcapproval: 'Approved',
                internals: [final_internal1, final_internal2],
                internalsid: [final_internal1id, final_internal2id]
            },
            {
                where: {
                    thesisid: thesisId
                },
                returning: true,
            }
        );

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'Thesis not found' });
        }

        res.json({ updatedThesis });



    } catch (error) {
        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getThesis, getThesisDetails, approveThesis, viewAllThesis };
