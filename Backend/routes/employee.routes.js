const router = require("express").Router();
const controller = require("../controllers/employee.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

router.use(protect);

// Employee self-service routes (must be before /:id)
router.get("/me", authorize("Employee", "Manager", "HR", "Admin"), controller.getMe);
router.patch("/me", authorize("Employee", "Manager", "HR", "Admin"), controller.updateMe);
router.patch("/me/password", authorize("Employee", "Manager", "HR", "Admin"), controller.updatePassword);
router.get("/me/logs", authorize("Employee", "Manager", "HR", "Admin"), controller.getMyLogs);
router.get("/me/notifications", authorize("Employee", "Manager", "HR", "Admin"), controller.getMyNotifications);

router.post("/", authorize("HR"), controller.create);
router.get("/managers", authorize("HR", "Manager"), controller.getManagers);
router.get("/", authorize("HR", "Manager"), controller.getAll);
router.get("/:id", authorize("HR", "Manager"), controller.getById);
router.put("/:id", authorize("HR"), controller.update);
router.delete("/:id", authorize("HR"), controller.remove);

module.exports = router;
