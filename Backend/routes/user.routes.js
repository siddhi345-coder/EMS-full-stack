const router = require("express").Router();
const { signup, login, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const controller = require("../controllers/user.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/", protect, authorize("admin"), controller.getAllUsers);

module.exports = router;
