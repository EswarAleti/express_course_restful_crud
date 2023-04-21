const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    courseID: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
    },
});

const CourseModel = mongoose.model("course", courseSchema);

module.exports.CourseModel = CourseModel;
