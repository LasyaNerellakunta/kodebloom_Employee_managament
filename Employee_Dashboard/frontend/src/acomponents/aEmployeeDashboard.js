// frontend/src/pages/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import TopHeader from "../acomponents/aTopHeader";
import Sidebar from "../acomponents/aSidebar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeeDashboard(){
  const [employees, setEmployees]             = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm]           = useState('');
  const [filters, setFilters]                 = useState({
    employmentType: '',
    role: '',
    status: ''   // <-- default to empty, so show all
  });
  const [isSidebarOpen, setIsSidebarOpen]     = useState(false);
  const [username, setUsername]               = useState("");
  const [profilePic, setProfilePic]           = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const uname = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic   = localStorage.getItem("userPic");
    if (!uname || !token) return;

    setUsername(uname);
    setProfilePic(pic);

    axios.get("http://localhost:5000/api/emmployees")
      .then(res => {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      })
      .catch(err => console.error("Failed to fetch employees", err));
  }, []);

  useEffect(() => {
    let result = employees;

    if (filters.role) {
      result = result.filter(emp => emp.role === filters.role);
    }
    if (filters.employmentType) {
      result = result.filter(emp => emp.employmentType === filters.employmentType);
    }
    // Only apply status filter if it's non-empty
    if (filters.status) {
      result = result.filter(emp => emp.status === filters.status);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term)
      );
    }

    setFilteredEmployees(result);
  }, [filters, searchTerm, employees]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar  = () => setIsSidebarOpen(false);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleSearch = e => setSearchTerm(e.target.value);

  const handleRemove = async id => {
    if (!window.confirm("Are you sure you want to remove this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/emmployees/${id}`);
      setEmployees(emps => emps.filter(emp => emp._id !== id));
    } catch (err) {
      console.error("Failed to delete employee", err);
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader
          pageTitle="Employee Management"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        <div className="w-full max-w-6xl p-8 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Employees</h2>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              onClick={() => navigate('/employee/add')}
            >
              + Add Employee
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            {/* Status buttons */}
            {['', 'Active', 'InActive'].map(status => (
              <button
                key={status||'All'}
                className={`px-6 py-2 rounded-lg ${
                  filters.status === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleFilterChange('status', status)}
              >
                {status || 'All'}
              </button>
            ))}

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or role…"
              value={searchTerm}
              onChange={handleSearch}
              className="ml-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Role', 'Employment Type', 'Status', 'Salary Range', 'Actions'].map(col => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(emp => (
                    <tr key={emp._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.employmentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.salaryRange}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => navigate(`/employee/view/${emp._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          onClick={() => navigate(`/employee/edit/${emp._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleRemove(emp._id)}
                        >
                          Remove
                        </button>
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => navigate(`/employee/assign/${emp._id}`)}
                        >
                          Assign Task
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                      No employees found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
