import React, { useState } from 'react';
import Sidebar from "../acomponents/aSidebar";
import TopHeader from "../acomponents/aTopHeader";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  React.useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (username && token) {
      setUsername(username);
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
            <TaskDetailView />
            <TaskSummaryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskDetailView() {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('activity');

  const handlePostComment = () => {
    if (comment.trim()) {
      alert("Comment posted: " + comment);
      setComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">To Do</span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Description</h3>
        <p className="text-gray-600">This is a sample task description. Replace this with actual task details.</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Assignees:</span>
            <span className="text-gray-800">John Doe</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Team:</span>
            <span className="text-gray-800">Frontend Team</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Start Date:</span>
            <span className="text-gray-800">2024-03-20</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Due Date:</span>
            <span className="text-gray-800">2024-03-25</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Priority:</span>
            <span className="text-gray-800">High</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Status:</span>
            <span className="text-gray-800">In Progress</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          Add Attachments
          <input type="file" multiple className="hidden" onChange={(e) => console.log(e.target.files)} />
        </label>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          {['activity', 'comments', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['T', 'B', '7', 'L', 'I', 'N', 'G', 'F', 'B', 'C', 'D', 'H', '+', 'V'].map((item) => (
          <button 
            key={item} 
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handlePostComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskSummaryTable() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    deadline: '',
    status: 'To Do',
    priority: 'Medium',
    files: []
  });

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? [...files] : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.assignedTo) return alert("Fill all required fields.");

    if (editTaskId !== null) {
      setTasks((prev) => prev.map(task => task.id === editTaskId ? { ...formData, id: task.id } : task));
    } else {
      setTasks((prev) => [...prev, { ...formData, id: Date.now() }]);
    }

    setFormData({ title: '', assignedTo: '', deadline: '', status: 'To Do', priority: 'Medium', files: [] });
    setEditTaskId(null);
    setIsAddingTask(false);
  };

  const handleEdit = (task) => {
    setFormData(task);
    setEditTaskId(task.id);
    setIsAddingTask(true);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Task Summary</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddingTask(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
          <input
            type="text"
            placeholder="Filter tasks..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {isAddingTask && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={handleFormChange} className="border p-2 rounded" placeholder="Title" />
          <input name="assignedTo" value={formData.assignedTo} onChange={handleFormChange} className="border p-2 rounded" placeholder="Assigned To" />
          <input name="deadline" type="date" value={formData.deadline} onChange={handleFormChange} className="border p-2 rounded" />
          <select name="status" value={formData.status} onChange={handleFormChange} className="border p-2 rounded">
            <option>To Do</option><option>In Progress</option><option>Completed</option>
          </select>
          <select name="priority" value={formData.priority} onChange={handleFormChange} className="border p-2 rounded">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <input name="files" type="file" multiple onChange={handleFormChange} className="border p-2 rounded" />
          <button onClick={handleSubmit} className="col-span-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            {editTaskId ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.deadline}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'To Do' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button onClick={() => handleEdit(task)} className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2">Edit</button>
                  <button onClick={() => handleDelete(task.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
