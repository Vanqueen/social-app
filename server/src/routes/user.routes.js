const router = require("express").Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const {
    registerUser,
    loginUser,
    logoutUser,
    renewAccessToken,
    getUser,
    getUsers,
    editUser,
    followUnfollowUser,
    changeUserAvatar
} = require("../controllers/user.controller");
const { getUserPosts } = require("../controllers/post.controller");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/renewAcessToken", renewAccessToken);
router.get("/all", getUsers);
router.get("/:id", getUser);
router.patch("/:id/edit", authMiddleware, editUser);
router.patch("/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.post("/avatar", authMiddleware, changeUserAvatar);
router.get("/:id/posts", authMiddleware, getUserPosts );

module.exports = router;
