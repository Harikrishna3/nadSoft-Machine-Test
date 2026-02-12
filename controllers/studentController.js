const studentModel = require('../models/studentModel');

/**
 * Student Controller - Request handlers for student operations
 */
const studentController = {
  /**
   * Create a new student
   * POST /api/students
   */
  async createStudent(req, res, next) {
    try {
      const student = await studentModel.createStudent(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all students with pagination
   * GET /api/students?page=1&limit=10
   */
  async getAllStudents(req, res, next) {
    try {
      // Extract pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100'
        });
      }

      // Get students and total count
      const [students, totalCount] = await Promise.all([
        studentModel.getAllStudents(limit, offset),
        studentModel.getStudentCount()
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        message: 'Students retrieved successfully',
        data: students,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecords: totalCount,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single student by ID with marks
   * GET /api/students/:id
   */
  async getStudentById(req, res, next) {
    try {
      const studentId = parseInt(req.params.id);
      const student = await studentModel.getStudentById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${studentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Student retrieved successfully',
        data: student
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update student information
   * PUT /api/students/:id
   */
  async updateStudent(req, res, next) {
    try {
      const studentId = parseInt(req.params.id);
      
      // Check if student exists
      const existingStudent = await studentModel.getStudentById(studentId);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${studentId} not found`
        });
      }

      // Update student
      const updatedStudent = await studentModel.updateStudent(studentId, req.body);

      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete student
   * DELETE /api/students/:id
   */
  async deleteStudent(req, res, next) {
    try {
      const studentId = parseInt(req.params.id);
      
      const deletedStudent = await studentModel.deleteStudent(studentId);

      if (!deletedStudent) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${studentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        data: deletedStudent
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = studentController;
