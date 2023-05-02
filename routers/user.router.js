const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { validateUser } = require("../middlewares/user.middleware");
const { validateAuth } = require("../middlewares/auth.middleware");
const { StudentService } = require("../services/student.service");
const { UserService } = require("../services/user.service");
const { UserModel } = require("../models/user.model");

router.post("/register", [validateUser], async (req, res) => {
    try {
        console.log("request received to register a new user");
        const { name, username, password, role } = req.body;
        const user = await UserService.save({ name, username, password, role });
        if (role.toLowerCase() === "student") {
            await StudentService.save({ name, userID: user._id });
        }
        console.log("successfully registered a new user");
        res.json({ message: "successfully registered" });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("request received for login");

        const { username, password } = req.body;
        const account = await UserModel.findOne({
            username: username,
        });

        if (!account) {
            throw new Error("Invalid username or password!");
        }
        const isSame = await bcrypt.compare(password, account.password);
        if (!isSame) {
            throw new Error("Invalid username or password!");
        }

        const privateKey = process.env.JWT_PRIVATE_KEY;
        const token = jwt.sign(
            { username: account.username, role: account.role },
            privateKey,
            {
                expiresIn: 60 * 60,
            }
        );

        res.status(200).json({ token });

        console.log("login is successful");
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

router.delete("/:id", [validateAuth], async (req, res) => {
    try {
        console.log("request received to delete an user account");
        const account = await UserModel.deleteOne({ _id: req.params.id });
        console.log(account);
        if (account.deletedCount === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log("successfully deleted user account");
        res.status(200).json({ message: "user account deleted successfully" });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

module.exports.userRouter = router;
