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
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err: any) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await studentApi.delete(id);
      setStudents(students.filter(s => s.student_id !== id));
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
    fetchStudents();
  };

  if (loading) return <div>Loading...</div>;

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
            {students.map((student) => (
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
            ))}
          </tbody>
        </table>

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