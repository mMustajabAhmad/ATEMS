const { sequelize, DataTypes } = require("../config/sequelize");


const proposalevaluations = sequelize.define('proposalevaluations', {
    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    batch: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    facname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    midEvaluationPermission: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    significance: {
        type: DataTypes.ENUM('Satisfactory', 'Unsatisfactory', 'Not Approved'),
        allowNull: false
    },
    understanding: {
        type: DataTypes.ENUM('Satisfactory', 'Unsatisfactory', 'Not Approved'),
        allowNull: false
    },
    statement: {
        type: DataTypes.ENUM('Satisfactory', 'Unsatisfactory', 'Not Approved'),
        allowNull: false
    },
    rationale: {
        type: DataTypes.ENUM('Satisfactory', 'Unsatisfactory', 'Not Approved'),
        allowNull: false
    },
    timeline: {
        type: DataTypes.ENUM('Satisfactory', 'Unsatisfactory', 'Not Approved'),
        allowNull: false
    },
    bibliography: {
        type: DataTypes.ENUM('Satisfactory', 'Unsatisfactory', 'Not Approved'),
        allowNull: false
    },
    comments: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    gcProposalCommentsReview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Approved', 'Rejected']]
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

sequelize.sync().then(() => {
    console.log('Proposal Evaluation table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Proposal Evaluation model
module.exports = { proposalevaluations };