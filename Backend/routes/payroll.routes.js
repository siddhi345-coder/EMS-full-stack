const router = require("express").Router();
const controller = require("../controllers/payroll.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

router.use(protect);

// payroll management reserved for HR only
router.post("/", authorize("HR"), controller.createPayroll);
router.get("/", authorize("HR"), controller.getPayrolls);

// FIXED ORDER
router.get("/employee/:employeeId", authorize("HR"), controller.getEmployeePayroll);
router.get("/:id", authorize("HR"), controller.getPayroll);

router.put("/:id", authorize("HR"), controller.updatePayroll);
router.delete("/:id", authorize("HR"), controller.deletePayroll);

module.exports = router;
