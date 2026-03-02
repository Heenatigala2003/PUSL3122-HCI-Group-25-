const Design = require('../models/Design');

exports.createDesign = async (req, res) => {
  try {
    const newDesign = await Design.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json({ status: 'success', data: { design: newDesign } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({ status: 'success', results: designs.length, data: { designs } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Designer (admin) can see ALL users' designs
exports.getAllDesignsAdmin = async (req, res) => {
  try {
    const designs = await Design.find({}).populate('user', 'name email').sort({ updatedAt: -1 });
    res.status(200).json({ status: 'success', results: designs.length, data: { designs } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Customer can see ALL designs to showcase
exports.getPublicDesigns = async (req, res) => {
  try {
    const designs = await Design.find({}).sort({ updatedAt: -1 });
    res.status(200).json({ status: 'success', results: designs.length, data: { designs } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getPublicDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ status: 'fail', message: 'Design not found' });
    res.status(200).json({ status: 'success', data: { design } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ status: 'fail', message: 'Design not found' });
    res.status(200).json({ status: 'success', data: { design } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateDesign = async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { design } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
