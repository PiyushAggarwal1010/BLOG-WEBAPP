const express=require('express');
const router=express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const { generateSummary } = require("../controllers/ai_controller");

router.post("/summary", authMiddleware, generateSummary);

module.exports = router;