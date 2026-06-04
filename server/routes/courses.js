const express = require('express');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const ImageKit = require('imagekit');
const router = express.Router();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const courseData = { ...req.body };
    if (req.body.image) {
      const uploadResponse = await imagekit.upload({
        file: req.body.image,
        fileName: `course_${Date.now()}_thumbnail.jpg`,
        folder: 'farming_taknik_photos'
      });
      courseData.thumbnail = uploadResponse.url;
      delete courseData.image;
    }
    const course = await Course.create(courseData);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const courseData = { ...req.body };
    if (req.body.image) {
      const uploadResponse = await imagekit.upload({
        file: req.body.image,
        fileName: `course_${Date.now()}_thumbnail.jpg`,
        folder: 'farming_taknik_photos'
      });
      courseData.thumbnail = uploadResponse.url;
      delete courseData.image;
    }
    course = await Course.findByIdAndUpdate(req.params.id, courseData, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
