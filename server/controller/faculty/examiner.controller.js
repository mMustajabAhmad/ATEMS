const { sequelize } = require("../../config/sequelize");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { midevaluations } = require("../../model/midEvaluation.model");
const { finalevaluations } = require("../../model/finalEvaluation.model")
const { proposalevaluations } = require("../../model/proposalEvaluaton.model")
const { students } = require("../../model/student.model");
const { Op } = require('sequelize');


const supViewExaminableThesis = async (req, res) => {
    try {
        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.or]: [
                        { [Op.contains]: ["Supervisor"] },
                        { [Op.contains]: ["Internal"] }
                    ]
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const examinableThesis = await thesis.findAll({
            where: {
                [Op.or]: [
                    { facultyid: facultyId }, // If the faculty is the supervisor
                    // { internalsid: { [Op.contains]: [facultyId] } } // If the faculty is one of the internals
                ]
            }
        });

        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const proposalEvaluation = await proposalevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    midEvaluationPermission: true
                }
            });
            if (proposalEvaluation) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Fetch midEvaluationPermission
        const midEvaluation = await proposalevaluations.findOne({
            attributes: ['midEvaluationPermission'],
            limit: 1 // Limit to one result as we only need one value
        });

        // Check if midEvaluationPermission is true (indicating it's not closed yet)
        if (!midEvaluation || midEvaluation.midEvaluationPermission !== true) {
            return res.json({ message: 'Mid evaluations are not open yet.' });
        }

        // Respond with the filtered list of examinable thesis papers
        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinabl theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const internalViewExaminableThesis = async (req, res) => {
    try {
        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.or]: [
                        { [Op.contains]: ["Supervisor"] },
                        { [Op.contains]: ["Internal"] }
                    ]
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const examinableThesis = await thesis.findAll({
            where: {
                [Op.or]: [
                    //{ facultyid: facultyId }, // If the faculty is the supervisor
                    { internalsid: { [Op.contains]: [facultyId] } } // If the faculty is one of the internals
                ]
            }
        });

        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const proposalEvaluation = await proposalevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    midEvaluationPermission: true
                }
            });
            if (proposalEvaluation) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        const midEvaluation = await proposalevaluations.findOne({
            attributes: ['midEvaluationPermission'],
            limit: 1 // Limit to one result as we only need one value
        });

        // Check if midEvaluationPermission is true (indicating it's not closed yet)
        if (!midEvaluation || midEvaluation.midEvaluationPermission !== true) {
            return res.json({ message: 'Mid evaluations are not open yet.' });
        }

        // Respond with the filtered list of examinable thesis papers
        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinabl theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getExaminableThesisDetails = async (req, res) => {
    try {
        const thesisId = req.params.thesisId;
        const facultyId = req.userId;
        console.log('thesisId:', thesisId);
        const faculty = await thesis.findOne({
            where: {
                thesisid: thesisId,
                [Op.or]: [
                    { facultyid: facultyId },
                    { internalsid: { [Op.contains]: [facultyId] } }
                ]
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        // Find the thesis with the given ID
        const thesisDetails = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
            attributes: ['thesisid', 'thesistitle', 'rollno', 'facultyid', 'supervisorname', 'researcharea', 'potentialareas', 'proposalfilename'],
        });

        if (!thesisDetails) {
            return res.json({ message: 'Thesis not found' });
        }

        // Find the student associated with the thesis
        const studentDetails = await students.findOne({
            where: {
                rollno: thesisDetails.rollno
            },
            attributes: ['rollno', 'name', 'email', 'gender', 'batch', 'semester', 'program', 'credithours', 'cgpa', 'mobile', 'thesisstatus', 'comingevaluation', 'reevaluationstatus'],
        });

        if (!studentDetails) {
            return res.json({ message: 'Student not found' });
        }

        const midEvaluationPermission = await proposalevaluations.findOne({
            where: {
                rollno: studentDetails.rollno,
                midEvaluationPermission: true
            }
        });

        if (!midEvaluationPermission) {
            return res.json({ message: 'Mid evaluation permission not granted' });
        }

        // Check if the comingevaluation is set to Mid1
        if (studentDetails.comingevaluation != 'Mid1') {
            return res.json({ message: 'Thesis evaluation is not set for Mid1' });
        }

        return res.json({
            thesisDetails,
            studentDetails
        });

    } catch (error) {
        console.error('Error fetching thesis and student details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const evaluateMid = async (req, res) => {
    try {
        // Extract evaluation details from the request
        const {
            rollno,
            stdname,
            batch,
            semester,
            thesistitle,
            facultyid,
            facname,
            literatureReviewRank,
            paper1,
            paper2,
            problemGapIdentified,
            problemClearlyDefined,
            problemPlacement,
            solutionUnderstanding,
            comments,
        } = req.body;

        const studentDetails = await students.findOne({
            where: {
                rollno
            },
            attributes: ['rollno', 'name', 'email', 'gender', 'batch', 'semester', 'program', 'credithours', 'cgpa', 'thesisstatus', 'comingevaluation'],
        });

        const midEvaluationPermission = await proposalevaluations.findOne({
            where: {
                rollno: studentDetails.rollno,
                midEvaluationPermission: true
            }
        });

        if (!midEvaluationPermission) {
            return res.json({ message: 'Mid evaluation permission not granted' });
        }

        if (!studentDetails && studentDetails.comingevaluation != "Mid1") {
            return res.json({ message: 'Student not found' });
        }

        const existingMidEvaluation = await midevaluations.findOne({ where: { facultyid, rollno } });
        if (existingMidEvaluation) {
            res.json({ message: 'You have already evaluated this thesis proposal' });
            return;
        }

        // Create a new proposal evaluation record
        const newEvaluation = await midevaluations.create({
            rollno,
            stdname,
            batch,
            semester,
            thesistitle,
            facultyid,
            facname,
            literatureReviewRank,
            paper1,
            paper2,
            problemGapIdentified,
            problemClearlyDefined,
            problemPlacement,
            solutionUnderstanding,
            comments,
            finalEvaluationPermission: false,
            gcMidCommentsReview: 'Pending',
        });


        res.json({ message: 'Mid evaluation and feedback stored successfully', evaluation: newEvaluation });

    } catch (error) {
        console.error('Error evaluating mid:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* Thesis - I , Final Evaluations */

const supViewFinalExaminableThesis = async (req, res) => {
    try {
        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.or]: [
                        { [Op.contains]: ["Supervisor"] },
                        { [Op.contains]: ["Internal"] }
                    ]
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const examinableThesis = await thesis.findAll({
            where: {
                [Op.or]: [
                    { facultyid: facultyId }, // If the faculty is the supervisor
                    // { internalsid: { [Op.contains]: [facultyId] } } // If the faculty is one of the internals
                ]
            }
        });

        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const midEvaluation = await midevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    finalEvaluationPermission: true
                }
            });
            if (midEvaluation) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        const finalEvaluation = await midevaluations.findOne({
            attributes: ['finalEvaluationPermission'],
            limit: 1 // Limit to one result as we only need one value
        });

        // Check if midEvaluationPermission is true (indicating it's not closed yet)
        if (!finalEvaluation || finalEvaluation.finalEvaluationPermission !== true) {
            return res.json({ message: 'Final evaluations are not open yet.' });
        }

        // Respond with the filtered list of examinable thesis papers
        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinable theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const internalViewFinalExaminableThesis = async (req, res) => {
    try {
        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.or]: [
                        { [Op.contains]: ["Supervisor"] },
                        { [Op.contains]: ["Internal"] }
                    ]
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const examinableThesis = await thesis.findAll({
            where: {
                [Op.or]: [
                    //{ facultyid: facultyId }, // If the faculty is the supervisor
                    { internalsid: { [Op.contains]: [facultyId] } } // If the faculty is one of the internals
                ]
            }
        });

        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const midEvaluation = await midevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    finalEvaluationPermission: true
                }
            });
            if (midEvaluation) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        const finalEvaluation = await midevaluations.findOne({
            attributes: ['finalEvaluationPermission'],
            limit: 1 // Limit to one result as we only need one value
        });

        // Check if midEvaluationPermission is true (indicating it's not closed yet)
        if (!finalEvaluation || finalEvaluation.finalEvaluationPermission !== true) {
            return res.json({ message: 'Final evaluations are not open yet.' });
        }

        // Respond with the filtered list of examinable thesis papers
        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinable theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getFinalExaminableThesisDetails = async (req, res) => {
    try {
        const thesisId = req.params.thesisId;
        const facultyId = req.userId;
        console.log('thesisId:', thesisId);
        const faculty = await thesis.findOne({
            where: {
                thesisid: thesisId,
                [Op.or]: [
                    { facultyid: facultyId },
                    { internalsid: { [Op.contains]: [facultyId] } }
                ]
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        // Find the thesis with the given ID
        const thesisDetails = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
            attributes: ['thesisid', 'thesistitle', 'rollno', 'researcharea', 'potentialareas', 'proposalfilename'],
        });

        if (!thesisDetails) {
            return res.json({ message: 'Thesis not found' });
        }

        // Find the student associated with the thesis
        const studentDetails = await students.findOne({
            where: {
                rollno: thesisDetails.rollno
            },
            attributes: ['rollno', 'name', 'email', 'gender', 'batch', 'semester', 'program', 'credithours', 'cgpa', 'mobile', 'thesisstatus', 'comingevaluation', 'reevaluationstatus'],
        });

        if (!studentDetails) {
            return res.json({ message: 'Student not found' });
        }

        const finalEvaluationPermission = await midevaluations.findOne({
            where: {
                rollno: studentDetails.rollno,
                finalEvaluationPermission: true
            }
        });

        if (!finalEvaluationPermission) {
            return res.json({ message: 'Final evaluation permission not granted' });
        }

        // Check if the comingevaluation is set to Final1
        if (studentDetails.comingevaluation != 'Final1') {
            return res.json({ message: 'Thesis evaluation is not set for Final1' });
        }

        return res.json({
            thesisDetails,
            studentDetails
        });

    } catch (error) {
        console.error('Error fetching thesis and student details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const evaluateFinal = async (req, res) => {
    try {
        // Extract evaluation details from the request
        const {
            rollno,
            stdname,
            batch,
            semester,
            thesistitle,
            facultyid,
            facname,
            literaturereviewrank,
            paper1,
            paper2,
            comparativeanalysisthorough,
            researchgapclearlyidentified,
            researchproblemclearlydefined,
            problemcontextinliterature,
            understandingofsolution,
            proposedworkevaluation,
            reportquality,
            reportorganizationacceptable,
            communicationskills,
            questionshandling,
            comments,
        } = req.body;

        console.log('literaturereviewrank:::', literaturereviewrank);
        const studentDetails = await students.findOne({
            where: {
                rollno
            },
            attributes: ['rollno', 'name', 'email', 'gender', 'batch', 'semester', 'program', 'credithours', 'cgpa', 'thesisstatus', 'comingevaluation'],
        });

        const finalEvaluationPermission = await midevaluations.findOne({
            where: {
                rollno: studentDetails.rollno,
                finalEvaluationPermission: true
            }
        });

        if (!finalEvaluationPermission) {
            return res.json({ message: 'Final evaluation permission not granted' });
        }

        if (!studentDetails && studentDetails.comingevaluation != "Final1") {
            return res.json({ message: 'Student not found' });
        }

        const existingFinalEvaluation = await finalevaluations.findOne({ where: { facultyid, rollno } });
        if (existingFinalEvaluation) {
            res.json({ message: 'You have already evaluated this thesis proposal' });
            return;
        }

        // Create a new proposal evaluation record
        const newEvaluation = await finalevaluations.create({
            rollno,
            stdname,
            batch,
            semester,
            thesistitle,
            facultyid,
            facname,
            literaturereviewrank,
            paper1,
            paper2,
            comparativeanalysisthorough,
            researchgapclearlyidentified,
            researchproblemclearlydefined,
            problemcontextinliterature,
            understandingofsolution,
            proposedworkevaluation,
            reportquality,
            reportorganizationacceptable,
            communicationskills,
            questionshandling,
            comments,
            gcfinalcommentsreview: 'Pending',
        });


        res.json({ message: 'Final evaluation and feedback stored successfully', evaluation: newEvaluation });

    } catch (error) {
        console.error('Error evaluating final:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports =
{
    supViewExaminableThesis,
    internalViewExaminableThesis,
    getExaminableThesisDetails,
    evaluateMid,
    supViewFinalExaminableThesis,
    internalViewFinalExaminableThesis,
    getFinalExaminableThesisDetails,
    evaluateFinal
};