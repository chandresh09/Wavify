const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Forbidden! You don't have access to perform this action." });
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.error("JWT Token Decoding Error: ", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

async function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({ message: "Forbidden! You don't have access to perform this action." });
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.error("JWT Token Decoding Error: ", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authArtist, authUser }