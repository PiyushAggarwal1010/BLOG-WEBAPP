const userModel = require("../models/user_model");
const mongoose = require('mongoose');

const getAllUsers = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit) || 4;
        const cursor = req.query.cursor;

        let query = {};

        if (cursor) {
            if (!mongoose.isValidObjectId(cursor)) {
                const error = new Error("Invalid cursor format");
                error.statusCode = 400;
                return next(error);
            }
            query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
        }

        const users = await userModel.find(query)
            .select('-password')
            .sort({ _id: -1 })
            .limit(limit + 1) //+1 for checking next page
            .lean();

        const totalUsers = await userModel.countDocuments();

        const hasNextPage = users.length > limit;
        if (hasNextPage) {
            users.pop();
        }

        res.status(200).json({
            users,
            nextCursor: hasNextPage ? users[users.length - 1]._id : null,
            totalUsers
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { getAllUsers };