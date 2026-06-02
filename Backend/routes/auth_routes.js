const express=require('express');
const router=express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const authController=require('../controllers/auth_controller');

router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/getMe',authMiddleware,authController.getMe);

module.exports=router;