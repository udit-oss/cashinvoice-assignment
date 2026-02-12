import React, { useState, useEffect } from 'react';
import { studentApi } from '../api/studentApi';
import { Student } from '../types';
import '../styles/studentForm.css';

interface StudentFormProps {
  student: Student | null;
  onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: 'React',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        age: student.age?.toString() || '',
        course: student.course,
        status: student.status
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      if (student) {
        await studentApi.update(student.student_id, data);
      } else {
        await studentApi.create(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{student ? 'Edit Student' : 'Add Student'}</h3>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Course:</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              required
            >
              <option value="React">React</option>
              <option value="Node">Node</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;