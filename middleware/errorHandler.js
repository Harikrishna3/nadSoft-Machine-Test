/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Database errors
  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: 'A record with this email already exists',
      error: 'Duplicate entry'
    });
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      message: 'Invalid reference to related data',
      error: 'Foreign key constraint violation'
    });
  }

  if (err.code === '22P02') {
    // Invalid input syntax
    return res.status(400).json({
      success: false,
      message: 'Invalid data format',
      error: 'Invalid input syntax'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'An error occurred'
  });
};

module.exports = errorHandler;
