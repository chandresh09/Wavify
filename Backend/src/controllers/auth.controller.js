const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
    const { username, email, password, role="user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    });

    if(isUserAlreadyExists){
        return res.status(409).json({message: "User Already Exists."});
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    });

    const token = jwt.sign({ id: user._id, role: user.role },process.env.JWT_PRIVATE_KEY);

    res.cookie("token", token);
    res.status(201).json({
        message: "User Registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function loginUser(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    });

    if(!user){
        return res.status(401).json({
            message: "Invalid Credentials"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid Credentials"
        });
    }

    const token = jwt.sign({ id: user._id, role: user.role },process.env.JWT_PRIVATE_KEY, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" });

    res.status(201).json({
        message: "User Logged in Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });

}

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({message: "User Logged Out Successfully"});
}

module.exports = { registerUser, loginUser, logoutUser };