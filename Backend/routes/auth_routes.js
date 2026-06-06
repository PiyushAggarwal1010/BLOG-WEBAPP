const express=require('express');
const router=express.Router();
const authMiddleware = require("../middleware/auth_middleware");
const validateMiddleware=require("../middleware/validate_middleware")
const authController=require('../controllers/auth_controller');
const validateSchema=require("../validators/auth_validator")

router.post('/register',validateMiddleware(validateSchema.signupSchema), authController.register);
router.post('/login',validateMiddleware(validateSchema.loginSchema),authController.login);
router.get('/getMe',authMiddleware,authController.getMe);

module.exports=router;