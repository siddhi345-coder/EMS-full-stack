// utils/helper.js

// ✅ Format Date (YYYY-MM-DD)
exports.formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// ✅ Calculate Net Salary
exports.calculateNetSalary = (basic, allowances, deductions) => {
  return (
    Number(basic) +
    Number(allowances) -
    Number(deductions)
  );
};

// ✅ Calculate Leave Days
exports.calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start;
  const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

  return diffDays;
};

// ✅ Generate Full Name
exports.getFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};

// ✅ Pagination Helper
exports.getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit: Number(limit), offset: Number(offset) };
};

// ✅ Response Success Format
exports.successResponse = (res, message, data = null) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

// ✅ Response Error Format
exports.errorResponse = (res, message, status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  });
};