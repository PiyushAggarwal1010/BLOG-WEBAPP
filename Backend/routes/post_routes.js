const express=require('express');
const router=express.Router();
const postController=require('../controllers/post_controller');
const authMiddleware = require("../middleware/auth_middleware");
const validateMiddleware=require("../middleware/validate_middleware")
const upload = require("../middleware/upload_middleware");
const validateSchema=require("../validators/post_validators")

router.post('/',authMiddleware,upload.single("image"),validateMiddleware(validateSchema.postSchema),postController.createPost);
router.get('/',postController.getAllPosts);
router.get('/my-posts',authMiddleware, postController.getMyPosts);
router.delete('/:id',authMiddleware,postController.deleteMyPost);
router.patch('/:id',authMiddleware,validateMiddleware(validateSchema.postSchema),postController.updateMyPost);
router.get('/:id',authMiddleware, postController.getSinglePost);
router.post('/:id/like', authMiddleware,postController.handleLikes);
router.get('/user/stats',authMiddleware, postController.getUserStats);

module.exports=router;