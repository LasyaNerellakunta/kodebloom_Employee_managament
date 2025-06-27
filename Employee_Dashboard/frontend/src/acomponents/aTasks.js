// frontend/src/pages/aTask.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../acomponents/aSidebar";
import TopHeader from "../acomponents/aTopHeader";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername]       = useState("");
  const [profilePic, setProfilePic]   = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar  = () => setIsSidebarOpen(false);

  useEffect(() => {
    const uname = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic   = localStorage.getItem("userPic");
    if (uname && token) {
      setUsername(uname);
      setProfilePic(pic || "");
    }
  }, []);

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader
          pageTitle="Task Management"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
            </header>
            <TaaskDetailView />
            <TaaskSummaryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaaskDetailView() {
  const [comment, setComment]     = useState('');
  const [activeTab, setActiveTab] = useState('activity');

  const handlePostComment = () => {
    if (comment.trim()) {
      alert("Comment posted: " + comment);
      setComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* ... your existing detail view ... */}
    </div>
  );
}

function TaaskSummaryTable() {
  const [taasks, setTaasks]       = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter]       = useState('');
  const [isAdding, setIsAdding]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [formData, setFormData]   = useState({
    title: '',
    assignedTo: [],     // array of IDs
    deadline: '',
    status: 'To Do',
    priority: 'Medium',
    files: []
  });

  const TASKS_API = 'http://localhost:5000/api/taasks';
  const EMPS_API  = 'http://localhost:5000/api/emmployees';

  useEffect(() => {
    // 1) fetch tasks and normalize assignedTo to an array
    axios.get(TASKS_API)
      .then(res => {
        const normalized = res.data.map(t => ({
          ...t,
          assignedTo: Array.isArray(t.assignedTo)
            ? t.assignedTo
            : t.assignedTo
              ? [t.assignedTo]
              : []
        }));
        setTaasks(normalized);
      })
      .catch(err => console.error("Error fetching tasks:", err));

    // 2) fetch employees for the checkbox list
    axios.get(EMPS_API)
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Error fetching employees:", err));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(f => ({
      ...f,
      [name]: files ? [...files] : value
    }));
  };

  const handleCheckbox = e => {
    const { value, checked } = e.target;
    setFormData(f => {
      const next = new Set(f.assignedTo);
      if (checked) next.add(value);
      else next.delete(value);
      return { ...f, assignedTo: Array.from(next) };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || formData.assignedTo.length === 0) {
      return alert("Title and at least one Assignee are required.");
    }
    try {
      let res;
      if (editId) {
        res = await axios.put(`${TASKS_API}/${editId}`, formData);
        const updated = {
          ...res.data,
          assignedTo: Array.isArray(res.data.assignedTo)
            ? res.data.assignedTo
            : res.data.assignedTo
              ? [res.data.assignedTo]
              : []
        };
        setTaasks(ts => ts.map(t => t._id === editId ? updated : t));
      } else {
        res = await axios.post(TASKS_API, formData);
        const newTask = {
          ...res.data,
          assignedTo: Array.isArray(res.data.assignedTo)
            ? res.data.assignedTo
            : res.data.assignedTo
              ? [res.data.assignedTo]
              : []
        };
        setTaasks(ts => [...ts, newTask]);
      }
      // reset form
      setFormData({
        title: '',
        assignedTo: [],
        deadline: '',
        status: 'To Do',
        priority: 'Medium',
        files: []
      });
      setEditId(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Error saving task:", err.response?.data || err.message);
      alert("Failed to save task: " + (err.response?.data?.error || err.message));
    }
  };

  const startEdit = taask => {
    setFormData({
      title:      taask.title,
      assignedTo: taask.assignedTo.map(emp => emp._id),
      deadline:   taask.deadline?.slice(0,10) || '',
      status:     taask.status,
      priority:   taask.priority,
      files:      []
    });
    setEditId(taask._id);
    setIsAdding(true);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${TASKS_API}/${id}`);
      setTaasks(ts => ts.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const filteredTasks = taasks.filter(t =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Task Summary</h2>
        <div className="flex gap-4">
          <button
            onClick={() => { setIsAdding(true); setEditId(null); }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Task
          </button>
          <input
            type="text"
            placeholder="Filter tasks..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 rounded"
            required
          />

          {/* Multiple-assignee checkboxes */}
          <div className="border p-2 rounded space-y-1 max-h-48 overflow-auto">
            <span className="block font-medium mb-1">Assign To:</span>
            {employees.map(emp => (
              <label key={emp._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={emp._id}
                  checked={formData.assignedTo.includes(emp._id)}
                  onChange={handleCheckbox}
                  className="h-4 w-4"
                />
                <span>{emp.name} ({emp.role})</span>
              </label>
            ))}
          </div>

          <input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            name="files"
            type="file"
            multiple
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            onClick={handleSubmit}
            className="col-span-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            {editId ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      )}

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Title','Assignees','Deadline','Status','Priority','Actions'].map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{task.title}</td>
                <td className="px-6 py-4 text-sm">
                  {Array.isArray(task.assignedTo)
                    ? task.assignedTo.map(emp => emp.name).join(', ')
                    : '—'}
                </td>
                <td className="px-6 py-4 text-sm">{task.deadline?.slice(0,10) || '—'}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => startEdit(task)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
