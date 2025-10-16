const Contact = require('../models/contact.model');
const mongoose = require('mongoose');

// GET all contacts
exports.getAll = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

// GET contact by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// CREATE new contact
exports.create = async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    next(err);
  }
};

// UPDATE contact by ID
exports.updateById = async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE contact by ID
exports.removeById = async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
};

// DELETE all contacts
exports.removeAll = async (req, res, next) => {
  try {
    const result = await Contact.deleteMany({});
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};