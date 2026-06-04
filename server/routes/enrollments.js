const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, error: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      completedLessons: [],
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course')
      .sort('-enrolledAt');
    res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('course', 'title price')
      .populate('user', 'name email')
      .sort('-enrolledAt');
    res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:courseId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment details not found for this course' });
    }

    res.json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:courseId/progress', protect, async (req, res) => {
  try {
    const { lessonId, completed } = req.body;
    if (!lessonId) {
      return res.status(400).json({ success: false, error: 'Please provide a lessonId' });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    const lessonIndex = enrollment.completedLessons.indexOf(lessonId);

    if (completed) {
      if (lessonIndex === -1) {
        enrollment.completedLessons.push(lessonId);
      }
    } else {
      if (lessonIndex > -1) {
        enrollment.completedLessons.splice(lessonIndex, 1);
      }
    }

    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
