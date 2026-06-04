const express=require('express');
const router=express.Router();
const postController=require('../controllers/post_controller');
const authMiddleware = require("../middleware/auth_middleware");

router.post('/',authMiddleware,postController.createPost);
router.get('/',postController.getAllPosts);
router.get('/my-posts',authMiddleware, postController.getMyPosts);
router.delete('/:id',authMiddleware,postController.deleteMyPost);
router.patch('/:id',authMiddleware,postController.updateMyPost);
router.get('/:id',postController.getSinglePost);

module.exports=router;