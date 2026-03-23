const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");
const controller = require("../controllers/hr.controller");

router.use(protect);
router.use(authorize("HR", "Admin"));

router.get("/logs", controller.getRecentLogs);

module.exports = router;
