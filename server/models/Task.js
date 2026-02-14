const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Link to User model
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    tags: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.method('toJSON', function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model('Task', taskSchema);