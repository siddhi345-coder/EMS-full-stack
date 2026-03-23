const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

// GET roles is public (used on signup and employee form).
// further operations are protected
router.get("/", roleController.getAllRoles);

// the rest require authentication + HR role
router.use(protect);
router.get("/:id", authorize("HR"), roleController.getRoleById);
router.post("/", authorize("HR"), roleController.createRole);
router.put("/:id", authorize("HR"), roleController.updateRole);
router.delete("/:id", authorize("HR"), roleController.deleteRole);

module.exports = router;
