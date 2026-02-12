const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const validator = require('../middleware/validator');

router.post(
  '/students',
  validator.createStudent,
  validator.handleValidationErrors,
  studentController.createStudent
);

router.get('/students', studentController.getAllStudents);

router.get(
  '/students/:id',
  validator.studentId,
  validator.handleValidationErrors,
  studentController.getStudentById
);

router.put(
  '/students/:id',
  validator.updateStudent,
  validator.handleValidationErrors,
  studentController.updateStudent
);

router.delete(
  '/students/:id',
  validator.studentId,
  validator.handleValidationErrors,
  studentController.deleteStudent
);

module.exports = router;
