const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
