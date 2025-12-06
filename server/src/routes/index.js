const router = require("express").Router();

const userRoutes = require("./user.routes");
const postRoutes = require("./post.route");
const messageRoutes = require("./message.route");
const commentRoutes = require("./comment.route");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/messages", messageRoutes);
router.use("/comments", commentRoutes);


module.exports = router;
