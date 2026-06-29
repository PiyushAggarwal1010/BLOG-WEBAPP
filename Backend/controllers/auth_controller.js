const userModel = require("../models/user_model");
const config = require('../config/config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const email = req.body.email.toLowerCase();
        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (isAlreadyRegistered) {
            const error = new Error("Username or Email already exists");
            error.statusCode = 409;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'user created succesfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { password } = req.body;
        const email = req.body.email.toLowerCase();
        const user = await userModel.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            return next(error);
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({
            message: "fetched succesfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        next(error);
    }
}

const logout = (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe, logout };