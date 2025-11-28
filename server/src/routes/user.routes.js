const router = require("express").Router();

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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/renewAccessToken", renewAccessToken);
router.get("/:id", getUser);
router.get("/all", getUsers);
router.patch("/:id/edit", editUser);
router.patch("/:id/follow-unfollow", followUnfollowUser);
router.post("/avatar", changeUserAvatar);

module.exports = router;
