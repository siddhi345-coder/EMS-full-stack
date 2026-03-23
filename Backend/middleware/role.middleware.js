exports.authorize = (...roles) => {
  const allowed = roles.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    const userRole = String(req.user?.role || "").toLowerCase();
    console.log(`[authorize] user role: "${userRole}" | allowed: [${allowed.join(", ")}]`);
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: `Forbidden: role '${userRole}' not in [${allowed.join(", ")}]` });
    }
    next();
  };
};
