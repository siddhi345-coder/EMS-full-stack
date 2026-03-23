const db = require("../config/db");

const Review = {

  create: (employee_id, rating, comment) => {
    return db.prepare(
      "INSERT INTO performance_reviews (employee_id, rating, comment) VALUES (?, ?, ?)"
    ).run(employee_id, rating, comment);
  },

  findAll: () => {
    return db.prepare(
      "SELECT * FROM performance_reviews"
    ).all();
  },

  findById: (id) => {
    return db.prepare(
      "SELECT * FROM performance_reviews WHERE review_id = ?"
    ).get(id);
  },

  findByEmployeeId: (employeeId) => {
    return db.prepare(
      "SELECT * FROM performance_reviews WHERE employee_id = ?"
    ).all(employeeId);
  },

  update: (id, rating, comment) => {
    return db.prepare(
      "UPDATE performance_reviews SET rating = ?, comment = ? WHERE review_id = ?"
    ).run(rating, comment, id);
  },

  delete: (id) => {
    return db.prepare(
      "DELETE FROM performance_reviews WHERE review_id = ?"
    ).run(id);
  }

};

module.exports = Review;