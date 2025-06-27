// backend/models/Taask.js
import mongoose from 'mongoose';

const taaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // ← changed from single ObjectId to an array of ObjectIds
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emmployee',
    required: true
  }],
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['To Do','In Progress','Completed'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['High','Medium','Low'],
    default: 'Medium'
  },
  files: [{
    type: String
  }]
}, { timestamps: true });

const Taask = mongoose.models.Taask
  ? mongoose.model('Taask')
  : mongoose.model('Taask', taaskSchema);

export default Taask;
