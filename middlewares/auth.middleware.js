const jwt = require("jsonwebtoken");
const validateAuth = function (req, res, next) {
    try {
        console.log("Validating authentication");
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_PRIVATE_KEY
        );
        next();
    } catch (err) {
        res.status(401).json({ message: "unauthenticated" });
    }
};

module.exports.validateAuth = validateAuth;
