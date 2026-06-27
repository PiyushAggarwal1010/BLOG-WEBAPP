const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const {isAdmin} = require("../middleware/role_middleware");
const adminController = require("../controllers/admin_controller");

router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);

module.exports = router;