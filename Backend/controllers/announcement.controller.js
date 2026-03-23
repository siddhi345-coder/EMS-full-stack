const Announcement = require("../models/announcement.model");

exports.getAnnouncements = (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    res.json(Announcement.getAll(limit));
  } catch (err) {
    next(err);
  }
};

exports.createAnnouncement = (req, res, next) => {
  try {
    const { title, body } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = Announcement.create({
      title,
      body,
      created_at: new Date().toISOString(),
      created_by: req.user.id
    });

    res.status(201).json({ message: "Announcement created", id: result.lastInsertRowid });
  } catch (err) {
    next(err);
  }
};
