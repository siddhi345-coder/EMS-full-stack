const router = require("express").Router();
const controller = require("../controllers/department.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

router.use(protect);

// only HR can manage departments
router.post("/", authorize("HR"), controller.createDepartment);
router.get("/", controller.getDepartments);
router.get("/:id", controller.getDepartment);
router.put("/:id", authorize("HR"), controller.updateDepartment);
router.delete("/:id", authorize("HR"), controller.deleteDepartment);

module.exports = router;
