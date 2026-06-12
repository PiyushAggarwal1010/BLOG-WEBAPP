const express=require('express');
const router=express.Router();
const commentController=require('../controllers/comment_controller');
const authMiddleware = require("../middleware/auth_middleware");


router.post('/:id/comment',authMiddleware,commentController.AddComment);
router.get('/:id/comment',authMiddleware,commentController.getAllComments);

module.exports=router;