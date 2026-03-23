const Review = require("../models/review.model");

// ✅ Create Review
exports.createReview = async (req, res) => {
  try {
    const { employeeId, rating, comments } = req.body;

    const result = Review.create(employeeId, rating, comments);

    res.status(201).json({
      message: "Review created successfully",
      review_id: result.lastInsertRowid
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ✅ Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const rows = Review.findAll();

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ✅ Get Review By ID
exports.getReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.json(review);

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ✅ Get Reviews By Employee
exports.getEmployeeReviews = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const rows = Review.findByEmployeeId(employeeId);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ✅ Update Review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comments } = req.body;

    const result = Review.update(id, rating, comments);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.json({
      message: "Review updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ✅ Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const result = Review.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};