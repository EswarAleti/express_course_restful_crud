const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const UserService = {
    save: async ({ name, username, password, role }) => {
        if (await UserModel.findOne({ username })) {
            throw new Error("Username already existed!");
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userModel = new UserModel({
            name,
            username,
            password: hashedPassword,
            role,
        });
        return await userModel.save();
    },
};

module.exports.UserService = UserService;
