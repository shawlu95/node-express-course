const mongoose = require("mongoose");

// If a field is not specified in schema, it will be ignored when saving
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"], // empty string doesn't pass the test
    trim: true,
    maxlength: [20, "Too long"]
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Task', TaskSchema);