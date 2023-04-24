const express = require("express");
const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);
const { UserModel } = require("../models/user.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateUser } = require("../middlewares/user.middleware");
const saltRounds = 10;

router.post("/register", [validateUser], async (req, res) => {
    try {
        console.log("request received to register a new user");
        if (await UserModel.findOne({ username: req.body.username })) {
            throw new Error("Username already existed!");
        }
        const { name, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userModel = new UserModel({
            name,
            username,
            password: hashedPassword,
        });
        await userModel.save();
        console.log("successfully registered a new user");
        res.json({ message: "successfully registered" });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("request received for login");

        const { name, username, password } = req.body;
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

        res.status(200).json({ isLoggedIn: true });

        console.log("login is successful");
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

module.exports.userRouter = router;
