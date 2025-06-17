
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Task from './pages/Task';
import Leave from './pages/Leave';
import Attendance from './pages/Attendance';
import CalendarPage from './pages/CalendarPage';
import Signin from './pages/Signin';
import AdminDashboard from './components/AdminDashboard';
import aSidebar from './acomponents/aSidebar';
import aDashboard from './acomponents/aDashboard';
import Proofile from './acomponents/aProfile';
import aSignin from './acomponents/aSignin';
import Client from './acomponents/aClient';
import EmployeeDashboard from './acomponents/aEmployeeDashboard';
import AddEmployee from './acomponents/AddEmployee';
import EmployeeView from './acomponents/EmployeeView';
import EmployeeEdit from './acomponents/EmployeeEdit';
import AssignTask from './acomponents/AssignTask';
import AddProject from './acomponents/aAddProject';
import Taasks from './acomponents/aTasks';
import Settings from './acomponents/aSettings';
import ProfileSettings from './asettingCom/aProfileSettings';
import AccountSettings from './asettingCom/aAccountSettings';
import SecuritySettings from './asettingCom/aSecuritySettings';
import UpdateSecurityQuestions from './asettingCom/UpdateSecurityQuestions';
import ManageDevices from './asettingCom/ManageDevices';
import NotificationSettings from './asettingCom/aNotificationSettings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('userRole')?.toLowerCase());

  // 🔑 Handle login and update state
  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    setToken(newToken);
    setRole(newRole.toLowerCase());
  };

  const showSidebar = !!token;

  return (
    <Router>
      <div className="d-flex">
        {showSidebar && <Sidebar />}

        <div className="container mt-4" style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                !token ? (
                  <Signin onLogin={handleLogin} />
                ) : role === 'admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/employee/dashboard" replace />
                )
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                token && role === 'employee' ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                token && role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" replace />} />
            <Route path="/tasks" element={token ? <Task /> : <Navigate to="/" replace />} />
            <Route path="/leave" element={token ? <Leave /> : <Navigate to="/" replace />} />
            <Route path="/attendance" element={token ? <Attendance /> : <Navigate to="/" replace />} />
            <Route path="/calendar" element={token ? <CalendarPage /> : <Navigate to="/" replace />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/proofile" element={<Proofile />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/clients" element={<Client />} />
            <Route path="/employees" element={<EmployeeDashboard />} />
            <Route path="/employee/add" element={<AddEmployee />} />
            <Route path="/employee/view/:id" element={<EmployeeView />} />
            <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
            <Route path="/employee/assign/:id" element={<AssignTask />} />
            <Route path="/projects" element={<AddProject />} />
            <Route path="/taasks" element={<Taasks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/profile" element={<ProfileSettings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
            <Route path="/update-security-questions" element={<UpdateSecurityQuestions />} />
            <Route path="/manage-devices" element={<ManageDevices />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
