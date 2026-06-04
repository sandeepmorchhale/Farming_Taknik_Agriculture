import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [courses, setCourses] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Sync theme with document attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const json = await response.json();
      if (json.success) {
        setCourses(json.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch logged in user enrollments
  const fetchUserEnrollments = async (currentToken) => {
    if (!currentToken) return;
    try {
      const response = await fetch('/api/enrollments', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const json = await response.json();
      if (json.success) {
        setUserEnrollments(json.data);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  // Load user on startup
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          const json = await response.json();
          if (json.success) {
            setUser(json.user);
            setToken(savedToken);
            await fetchUserEnrollments(savedToken);
          } else {
            // Token expired or invalid
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          // Don't clear token if it's just a network error
        }
      }
      await fetchCourses();
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogin = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    fetchUserEnrollments(jwtToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setUserEnrollments([]);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-light)', gap: '16px' }}>
        <span style={{ fontSize: '3rem' }} className="animate-float">🌱</span>
        <h3 style={{ color: 'var(--primary-dark)', fontFamily: 'Outfit' }}>Farming Taknik Loading...</h3>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
        <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} />

        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home courses={courses} userEnrollments={userEnrollments} />} />

            {/* Dynamic details for any course (resolves by ID or slug) */}
            <Route path="/course/:courseId" element={<CourseDetail courses={courses} token={token} user={user} userEnrollments={userEnrollments} refreshEnrollments={() => fetchUserEnrollments(token)} />} />

            {/* Authentication */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />

            {/* Student Dashboard */}
            <Route path="/dashboard" element={user ? <Dashboard user={user} enrollments={userEnrollments} courses={courses} /> : <Navigate to="/login" />} />

            {/* Immersive Course Player */}
            <Route path="/course-player/:courseId" element={user ? <CoursePlayer token={token} /> : <Navigate to="/login" />} />

            {/* Admin Panel */}
            <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard token={token} refreshCourses={fetchCourses} courses={courses} /> : <Navigate to="/" />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer courses={courses} />
      </div>
    </Router>
  );
};

export default App;
