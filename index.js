const express = require("express");
const { courseRouter } = require("./routers/course.router");
const mongoose = require("mongoose");
const { userRouter } = require("./routers/user.router");
require("dotenv").config();

const app = express();

app.use(express.json());

const url = process.env.DB_URL;

mongoose
    .connect(url)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use("/api/courses", courseRouter);
app.use("/api/account", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
});
