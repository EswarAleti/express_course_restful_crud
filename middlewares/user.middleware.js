const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

const validateUser = (req, res, next) => {
    const { error } = joi
        .object({
            name: joi.string().required(),
            username: joi.string().min(5).max(200).required(),
            password: joiPassword
                .string()
                .min(8)
                .minOfSpecialCharacters(1)
                .minOfLowercase(1)
                .minOfUppercase(1)
                .minOfNumeric(1)
                .noWhiteSpaces()
                .required(),
            role: joi.string().required(),
        })
        .validate(req.body);
    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    next();
};

module.exports.validateUser = validateUser;
