const ReviewTable = ({ reviews, onEdit, onDelete }) => {

  return (
    <table className="table">

      <thead>
        <tr>
          {/* ID column removed */}
          <th>Employee ID</th>
          <th>Rating</th>
          <th>Comments</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {reviews.map((review) => (

          <tr key={review.review_id}>  {/* keep this for React */}

            {/* ID display removed */}
            <td>{review.employee_id}</td>
            <td>{review.rating}</td>
            <td>{review.comments}</td>

            <td>

              <button
                className="edit-btn"
                onClick={() => onEdit(review)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => onDelete(review.review_id)}
              >
                Delete
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );

};

export default ReviewTable;