const Project = require('../models/project.model');
const mongoose = require('mongoose');

// GET all projects
exports.getAll = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

// GET project by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// CREATE new project
exports.create = async (req, res, next) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    next(err);
  }
};

// UPDATE project by ID
exports.updateById = async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE project by ID
exports.removeById = async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

// DELETE all projects
exports.removeAll = async (req, res, next) => {
  try {
    const result = await Project.deleteMany({});
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};