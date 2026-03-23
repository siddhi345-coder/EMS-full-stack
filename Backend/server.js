const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const ensureSchema = require("./utils/ensureSchema");

const app = express();
ensureSchema();

/* =========================
   ✅ CORS CONFIGURATION
========================= */
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options(/.*/, cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* =========================
   ✅ BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/test", (req, res) => res.json({ok: true}));
console.log("Test route added");

/* =========================
   ✅ ROUTES
========================= */
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/departments", require("./routes/department.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/leaves", require("./routes/leave_requests.routes"));
app.use("/api/payroll", require("./routes/payroll.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/roles", require("./routes/role.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/manager", require("./routes/manager.routes"));
app.use("/api/hr", require("./routes/hr.routes"));
app.use("/api/announcements", require("./routes/announcement.routes"));

/* =========================
   ✅ ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   ✅ SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
