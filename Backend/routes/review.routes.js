const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/role.middleware");

router.use(protect);

// only managers and HR can create or list all reviews
router.post("/", authorize("Manager", "HR"), reviewController.createReview);
router.get("/", authorize("Manager", "HR"), reviewController.getReviews);

// these two endpoints are allowed for any authenticated user (employee can view their own by ID as well)
router.get("/employee/:employeeId", reviewController.getEmployeeReviews);
router.get("/:id", reviewController.getReview);

router.put("/:id", authorize("Manager", "HR"), reviewController.updateReview);
router.delete("/:id", authorize("HR"), reviewController.deleteReview);

module.exports = router;
