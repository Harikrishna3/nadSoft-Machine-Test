const { body, param, validationResult } = require('express-validator');

const studentValidator = {
  createStudent: [
    body('first_name')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('last_name')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^[0-9]{10,15}$/)
      .withMessage('Phone must be 10-15 digits'),
    
    body('date_of_birth')
      .notEmpty()
      .withMessage('Date of birth is required')
      .isDate()
      .withMessage('Must be a valid date (YYYY-MM-DD)'),
    
    body('address').optional().trim(),
    
    body('city')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('City must be less than 50 characters'),
    
    body('state')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('State must be less than 50 characters'),
    
    body('postal_code')
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage('Postal code must be less than 10 characters'),
    
    body('country')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Country must be less than 50 characters'),
    
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'graduated', 'suspended'])
      .withMessage('Status must be one of: active, inactive, graduated, suspended')
  ],

  updateStudent: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Student ID must be a positive integer'),
    
    body('first_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('last_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^[0-9]{10,15}$/)
      .withMessage('Phone must be 10-15 digits'),
    
    body('date_of_birth')
      .optional()
      .isDate()
      .withMessage('Must be a valid date (YYYY-MM-DD)'),
    
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'graduated', 'suspended'])
      .withMessage('Status must be one of: active, inactive, graduated, suspended')
  ],

  studentId: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Student ID must be a positive integer')
  ],

  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
};

module.exports = studentValidator;
