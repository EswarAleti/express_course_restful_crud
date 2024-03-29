const express = require("express");
const router = express.Router();
const { CourseModel } = require("../models/course.model");
const { validateAuth } = require("../middlewares/auth.middleware");

router.post("/", [validateAuth(["admin"])], async (req, res) => {
    try {
        console.log("request received to insert a new course");
        if (await CourseModel.findOne({ courseID: req.body.courseID })) {
            throw new Error(
                "Course already exists with the courseID " + req.body.courseID
            );
        }
        const courseModel = new CourseModel(req.body);
        const course = await courseModel.save();

        console.log("successfully inserted a new course");
        res.status(200).send(course);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/", [validateAuth(["admin", "user"])], async (req, res) => {
    try {
        console.log("request received to get all courses");
        const { name } = req.query;
        const query = { name };
        const finalQuery = Object.keys(query).reduce((prev, key) => {
            if (query[key]) {
                return {
                    ...prev,
                    [key]: query[key],
                };
            }
            return prev;
        }, {});

        const courses = await CourseModel.find(finalQuery);
        console.log("successfully received all courses");
        res.status(200).json(courses);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/:id", [validateAuth(["admin", "user"])], async (req, res) => {
    try {
        console.log("request received to get a course");
        const course = await CourseModel.findById(req.params.id);
        if (!course) {
            return res
                .status(400)
                .json(`Course with id ${req.params.id} is not existed!`);
        }
        console.log("successfully found a course with id: " + req.params.id);
        res.status(200).json(course);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.delete("/:id", [validateAuth(["admin"])], async (req, res) => {
    try {
        console.log("request received to delete a course");
        const courses = await CourseModel.deleteOne({ _id: req.params.id });
        if (courses.deletedCount == 0) {
            return res
                .status(400)
                .json(`Course with id ${req.params.id} is not existed!`);
        }
        console.log(`successfully deleted a course with id ${req.params.id}`);
        res.status(200).json(courses);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.put("/:id", [validateAuth(["admin"])], async (req, res) => {
    try {
        console.log("request received to update a course");
        const course = await CourseModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
        });
        console.log(course);
        if (!course) {
            return res
                .status(400)
                .json(`Course with id ${req.params.id} is not existed!`);
        }
        res.status(200).json(course);
        console.log("successfully updated a course");
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports.courseRouter = router;
