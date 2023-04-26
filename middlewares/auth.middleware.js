const jwt = require("jsonwebtoken");
const privateKey = "aBcD@123";
const validateAuth = function (req, res, next) {
    try {
        console.log("Validating authentication");
        const decoded = jwt.verify(req.headers.authorization, privateKey);
        next();
    } catch (err) {
        res.status(401).json({ message: "unauthenticated" });
    }
};

module.exports.validateAuth = validateAuth;
