const managerActions = require("../models/manager_actions.model");

exports.getRecentLogs = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    let rows = [];
    try { rows = await managerActions.getRecent(limit); } catch (_) {}
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
