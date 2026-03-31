import { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Toast from './components/Toast.jsx'
import api from "./api.js";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('mediscan_token') || null)
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('mediscan_user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })
  useEffect(() => {
  const token = localStorage.getItem("mediscan_token");

  if (token) {
    setToken(token);
    setUser({ email: "User" }); // temporary
  }
}, []);
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }

  const handleLogin = (token, userData) => {
    localStorage.setItem('mediscan_token', token)
    localStorage.setItem('mediscan_user', JSON.stringify(userData))
    setToken(token)
    setUser(userData)
    showToast(`Welcome back, ${userData.name || 'Doctor'}!`, 'success')
  }

  const handleLogout = () => {
    localStorage.removeItem('mediscan_token')
    localStorage.removeItem('mediscan_user')
    setToken(null)
    setUser(null)
    showToast('You have been signed out.', 'info')
  }

  

useEffect(() => {
  const testAPI = async () => {
    try {
      const res = await api.get("/api/reports");
      console.log("AXIOS WORKING ✅", res.data);
    } catch (err) {
      console.error("AXIOS ERROR ❌", err);
    }
  };

  testAPI();
}, []);

  return (
    <>
      {!token ? (
        <Login onLogin={handleLogin} showToast={showToast} />
      ) : (
        <Dashboard
          token={token}
          user={user}
          onLogout={handleLogout}
          showToast={showToast}
        />
      )}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
