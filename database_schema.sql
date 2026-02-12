-- ============================================
-- Student Management System - Database Schema
-- PostgreSQL Database Schema Design
-- ============================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- ============================================
-- Table: students
-- Description: Stores student information
-- ============================================
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    date_of_birth DATE NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'India',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: subjects
-- Description: Stores subject/course information
-- ============================================
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    max_marks INTEGER DEFAULT 100 NOT NULL,
    passing_marks INTEGER DEFAULT 40 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_passing_marks CHECK (passing_marks <= max_marks)
);

-- ============================================
-- Table: marks
-- Description: Stores student marks for subjects
-- Normalized junction table between students and subjects
-- ============================================
CREATE TABLE marks (
    mark_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    exam_date DATE NOT NULL,
    exam_type VARCHAR(50) DEFAULT 'regular' CHECK (exam_type IN ('regular', 'midterm', 'final', 'supplementary')),
    grade VARCHAR(2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(subject_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Ensure a student can have only one mark entry per subject per exam type
    CONSTRAINT unique_student_subject_exam UNIQUE (student_id, subject_id, exam_type),
    
    -- Ensure marks are within valid range
    CONSTRAINT check_marks_range CHECK (marks_obtained >= 0)
);

-- ============================================
-- Indexes for Performance Optimization
-- ============================================

-- Index on student email for faster lookups
CREATE INDEX idx_students_email ON students(email);

-- Index on student status for filtering active students
CREATE INDEX idx_students_status ON students(status);

-- Index on subject code for faster lookups
CREATE INDEX idx_subjects_code ON subjects(subject_code);

-- Composite index on marks table for common queries
CREATE INDEX idx_marks_student_subject ON marks(student_id, subject_id);

-- Index on exam_date for date-based queries
CREATE INDEX idx_marks_exam_date ON marks(exam_date);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for students table
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for subjects table
CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for marks table
CREATE TRIGGER update_marks_updated_at
    BEFORE UPDATE ON marks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate grade based on marks
CREATE OR REPLACE FUNCTION calculate_grade()
RETURNS TRIGGER AS $$
DECLARE
    percentage DECIMAL(5,2);
    max_marks_val INTEGER;
BEGIN
    -- Get max marks for the subject
    SELECT max_marks INTO max_marks_val FROM subjects WHERE subject_id = NEW.subject_id;
    
    -- Calculate percentage
    percentage := (NEW.marks_obtained / max_marks_val) * 100;
    
    -- Assign grade based on percentage
    IF percentage >= 90 THEN
        NEW.grade := 'A+';
    ELSIF percentage >= 80 THEN
        NEW.grade := 'A';
    ELSIF percentage >= 70 THEN
        NEW.grade := 'B+';
    ELSIF percentage >= 60 THEN
        NEW.grade := 'B';
    ELSIF percentage >= 50 THEN
        NEW.grade := 'C';
    ELSIF percentage >= 40 THEN
        NEW.grade := 'D';
    ELSE
        NEW.grade := 'F';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate grade when marks are inserted or updated
CREATE TRIGGER calculate_grade_trigger
    BEFORE INSERT OR UPDATE ON marks
    FOR EACH ROW
    EXECUTE FUNCTION calculate_grade();

-- ============================================
-- Sample Data Insertion (Optional)
-- ============================================

-- Insert sample students
INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address, city, state, postal_code) VALUES
('Rahul', 'Sharma', 'rahul.sharma@example.com', '9876543210', '2000-05-15', '123 MG Road', 'Mumbai', 'Maharashtra', '400001'),
('Priya', 'Patel', 'priya.patel@example.com', '9876543211', '2001-08-22', '456 Park Street', 'Delhi', 'Delhi', '110001'),
('Amit', 'Kumar', 'amit.kumar@example.com', '9876543212', '2000-11-10', '789 Brigade Road', 'Bangalore', 'Karnataka', '560001'),
('Sneha', 'Reddy', 'sneha.reddy@example.com', '9876543213', '2001-03-18', '321 Anna Salai', 'Chennai', 'Tamil Nadu', '600001'),
('Vikram', 'Singh', 'vikram.singh@example.com', '9876543214', '2000-07-25', '654 Civil Lines', 'Jaipur', 'Rajasthan', '302001');

-- Insert sample subjects
INSERT INTO subjects (subject_code, subject_name, description, credits, max_marks, passing_marks) VALUES
('CS101', 'Introduction to Programming', 'Basic programming concepts using Python', 4, 100, 40),
('CS102', 'Data Structures', 'Fundamental data structures and algorithms', 4, 100, 40),
('CS103', 'Database Management Systems', 'Relational database design and SQL', 3, 100, 40),
('CS104', 'Web Development', 'HTML, CSS, JavaScript and modern frameworks', 3, 100, 40),
('CS105', 'Operating Systems', 'OS concepts, processes, and memory management', 4, 100, 40);

-- Insert sample marks
INSERT INTO marks (student_id, subject_id, marks_obtained, exam_date, exam_type) VALUES
-- Rahul's marks
(1, 1, 85.5, '2024-05-15', 'final'),
(1, 2, 78.0, '2024-05-16', 'final'),
(1, 3, 92.0, '2024-05-17', 'final'),
(1, 4, 88.5, '2024-05-18', 'final'),
(1, 5, 76.0, '2024-05-19', 'final'),

-- Priya's marks
(2, 1, 92.0, '2024-05-15', 'final'),
(2, 2, 88.5, '2024-05-16', 'final'),
(2, 3, 95.0, '2024-05-17', 'final'),
(2, 4, 90.0, '2024-05-18', 'final'),
(2, 5, 87.5, '2024-05-19', 'final'),

-- Amit's marks
(3, 1, 72.0, '2024-05-15', 'final'),
(3, 2, 68.5, '2024-05-16', 'final'),
(3, 3, 75.0, '2024-05-17', 'final'),
(3, 4, 80.0, '2024-05-18', 'final'),
(3, 5, 70.5, '2024-05-19', 'final'),

-- Sneha's marks
(4, 1, 88.0, '2024-05-15', 'final'),
(4, 2, 85.0, '2024-05-16', 'final'),
(4, 3, 90.0, '2024-05-17', 'final'),
(4, 4, 92.5, '2024-05-18', 'final'),
(4, 5, 84.0, '2024-05-19', 'final'),

-- Vikram's marks
(5, 1, 65.0, '2024-05-15', 'final'),
(5, 2, 70.0, '2024-05-16', 'final'),
(5, 3, 68.5, '2024-05-17', 'final'),
(5, 4, 72.0, '2024-05-18', 'final'),
(5, 5, 66.5, '2024-05-19', 'final');

-- ============================================
-- Useful Views for Common Queries
-- ============================================

-- View: Student Performance Summary
CREATE OR REPLACE VIEW student_performance AS
SELECT 
    s.student_id,
    s.first_name,
    s.last_name,
    s.email,
    COUNT(m.mark_id) as total_subjects,
    ROUND(AVG(m.marks_obtained), 2) as average_marks,
    ROUND(AVG((m.marks_obtained / sub.max_marks) * 100), 2) as average_percentage
FROM students s
LEFT JOIN marks m ON s.student_id = m.student_id
LEFT JOIN subjects sub ON m.subject_id = sub.subject_id
GROUP BY s.student_id, s.first_name, s.last_name, s.email;

-- View: Detailed Student Marks Report
CREATE OR REPLACE VIEW student_marks_report AS
SELECT 
    s.student_id,
    s.first_name || ' ' || s.last_name as student_name,
    s.email,
    sub.subject_code,
    sub.subject_name,
    m.marks_obtained,
    sub.max_marks,
    ROUND((m.marks_obtained / sub.max_marks) * 100, 2) as percentage,
    m.grade,
    m.exam_type,
    m.exam_date,
    CASE 
        WHEN m.marks_obtained >= sub.passing_marks THEN 'Pass'
        ELSE 'Fail'
    END as result
FROM students s
INNER JOIN marks m ON s.student_id = m.student_id
INNER JOIN subjects sub ON m.subject_id = sub.subject_id
ORDER BY s.student_id, sub.subject_code;

-- ============================================
-- Comments and Documentation
-- ============================================

COMMENT ON TABLE students IS 'Stores student personal and enrollment information';
COMMENT ON TABLE subjects IS 'Stores subject/course details and grading criteria';
COMMENT ON TABLE marks IS 'Junction table storing student marks for each subject';

COMMENT ON COLUMN students.status IS 'Student enrollment status: active, inactive, graduated, or suspended';
COMMENT ON COLUMN marks.exam_type IS 'Type of examination: regular, midterm, final, or supplementary';
COMMENT ON COLUMN marks.grade IS 'Auto-calculated grade based on percentage';
