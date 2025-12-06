
const router = require("express").Router();
const { createMessage, getMessages, getConversations } = require("../controllers/message.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
 
router.get("/conversations", authMiddleware, getConversations);
router.post("/:receiverId/create", authMiddleware, createMessage);
router.get("/:receiverId/sms", authMiddleware, getMessages);
 
module.exports = router;
