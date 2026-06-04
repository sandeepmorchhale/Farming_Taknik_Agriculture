import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Mail, Users, Award, ShieldAlert, BarChart, Database, ListCollapse } from 'lucide-react';

const AdminDashboard = ({ token, courses, refreshCourses }) => {
  useEffect(() => {
    document.title = "Admin Dashboard | Farming तकनीक";
  }, []);

  const [activeTab, setActiveTab] = useState('courses');
  const [enrollments, setEnrollments] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // New course form fields
  const [newCourse, setNewCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 999,
    originalPrice: 1999,
    thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    duration: '6+ Hours',
    features: ['Beginner Friendly', 'Lifetime Access']
  });

  const [courseCreated, setCourseCreated] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');


  // Fetch admin logs: enrollments list and contact forms
  const fetchAdminStats = async () => {
    try {
      const authHeader = { 'Authorization': `Bearer ${token}` };

      // Enrollments
      const enrollRes = await fetch('/api/enrollments/admin', { headers: authHeader });
      const enrollJson = await enrollRes.json();
      if (enrollJson.success) {
        setEnrollments(enrollJson.data);
      }

      // Queries
      const queryRes = await fetch('/api/contact', { headers: authHeader });
      const queryJson = await queryRes.json();
      if (queryJson.success) {
        setQueries(queryJson.data);
      }
    } catch (error) {
      console.error('Error fetching admin panels:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, [token]);

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse({ ...newCourse, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      const json = await response.json();
      if (json.success) {
        setCourseCreated(true);
        setNewCourse({
          title: '',
          subtitle: '',
          description: '',
          price: 999,
          originalPrice: 1999,
          thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
          duration: '6+ Hours',
          features: ['Beginner Friendly', 'Lifetime Access']
        });
        setImagePreview('');
        await refreshCourses();
        setTimeout(() => setCourseCreated(false), 2000);
      } else {
        alert(json.error || 'Failed to create course.');
      }
    } catch (err) {
      alert('Error creating course. Connection failed.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course from the public catalog?')) return;
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        await refreshCourses();
        if (editingCourse && editingCourse._id === courseId) {
          setEditingCourse(null);
        }
      } else {
        alert(json.error || 'Failed to delete course.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditInputChange = (e) => {
    setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCourse({ ...editingCourse, image: reader.result });
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = (c) => {
    setEditingCourse(JSON.parse(JSON.stringify(c)));
    setEditImagePreview(c.thumbnail || '');
  };

  // Curriculum Management Handlers
  const handleUpdateCurriculum = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingCourse)
      });
      const json = await response.json();
      if (json.success) {
        alert('Course details and curriculum updated successfully!');
        setEditingCourse(null);
        setEditImagePreview('');
        await refreshCourses();
      } else {
        alert(json.error || 'Failed to update course.');
      }
    } catch (err) {
      alert('Error updating course. Connection failed.');
    }
  };

  const handleAddModule = () => {
    const updatedModules = [...(editingCourse.modules || [])];
    updatedModules.push({
      title: `Module ${updatedModules.length + 1}`,
      lessons: []
    });
    setEditingCourse({ ...editingCourse, modules: updatedModules });
  };

  const handleModuleTitleChange = (moduleIndex, value) => {
    const updatedModules = [...editingCourse.modules];
    updatedModules[moduleIndex].title = value;
    setEditingCourse({ ...editingCourse, modules: updatedModules });
  };

  const handleAddLesson = (moduleIndex) => {
    const updatedModules = [...editingCourse.modules];
    if (!updatedModules[moduleIndex].lessons) {
      updatedModules[moduleIndex].lessons = [];
    }
    updatedModules[moduleIndex].lessons.push({
      title: '',
      duration: '10:00',
      videoUrl: '',
      summary: ''
    });
    setEditingCourse({ ...editingCourse, modules: updatedModules });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...editingCourse.modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setEditingCourse({ ...editingCourse, modules: updatedModules });
  };

  const handleDeleteLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...editingCourse.modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setEditingCourse({ ...editingCourse, modules: updatedModules });
  };

  const handleDeleteModule = (moduleIndex) => {
    const updatedModules = [...editingCourse.modules];
    updatedModules.splice(moduleIndex, 1);
    setEditingCourse({ ...editingCourse, modules: updatedModules });
  };


  // Calculations for summary boxes
  const totalSalesRevenue = enrollments.reduce((sum, enr) => sum + (enr.course?.price || 0), 0);

  return (
    <div style={{ padding: '60px 0', animation: 'fadeInUp 0.4s ease' }}>
      <div className="container">
        
        {/* Title panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <ShieldAlert size={36} style={{ color: 'var(--primary)' }} />
          <div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', margin: 0 }}>Indian Farmer Admin Panel</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monitor analytics, configure curriculum, and review inquiries.</p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Total Sales Volume</span>
              <BarChart size={20} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>₹{totalSalesRevenue}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600 }}>Lifetime Revenue</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Course Registrations</span>
              <Users size={20} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>{enrollments.length}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students enrolled</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Online Catalog</span>
              <Database size={20} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>{courses.length}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active programs</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Support Queries</span>
              <Mail size={20} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>{queries.length}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600 }}>Tickets opened</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', borderBottom: '2px solid rgba(0,0,0,0.06)', gap: '20px', marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTab('courses')}
            style={{ padding: '10px 16px', fontWeight: 600, fontSize: '1rem', borderBottom: activeTab === 'courses' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'courses' ? 'var(--primary-dark)' : 'var(--text-muted)', background: 'none', cursor: 'pointer' }}
            id="tab-courses-btn"
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            style={{ padding: '10px 16px', fontWeight: 600, fontSize: '1rem', borderBottom: activeTab === 'enrollments' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'enrollments' ? 'var(--primary-dark)' : 'var(--text-muted)', background: 'none', cursor: 'pointer' }}
            id="tab-enrollments-btn"
          >
            View Enrollments
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            style={{ padding: '10px 16px', fontWeight: 600, fontSize: '1rem', borderBottom: activeTab === 'queries' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'queries' ? 'var(--primary-dark)' : 'var(--text-muted)', background: 'none', cursor: 'pointer' }}
            id="tab-queries-btn"
          >
            Support Inbox ({queries.length})
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'courses' && !editingCourse && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }} className="admin-split">

            
            {/* Left Column: Courses list */}
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Active Course Directory</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {courses.map((c) => (
                  <div key={c._id} className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'var(--bg-white)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <img src={c.thumbnail} alt={c.title} style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flexGrow: 1 }}>
                      <h5 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', margin: 0 }}>{c.title}</h5>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>₹{c.price}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '12px' }}>{c.duration}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => startEditing(c)}
                        style={{ padding: '8px', color: 'var(--primary)', background: 'none', cursor: 'pointer' }}
                        title="Manage Curriculum"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c._id)}
                        style={{ padding: '8px', color: '#c62828', background: 'none', cursor: 'pointer' }}
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Add Course Form */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', border: '1px solid var(--secondary)' }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} style={{ color: 'var(--primary)' }} />
                Add New Course
              </h4>

              {courseCreated && (
                <div style={{ backgroundColor: '#e8f5e9', color: 'var(--primary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>
                  ✓ Course Added to DB!
                </div>
              )}

              <form onSubmit={handleAddCourse}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={newCourse.title}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g. Hydroponic Strawberry Farming"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    required
                    value={newCourse.subtitle}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Learn how to cultivate high yields in small spaces."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="3"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Provide full description of the modules..."
                  ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Offer Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={newCourse.price}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      required
                      value={newCourse.originalPrice}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Thumbnail / Image (ImageKit)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                    style={{ padding: '8px 12px' }}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} id="add-course-btn">
                  Publish Course
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'courses' && editingCourse && (
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', border: '1px solid var(--primary-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', margin: 0 }}>Manage Course Curriculum</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Course: <strong>{editingCourse.title}</strong></p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingCourse(null)} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Back to Directory
              </button>
            </div>

            <form onSubmit={handleUpdateCurriculum}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Course Details Editing Section */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: 'var(--bg-light)', display: 'grid', gap: '16px' }}>
                  <h5 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Course Information</h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Course Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={editingCourse.title}
                        onChange={handleEditInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Subtitle</label>
                      <input
                        type="text"
                        name="subtitle"
                        required
                        value={editingCourse.subtitle}
                        onChange={handleEditInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Description</label>
                    <textarea
                      name="description"
                      required
                      rows="3"
                      value={editingCourse.description}
                      onChange={handleEditInputChange}
                      className="form-control"
                    ></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Offer Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        required
                        value={editingCourse.price}
                        onChange={handleEditInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Original Price (₹)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        required
                        value={editingCourse.originalPrice}
                        onChange={handleEditInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Duration</label>
                      <input
                        type="text"
                        name="duration"
                        required
                        value={editingCourse.duration}
                        onChange={handleEditInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Course Thumbnail / Image (ImageKit)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      className="form-control"
                      style={{ padding: '8px 12px' }}
                    />
                    {editImagePreview && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={editImagePreview} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                      </div>
                    )}
                  </div>
                </div>

                <h5 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: '10px 0 0 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Curriculum Modules & Lessons</h5>

                {(editingCourse.modules || []).map((mod, mIdx) => (
                  <div key={mIdx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: 'var(--bg-light)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)', minWidth: '100px' }}>Module #{mIdx + 1} Title</span>
                      <input
                        type="text"
                        required
                        value={mod.title}
                        onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                        className="form-control"
                        style={{ flexGrow: 1, padding: '8px 12px', minWidth: '200px' }}
                        placeholder="e.g. Module 1: Introduction"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteModule(mIdx)}
                        style={{ padding: '8px', color: '#c62828', background: 'none', cursor: 'pointer' }}
                        title="Delete Module"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Lessons header */}
                    <div style={{ paddingLeft: '15px', borderLeft: '3px solid var(--primary-accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>Lessons ({(mod.lessons || []).length})</span>
                        <button
                          type="button"
                          onClick={() => handleAddLesson(mIdx)}
                          className="btn"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)' }}
                        >
                          <PlusCircle size={14} /> Add Lesson
                        </button>
                      </div>

                      {/* Lessons list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(mod.lessons || []).map((les, lIdx) => (
                          <div key={lIdx} style={{ backgroundColor: 'var(--bg-white)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'flex-end' }}>
                              <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Lesson Title</label>
                                <input
                                  type="text"
                                  required
                                  value={les.title}
                                  onChange={(e) => handleLessonChange(mIdx, lIdx, 'title', e.target.value)}
                                  className="form-control"
                                  style={{ padding: '8px 12px' }}
                                  placeholder="e.g. 1.1 Overview & Profit Analysis"
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Duration</label>
                                <input
                                  type="text"
                                  required
                                  value={les.duration}
                                  onChange={(e) => handleLessonChange(mIdx, lIdx, 'duration', e.target.value)}
                                  className="form-control"
                                  style={{ padding: '8px 12px' }}
                                  placeholder="e.g. 12:45"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(mIdx, lIdx)}
                                  style={{ padding: '8px', color: '#c62828', background: 'none', cursor: 'pointer' }}
                                  title="Delete Lesson"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Video Embed URL (YouTube embed link)</label>
                              <input
                                type="url"
                                required
                                value={les.videoUrl}
                                onChange={(e) => handleLessonChange(mIdx, lIdx, 'videoUrl', e.target.value)}
                                className="form-control"
                                style={{ padding: '8px 12px' }}
                                placeholder="e.g. https://www.youtube.com/embed/f9vT8d9Bv2k"
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Lesson Summary (Optional)</label>
                              <textarea
                                value={les.summary || ''}
                                onChange={(e) => handleLessonChange(mIdx, lIdx, 'summary', e.target.value)}
                                className="form-control"
                                style={{ padding: '8px 12px', resize: 'vertical' }}
                                rows="2"
                                placeholder="Brief recap notes for the students..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddModule}
                  className="btn"
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)' }}
                >
                  <PlusCircle size={16} /> Add Module
                </button>

                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                    Save Curriculum
                  </button>
                  <button type="button" onClick={() => setEditingCourse(null)} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', overflowX: 'auto' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Active Enrollments</h4>
            
            {loadingStats ? (
              <p>Loading database enrollment stats...</p>
            ) : enrollments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No students have enrolled in any courses yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)', color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
                    <th style={{ padding: '12px 8px' }}>Student Name</th>
                    <th style={{ padding: '12px 8px' }}>Email</th>
                    <th style={{ padding: '12px 8px' }}>Course Title</th>
                    <th style={{ padding: '12px 8px' }}>Amount Paid</th>
                    <th style={{ padding: '12px 8px' }}>Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr) => (
                    <tr key={enr._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{enr.user?.name || 'Deleted User'}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{enr.user?.email || 'N/A'}</td>
                      <td style={{ padding: '12px 8px' }}>{enr.course?.title || 'Deleted Course'}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--primary)' }}>₹{enr.course?.price || 0}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Customer Support Ticketing Inbox</h4>
            
            {loadingStats ? (
              <p>Loading database inquiries...</p>
            ) : queries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Inbox is clear. No new inquiries.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {queries.map((q) => (
                  <div key={q._id} style={{ border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: 'var(--bg-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--primary-dark)' }}>{q.name}</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email: <a href={`mailto:${q.email}`} style={{ color: 'var(--primary)' }}>{q.email}</a></span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-color)', lineHeight: '1.6', whiteSpace: 'pre-line', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '10px' }}>
                      {q.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* CSS Helper for responsive admin split */}
      <style>{`
        @media (max-width: 900px) {
          .admin-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
