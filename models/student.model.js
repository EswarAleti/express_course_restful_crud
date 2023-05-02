const { default: mongoose } = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userID: { type: String, required: true },
});

const StudentModel = new mongoose.model("student", studentSchema);

module.exports.StudentModel = StudentModel;
