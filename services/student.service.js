const { StudentModel } = require("../models/student.model");

const StudentService = {
    save: async ({ name, userID }) => {
        console.log("student is being created");
        const studentModel = new StudentModel({
            name,
            userID,
        });
        await studentModel.save();
        console.log("student is saved to database");
    },
};

module.exports.StudentService = StudentService;
