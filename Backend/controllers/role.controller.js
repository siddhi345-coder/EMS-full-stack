const Role = require("../models/role.model");

// CREATE ROLE
exports.createRole = async (req, res) => {
  try {
    const result = await Role.createRole(req.body);
    res.status(201).json({ message: "Role created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ROLES
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ROLE BY ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ROLE
exports.updateRole = async (req, res) => {
  try {
    await Role.updateRole(req.params.id, req.body);
    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE ROLE
exports.deleteRole = async (req, res) => {
  try {
    const id = req.params.id;
    const employees = await Role.checkEmployeesWithRole(id);
    if (employees.length > 0) {
      return res.status(400).json({ error: "Cannot delete role. Employees are assigned to this role." });
    }
    await Role.deleteRole(id);
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};