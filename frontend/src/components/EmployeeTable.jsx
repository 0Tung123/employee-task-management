import React from 'react';
import '../styles/Dashboard.css';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Email</th>
          <th className="center">Status</th>
          <th className="center">Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(employee => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td className="center">
              <span className="status-badge active">
                Active
              </span>
            </td>
            <td className="center">
              <button
                className="action-button edit"
                onClick={() => onEdit(employee)}
              >
                Edit
              </button>
              <button
                className="action-button delete"
                onClick={() => onDelete(employee)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;