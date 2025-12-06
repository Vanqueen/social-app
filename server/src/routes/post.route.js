
const router = require("express").Router();
 
const { createPost, updatePost, deletePost, getPost, getPosts,
    getFollowingPosts,
    likeDislikePost, createBookmark} = require("../controllers/post.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
 
 
 
router.get("/", authMiddleware, getPosts);
router.post("/create",  authMiddleware, createPost);
router.get("/following", authMiddleware, getFollowingPosts);
router.get("/:id", authMiddleware, getPost);
router.patch("/:id/edit", authMiddleware, updatePost);
router.delete("/:id/delete", authMiddleware, deletePost);
router.get("/:id/like", authMiddleware, likeDislikePost);
router.get("/:id/bookmark", authMiddleware, createBookmark);
 
 
module.exports = router;
