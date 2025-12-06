const router = require("express").Router();
const {createComment, getPostComments, deleteComment} = require("../controllers/comment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
 
 
router.post("/:postId", authMiddleware, createComment);
router.get("/:postId/post-comment", authMiddleware, getPostComments);
router.delete("/:commentId/delete", authMiddleware, deleteComment);
 
module.exports = router;
