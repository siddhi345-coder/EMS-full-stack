const router = require("express").Router();
const controller = require("../controllers/leave_requests.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

router.use(protect);

router.post("/", authorize("Employee", "HR", "Manager", "Admin"), controller.createLeave);
router.get("/report/summary", authorize("HR", "Admin"), controller.getLeaveSummary);
router.get("/", authorize("HR", "Manager", "Employee", "Admin"), controller.getLeaves);
router.get("/employee/:employeeId", authorize("HR", "Manager", "Employee", "Admin"), controller.getEmployeeLeaves);
router.patch("/:id/cancel", authorize("Employee", "Manager", "HR", "Admin"), controller.cancelLeave);
router.get("/:id", authorize("HR", "Manager", "Employee", "Admin"), controller.getLeave);
router.put("/:id", authorize("HR", "Manager", "Admin"), controller.updateLeave);
router.delete("/:id", authorize("HR", "Admin"), controller.deleteLeave);

module.exports = router;
