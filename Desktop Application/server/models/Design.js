const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Design must have a name']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Design must belong to a user']
  },
  room: {
    width: Number,
    height: Number,
    shape: { type: String, enum: ['rectangular', 'l-shaped'], default: 'rectangular' },
    color: String,
    description: { type: String, default: "" } 
  },
  furniture: [{
    id: { type: String },
    type: { type: String },
    x: { type: Number },
    y: { type: Number },
    rotation: { type: Number, default: 0 },
    scale: { type: Number, default: 1 },
    color: { type: String },
    material: { type: String, default: 'matte' }
  }]
}, { timestamps: true });

const Design = mongoose.model('Design', designSchema);
module.exports = Design;
