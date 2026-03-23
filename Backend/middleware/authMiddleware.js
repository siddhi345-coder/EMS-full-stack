const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const db = require("../config/db");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);

    // Always fetch fresh employee_id and role from DB
    const [rows] = await db.execute("SELECT user_id, username, employee_id, role FROM users WHERE user_id = ?", [decoded.id]);
    if (rows[0]) {
      decoded.role = rows[0].role;
      let employeeId = rows[0].employee_id || null;

      // Auto-link or auto-create employee record if missing for non-Admin users
      if (!employeeId && rows[0].role !== "Admin") {
        const [empRows] = await db.execute(
          "SELECT employee_id FROM employees WHERE email = ? OR first_name = ? LIMIT 1",
          [rows[0].username, rows[0].username]
        );
        if (empRows[0]) {
          employeeId = empRows[0].employee_id;
        } else {
          const fakeEmail = rows[0].username.replace(/[^a-zA-Z0-9]/g, '_') + '_' + rows[0].user_id + '@ems.local';
          const [newEmp] = await db.execute(
            "INSERT INTO employees (first_name, last_name, email) VALUES (?, '', ?)",
            [rows[0].username, fakeEmail]
          );
          employeeId = newEmp.insertId;
        }
        await db.execute("UPDATE users SET employee_id = ? WHERE user_id = ?", [employeeId, rows[0].user_id]);
      }

      decoded.employee_id = employeeId;
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token failed" });
  }
};
