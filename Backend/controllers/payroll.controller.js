const Payroll = require("../models/payroll.model");

// CREATE
exports.createPayroll = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    Payroll.create(req.body);
    res.status(201).json({ message: "Payroll created successfully" });
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getPayrolls = async (req, res, next) => {
  try {
    const payrolls = Payroll.getAll();
    res.json(payrolls);
  } catch (err) {
    next(err);
  }
};

// GET BY ID
exports.getPayroll = async (req, res, next) => {
  try {
    const payroll = Payroll.getById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.json(payroll);
  } catch (err) {
    next(err);
  }
};

// GET BY EMPLOYEE
exports.getEmployeePayroll = async (req, res, next) => {
  try {
    const payrolls = Payroll.getByEmployee(req.params.employeeId);
    res.json(payrolls);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updatePayroll = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const result = Payroll.update(req.params.id, req.body);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.json({ message: "Payroll updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deletePayroll = async (req, res, next) => {
  try {
    const result = Payroll.remove(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.json({ message: "Payroll deleted successfully" });
  } catch (err) {
    next(err);
  }
};