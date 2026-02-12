const pool = require('../config/database');

/**
 * Student Model - Database operations for students
 */
const studentModel = {
  /**
   * Create a new student
   * @param {Object} studentData - Student information
   * @returns {Promise<Object>} Created student record
   */
  async createStudent(studentData) {
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      city,
      state,
      postal_code,
      country,
      status
    } = studentData;

    const query = `
      INSERT INTO students (
        first_name, last_name, email, phone, date_of_birth,
        address, city, state, postal_code, country, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      first_name,
      last_name,
      email,
      phone || null,
      date_of_birth,
      address || null,
      city || null,
      state || null,
      postal_code || null,
      country || 'India',
      status || 'active'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Get all students with pagination
   * @param {number} limit - Number of records per page
   * @param {number} offset - Starting position
   * @returns {Promise<Array>} Array of student records
   */
  async getAllStudents(limit, offset) {
    const query = `
      SELECT 
        student_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        enrollment_date,
        address,
        city,
        state,
        postal_code,
        country,
        status,
        created_at,
        updated_at
      FROM students
      ORDER BY student_id DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  },

  /**
   * Get single student by ID with all marks
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Student with marks
   */
  async getStudentById(id) {
    // Get student basic info
    const studentQuery = `
      SELECT * FROM students WHERE student_id = $1
    `;
    const studentResult = await pool.query(studentQuery, [id]);

    if (studentResult.rows.length === 0) {
      return null;
    }

    const student = studentResult.rows[0];

    // Get student marks with subject details
    const marksQuery = `
      SELECT 
        m.mark_id,
        m.marks_obtained,
        m.exam_date,
        m.exam_type,
        m.grade,
        m.remarks,
        s.subject_id,
        s.subject_code,
        s.subject_name,
        s.max_marks,
        s.passing_marks,
        ROUND((m.marks_obtained / s.max_marks) * 100, 2) as percentage,
        CASE 
          WHEN m.marks_obtained >= s.passing_marks THEN 'Pass'
          ELSE 'Fail'
        END as result
      FROM marks m
      INNER JOIN subjects s ON m.subject_id = s.subject_id
      WHERE m.student_id = $1
      ORDER BY m.exam_date DESC
    `;
    const marksResult = await pool.query(marksQuery, [id]);

    // Combine student data with marks
    return {
      ...student,
      marks: marksResult.rows
    };
  },

  /**
   * Update student information
   * @param {number} id - Student ID
   * @param {Object} studentData - Updated student information
   * @returns {Promise<Object>} Updated student record
   */
  async updateStudent(id, studentData) {
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      city,
      state,
      postal_code,
      country,
      status
    } = studentData;

    const query = `
      UPDATE students
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        date_of_birth = COALESCE($5, date_of_birth),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        postal_code = COALESCE($9, postal_code),
        country = COALESCE($10, country),
        status = COALESCE($11, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $12
      RETURNING *
    `;

    const values = [
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      city,
      state,
      postal_code,
      country,
      status,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Delete student by ID
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Deleted student record
   */
  async deleteStudent(id) {
    const query = `
      DELETE FROM students
      WHERE student_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get total count of students
   * @returns {Promise<number>} Total number of students
   */
  async getStudentCount() {
    const query = 'SELECT COUNT(*) as count FROM students';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
};

module.exports = studentModel;
