const userModel = require("../models/user_model");
const config = require('../config/config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "username or email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: '2d'
        })

        res.status(201).json({
            message: 'user created succesfully',
            email: user.email
            , token
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "invalid password"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "2d" }
        );
        res.status(200).json({
            message: "login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}

const getMe = async (req, res) => {
    try { 
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "fetched succesfully",
            user: {
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = { register, login, getMe };