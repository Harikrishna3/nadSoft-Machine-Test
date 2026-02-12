import React from 'react';

function StudentList({ 
  students, 
  pagination, 
  currentPage, 
  loading, 
  onPageChange, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="mb-0">
          <i className="bi bi-list-ul me-2"></i>
          All Students
        </h2>
        <button 
          className="btn btn-light"
          onClick={onAddClick}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Student
        </button>
      </div>
      <div className="card-body p-0">
        {students.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <h4>No Students Found</h4>
            <p>Click "Add New Student" to get started</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.student_id}>
                      <td>{student.student_id}</td>
                      <td>
                        <strong>{student.first_name} {student.last_name}</strong>
                      </td>
                      <td>
                        <i className="bi bi-envelope me-2"></i>
                        {student.email}
                      </td>
                      <td>
                        {student.phone || '-'}
                      </td>
                      <td>{student.city || '-'}</td>
                      <td>
                        <span className={`badge ${
                          student.status === 'active' ? 'bg-success' : 
                          student.status === 'graduated' ? 'bg-primary' : 
                          'bg-secondary'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => onEditClick(student)}
                          title="Edit Student"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDeleteClick(
                            student.student_id, 
                            `${student.first_name} ${student.last_name}`
                          )}
                          title="Delete Student"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Showing {students.length} of {pagination.totalRecords} students
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => onPageChange(1)}
                          disabled={!pagination.hasPreviousPage}
                        >
                          First
                        </button>
                      </li>
                      <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => onPageChange(currentPage - 1)}
                          disabled={!pagination.hasPreviousPage}
                        >
                          Previous
                        </button>
                      </li>
                      <li className="page-item active">
                        <span className="page-link">
                          {pagination.currentPage} of {pagination.totalPages}
                        </span>
                      </li>
                      <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => onPageChange(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                        >
                          Next
                        </button>
                      </li>
                      <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => onPageChange(pagination.totalPages)}
                          disabled={!pagination.hasNextPage}
                        >
                          Last
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentList;
