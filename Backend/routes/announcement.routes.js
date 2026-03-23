const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");
const controller = require("../controllers/announcement.controller");

router.use(protect);

router.get("/", controller.getAnnouncements);
router.post("/", authorize("HR", "Admin"), controller.createAnnouncement);

module.exports = router;
