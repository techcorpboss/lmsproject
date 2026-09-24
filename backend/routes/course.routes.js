// routes/course.routes.js
const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getAllCourses, 
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { createLesson } = require('../controllers/lessonController'); 
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Admin routes
router.post('/', protect, isAdmin, createCourse);
router.put('/:id', protect, isAdmin, updateCourse);
router.delete('/:id', protect, isAdmin, deleteCourse);
router.post('/:courseId/lessons', protect, isAdmin, createLesson);
module.exports = router;