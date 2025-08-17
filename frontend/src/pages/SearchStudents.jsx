import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PermissionCard from '../components/PermissionCard.jsx';

function SearchStudents() {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://spm-backend-hybi.onrender.com/api/users/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search students');
      setStudents([]);
    }
  };

  return (
    <div className="card">
      <button className="back-button" onClick={() => navigate('/home')}>
        <svg viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" />
        </svg>
        Back
      </button>
      <h2>Search Students</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSearch}>
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or roll number"
          />
          <button type="submit">Search</button>
        </div>
      </form>
      {students.length > 0 && (
        <div className="grid gap-4">
          {students.map((student) => (
            <div key={student._id} className="permission-card">
              <p><strong>{student.fullName}</strong></p>
              <p>Roll Number: {student.rollNumber}</p>
              <p>Email: {student.email}</p>
              <p>Total Permissions: {student.totalPermissions}</p>
              {student.permissions.length > 0 ? (
                <div>
                  <h3>Permissions</h3>
                  {student.permissions.map((permission) => (
                    <PermissionCard
                      key={permission._id}
                      permission={permission}
                      onUpdateStatus={(id, status) =>
                        axios.put(
                          `https://spm-backend-hybi.onrender.com/api/permissions/${id}`,
                          { status },
                          {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                          }
                        ).then((response) => {
                          setStudents(
                            students.map((s) =>
                              s._id === student._id
                                ? {
                                    ...s,
                                    permissions: s.permissions.filter((p) => p._id !== id),
                                    totalPermissions: s.totalPermissions - 1,
                                  }
                                : s
                            )
                          );
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <p>No permissions found for this student.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchStudents;
