const { sequelize, DataTypes } = require("../config/sequelize");

const faculties = sequelize.define("faculties", {
  facultyid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.CHAR,
    allowNull: false,
    validate: {
      isIn: [['M', 'F']]
    }
  },
  role: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
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
  console.log('Faculty table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = { faculties };