const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

const {
  getAttendance,
  getAttendanceByEmployee,
  getMonthlyReport,
  getMyAttendance,
  checkIn,
  checkOut,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendance.controller");

router.use(protect);

router.get("/my", authorize("Employee", "Manager", "HR", "Admin"), getMyAttendance);
router.post("/check-in", authorize("Employee", "Manager", "HR", "Admin"), checkIn);
router.post("/check-out", authorize("Employee", "Manager", "HR", "Admin"), checkOut);
router.get("/employee/:employeeId", authorize("HR", "Manager"), getAttendanceByEmployee);
router.get("/report/monthly", authorize("HR", "Manager"), getMonthlyReport);
router.get("/", authorize("HR", "Manager"), getAttendance);
router.post("/", authorize("HR", "Manager", "Employee"), createAttendance);
router.put("/:id", authorize("HR"), updateAttendance);
router.delete("/:id", authorize("HR"), deleteAttendance);

module.exports = router;
