// middleware/access.middleware.js

module.exports = {
  allowSelfOrRole: (...allowedRoles) => {
    const allowed = allowedRoles.map((r) => r.toLowerCase());

    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = String(req.user.id);
      const targetId = String(req.params.id);

      // Allow accessing own resource
      if (userId && targetId && userId === targetId) {
        return next();
      }

      // Allow if user role matches any of the allowed roles
      const role = String(req.user.role || "").toLowerCase();
      if (allowed.includes(role)) {
        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    };
  },

  allowSelfEmployeeOrRole: (...allowedRoles) => {
    const allowed = allowedRoles.map((r) => r.toLowerCase());

    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const selfId = String(req.user.employee_id);
      const targetId = String(req.params.id);

      // Allow access if user is accessing their own employee record
      if (selfId && targetId && selfId === targetId) {
        return next();
      }

      // Allow if user role matches any of the allowed roles
      const role = String(req.user.role || "").toLowerCase();
      if (allowed.includes(role)) {
        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    };
  }
};
