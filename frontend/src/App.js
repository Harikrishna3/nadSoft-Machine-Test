import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import AddStudentModal from './components/AddStudentModal';
import EditStudentModal from './components/EditStudentModal';
import studentService from './services/studentService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students on component mount and page change
  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page) => {
    setLoading(true);
    try {
      const response = await studentService.getAllStudents(page, 10);
      setStudents(response.data);
      setPagination(response.pagination);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch students'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      await studentService.createStudent(studentData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Student added successfully',
        timer: 2000,
        showConfirmButton: false
      });
      setShowAddModal(false);
      fetchStudents(currentPage);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add student'
      });
    }
  };

  const handleEditStudent = async (id, studentData) => {
    try {
      await studentService.updateStudent(id, studentData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Student updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      setShowEditModal(false);
      setSelectedStudent(null);
      fetchStudents(currentPage);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update student'
      });
    }
  };

  const handleDeleteStudent = async (id, studentName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `If you delete <strong>${studentName}</strong> then this action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await studentService.deleteStudent(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Student has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchStudents(currentPage);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete student'
        });
      }
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  return (
    <div className="App">
      <div className="container py-4">
        <header className="mb-4">
          <h1 className="text-center mb-3">
            <i className="bi bi-people-fill me-2"></i>
            Student Management System
          </h1>
          <p className="text-center text-muted">
            Manage student records with ease
          </p>
        </header>

        <StudentList
          students={students}
          pagination={pagination}
          currentPage={currentPage}
          loading={loading}
          onPageChange={setCurrentPage}
          onAddClick={() => setShowAddModal(true)}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteStudent}
        />

        <AddStudentModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSubmit={handleAddStudent}
        />

        <EditStudentModal
          show={showEditModal}
          student={selectedStudent}
          onHide={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
          onSubmit={handleEditStudent}
        />
      </div>
    </div>
  );
}

export default App;
