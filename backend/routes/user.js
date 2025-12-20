const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate, requireAdmin } = require("../middlewares/auth");

// Admin routes
router.get("/", authenticate, requireAdmin, getUsers);
router.get("/:id", authenticate, requireAdmin, getUser);
router.post("/", authenticate, requireAdmin, createUser);
router.put("/:id", authenticate, requireAdmin, updateUser);
router.delete("/:id", authenticate, requireAdmin, deleteUser);

module.exports = router;
