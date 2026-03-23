const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");
const controller = require("../controllers/manager.controller");

router.use(protect);
router.use(authorize("Manager", "HR"));

// Team
router.get("/team", controller.getTeam);
router.get("/team/:managerId", controller.getTeamByManagerId);
router.get("/team/member/:id", controller.getTeamMember);
router.patch("/team/member/:id", controller.updateTeamMember);

// Attendance
router.get("/attendance", controller.getAttendanceByDate);
router.get("/attendance/summary", controller.getAttendanceSummary);

// Leaves
router.get("/leaves", controller.getLeaves);
router.patch("/leaves/:id", controller.updateLeaveStatus);

// Tasks
router.get("/tasks", controller.getTasks);
router.post("/tasks", controller.createTask);
router.patch("/tasks/:id", controller.updateTaskStatus);

// Performance & Reports
router.get("/performance", controller.getPerformanceSummary);
router.get("/reports/attendance", controller.getAttendanceReport);
router.get("/reports/performance", controller.getPerformanceReport);

module.exports = router;
