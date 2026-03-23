const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const { sendResetEmail } = require("../utils/mailer");

exports.signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const [existing] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (username, password_hash, role, is_active) VALUES (?, ?, ?, 1)",
      [username, password_hash, role]
    );

    const [rows] = await db.execute(
      "SELECT user_id, username, role, employee_id FROM users WHERE user_id = ?",
      [result.insertId]
    );
    const newUser = rows[0];
    const token = generateToken({
      id: newUser.user_id,
      role: newUser.role,
      employee_id: newUser.employee_id || null,
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: newUser.user_id, username: newUser.username, role: newUser.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } catch {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    let employee_id = user.employee_id || null;

    if (!employee_id && user.role !== "Admin") {
      const [empResult] = await db.execute(
        "INSERT INTO employees (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
        [user.username, "", "", ""]
      );
      employee_id = empResult.insertId;
      await db.execute("UPDATE users SET employee_id = ? WHERE user_id = ?", [
        employee_id,
        user.user_id,
      ]);
    }

    const token = generateToken({ id: user.user_id, role: user.role, employee_id });

    res.json({ token, user: { id: user.user_id, username: user.username, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required" });

    // Join employees to get the actual email since users.email is always null
    const [rows] = await db.execute(
      `SELECT u.user_id, u.username, e.email
       FROM users u
       LEFT JOIN employees e ON u.employee_id = e.employee_id
       WHERE u.username = ?`,
      [username]
    );

    if (!rows.length)
      return res.status(404).json({ message: "No account found with that username." });

    const user = rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.execute(
      "UPDATE users SET resetPasswordToken=?, resetPasswordExpires=? WHERE user_id=?",
      [resetToken, expires, user.user_id]
    );

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    // Try sending email if configured, otherwise return link directly
    if (process.env.MAIL_USER && process.env.MAIL_USER !== "your_email@gmail.com" && user.email) {
      try {
        await sendResetEmail(user.email, resetToken);
        return res.json({ message: `Reset link sent to ${user.email}` });
      } catch (mailErr) {
        console.error("SMTP ERROR:", mailErr.message);
      }
    }

    // Always return the link directly (works without SMTP)
    return res.json({
      message: "Reset link generated successfully.",
      resetUrl,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and new password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE resetPasswordToken=? AND resetPasswordExpires > NOW()",
      [token]
    );
    if (!rows.length)
      return res.status(400).json({ message: "Reset link is invalid or has expired" });

    const user = rows[0];
    const password_hash = await bcrypt.hash(password, 10);

    await db.execute(
      "UPDATE users SET password_hash=?, resetPasswordToken=NULL, resetPasswordExpires=NULL WHERE user_id=?",
      [password_hash, user.user_id]
    );

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: err.message });
  }
};
