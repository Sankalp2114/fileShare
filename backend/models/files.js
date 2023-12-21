const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  location: {
    type: String,
  },
  filename: {
    type: String,
  },
  uploadedBy: {
    type: String,
  },
  accessTo: {
    type: String,
  },
  size: {
    type: Number,
  },

});

const File = mongoose.model('File', fileSchema);

module.exports = File;
