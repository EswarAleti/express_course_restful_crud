const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const validateAuth = (roles) =>
    function (req, res, next) {
        try {
            console.log("validating authentication");

            const decoded = jwt.verify(
                req.headers.authorization,
                process.env.JWT_PRIVATE_KEY
            );

            if (!roles.includes(decoded.role)) {
                throw new Error("Invalid role");
            }

            console.log("authentication successful");
            next();
        } catch (err) {
            res.status(401).json({
                message: "unauthenticated",
                reason: err.message,
            });
        }
    };

module.exports.validateAuth = validateAuth;
