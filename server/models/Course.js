const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
});

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lessons: [LessonSchema],
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    unique: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: [true, 'Please add a subtitle'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    default: 'Practical Farming',
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0,
  },
  originalPrice: {
    type: Number,
  },
  duration: {
    type: String,
    default: '5+ Hours',
  },
  features: {
    type: [String],
    default: ['Beginner Friendly', '8+ Hours of Content', 'Lifetime Access', 'Proven Farming Methods'],
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
