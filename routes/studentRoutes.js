const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const validator = require('../middleware/validator');

/**
 * Student Routes
 */

// Create a new student
router.post(
  '/students',
  validator.createStudent,
  validator.handleValidationErrors,
  studentController.createStudent
);

// Get all students with pagination
router.get(
  '/students',
  studentController.getAllStudents
);

// Get single student by ID with marks
router.get(
  '/students/:id',
  validator.studentId,
  validator.handleValidationErrors,
  studentController.getStudentById
);

// Update student information
router.put(
  '/students/:id',
  validator.updateStudent,
  validator.handleValidationErrors,
  studentController.updateStudent
);

// Delete student
router.delete(
  '/students/:id',
  validator.studentId,
  validator.handleValidationErrors,
  studentController.deleteStudent
);

module.exports = router;
