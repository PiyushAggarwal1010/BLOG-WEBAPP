const express=require('express');
const router=express.Router();
const commentController=require('../controllers/comment_controller');
const authMiddleware = require("../middleware/auth_middleware");


router.post('/posts/:id/comment',authMiddleware,commentController.AddComment);
router.get('/posts/:id/comment',authMiddleware,commentController.getAllComments);
router.delete('/comment/:id',authMiddleware,commentController.deleteComment);

module.exports=router;