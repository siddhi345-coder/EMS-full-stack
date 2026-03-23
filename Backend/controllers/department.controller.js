const Department = require("../models/department.model");
const db = require("../config/db");

exports.createDepartment = async (req, res, next) => {
  try {
    await Department.create(req.body);
    res.status(201).json({ message: "Department created successfully" });
  } catch (err) { next(err); }
};

exports.getDepartments = async (req, res, next) => {
  try {
    res.status(200).json(await Department.getAll());
  } catch (err) { next(err); }
};

exports.getDepartment = async (req, res, next) => {
  try {
    const dept = await Department.getById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(dept);
  } catch (err) { next(err); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    await Department.update(req.params.id, req.body);
    res.status(200).json({ message: "Department updated successfully" });
  } catch (err) { next(err); }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const [employees] = await db.execute("SELECT employee_id FROM employees WHERE department_id = ?", [req.params.id]);
    if (employees.length > 0) return res.status(400).json({ message: "Cannot delete department. Employees are assigned to it." });
    await Department.remove(req.params.id);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) { next(err); }
};
