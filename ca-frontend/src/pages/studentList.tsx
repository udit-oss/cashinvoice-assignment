import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { studentApi } from '../api/studentApi';
import { Student } from '../types';
import Navbar from '../components/navbar';
import StudentForm from '../components/studentForm';
import '../styles/studentList.css';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchInput === searchTerm) return; 

    const timer = setTimeout(() => {
      performSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getAll();
      setStudents(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (term.trim() === '') {
      fetchStudents();
      return;
    }

    try {
      const results = await studentApi.search(term);
      setStudents(results);
      setError('');
    } catch (err: any) {
      setError('Search failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await studentApi.delete(id);
      if (searchTerm.trim() === '') {
        fetchStudents();
      } else {
        performSearch(searchTerm);
      }
    } catch (err: any) {
      alert('Failed to delete student');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
    if (searchTerm.trim() === '') {
      fetchStudents();
    } else {
      performSearch(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    fetchStudents();
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <h2>Loading students...</h2>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="student-list-container">
        <div className="header">
          <h2>Students</h2>
          {isAdmin() && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add Student
            </button>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button onClick={handleClearSearch} className="clear-search">
              Clear
            </button>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Course</th>
              <th>Status</th>
              {isAdmin() && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentStudents.length === 0 ? (
              <tr>
                <td colSpan={isAdmin() ? 7 : 6} style={{ textAlign: 'center' }}>
                  {searchTerm ? 'No students found matching your search' : 'No students found'}
                </td>
              </tr>
            ) : (
              currentStudents.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age || '-'}</td>
                  <td>{student.course}</td>
                  <td>{student.status}</td>
                  {isAdmin() && (
                    <td>
                      <button onClick={() => handleEdit(student)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(student.student_id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}

        <div className="pagination-info">
          Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, students.length)} of {students.length} students
          {searchTerm && <span> (filtered)</span>}
        </div>

        {showForm && (
          <StudentForm
            student={editingStudent}
            onClose={handleFormClose}
          />
        )}
      </div>
    </>
  );
};

export default StudentList;