const express=require('express');
const router=express.Router();
const postController=require('../controllers/post_controller');
const authMiddleware = require("../middleware/auth_middleware");
const upload = require("../middleware/upload_middleware");

router.post('/',authMiddleware,upload.single("image"),postController.createPost);
router.get('/',postController.getAllPosts);
router.get('/my-posts',authMiddleware, postController.getMyPosts);
router.delete('/:id',authMiddleware,postController.deleteMyPost);
router.patch('/:id',authMiddleware,postController.updateMyPost);
router.get('/:id',authMiddleware, postController.getSinglePost);
router.post('/:id/like', authMiddleware,postController.handleLikes);

module.exports=router;