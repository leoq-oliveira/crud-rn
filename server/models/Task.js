const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  feita: { type: Boolean, default: false },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);