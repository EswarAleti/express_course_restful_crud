const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    // Finding
    const course = courses.find(
        (course) => course.id === parseInt(req.params.id)
    );

    if (!course) {
        return res
            .status(404)
            .send(`Course not found with id ${req.params.id}`);
    }

    res.send(course);
});

app.post("/api/courses", (req, res) => {
    // Validation
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/course/:id", (req, res) => {
    // Finding
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) {
        return res
            .status(404)
            .send("The course you requested is not available");
    }

    // Validation
    const { error } = validateCourse(req.body);
    console.log(error);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    // Update
    course.name = req.body.name;
    res.send(course);
});

app.delete("/api/course/:id", (req, res) => {
    // Finding
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("The course you requested is not available");
        return;
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(course);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
});