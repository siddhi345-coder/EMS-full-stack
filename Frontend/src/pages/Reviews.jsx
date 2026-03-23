import { useEffect, useState } from "react";
import ReviewTable from "../components/reviews/ReviewTable";
import ReviewForm from "../components/reviews/ReviewForm";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} from "../api/reviews.api";

const Reviews = () => {

  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSave = async (data) => {

    if (editingReview) {
      await updateReview(editingReview.review_id, data);
    } else {
      await createReview(data);
    }

    setShowForm(false);
    setEditingReview(null);
    fetchReviews();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this review?")) return;

    await deleteReview(id);
    fetchReviews();
  };

  const filteredReviews = reviews.filter((r) =>
    r.comments?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">

      <div className="top-bar">

        <h2>Performance Reviews</h2>

        <div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Review
          </button>
        </div>

      </div>

      <ReviewTable
        reviews={filteredReviews}
        onEdit={(review) => {
          setEditingReview(review);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && (
        <ReviewForm
          review={editingReview}
          onClose={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
};

export default Reviews;