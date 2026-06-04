import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronLeft, BookOpen, Clock, FileText, CheckCircle } from 'lucide-react';

const CoursePlayer = ({ token }) => {
  const { courseId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [savingProgress, setSavingProgress] = useState(false);

  const fetchEnrollmentDetails = async () => {
    try {
      const response = await fetch(`/api/enrollments/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        setEnrollment(json.data);

        // Find default active lesson (first lesson of first module if not already set)
        if (!activeLesson && json.data.course.modules?.length > 0) {
          const firstMod = json.data.course.modules[0];
          if (firstMod.lessons?.length > 0) {
            setActiveLesson(firstMod.lessons[0]);
          }
        }
      } else {
        setErrorMsg(json.error || 'Failed to load course details.');
      }
    } catch (err) {
      setErrorMsg('Network connectivity error loading details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [courseId, token]);

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleToggleCompletion = async (lessonId, isCurrentlyCompleted) => {
    setSavingProgress(true);
    try {
      const response = await fetch(`/api/enrollments/${courseId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId,
          completed: !isCurrentlyCompleted
        })
      });
      const json = await response.json();
      if (json.success) {
        // Update local enrollment state completedLessons array
        setEnrollment({
          ...enrollment,
          completedLessons: json.data.completedLessons
        });
      }
    } catch (err) {
      console.error('Error toggling progress:', err);
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '3rem' }} className="animate-float">🌱</span>
        <h3>Preparing your farm lessons...</h3>
      </div>
    );
  }

  if (errorMsg || !enrollment) {
    return (
      <div style={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <p style={{ color: '#c62828' }}>⚠️ {errorMsg || 'Course player could not start.'}</p>
        <Link to="/dashboard" style={{ color: 'var(--primary)', marginTop: '10px' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const { course, completedLessons } = enrollment;

  // Calculate overall metrics
  const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
  const completedCount = completedLessons?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }}>
      {/* Course player bar */}
      <div style={{ backgroundColor: 'var(--primary-dark)', color: 'var(--bg-white)', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
          <h3 style={{ color: 'var(--bg-white)', fontSize: '1.25rem', margin: 0 }}>{course.title}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600 }}>
            Overall Progress: {completedCount}/{totalLessons} Lessons ({totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%)
          </span>
        </div>
      </div>

      {/* Main Player Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', flexGrow: 1, backgroundColor: '#090f0a' }} className="player-grid">

        {/* Left: Video Pane & Info */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activeLesson ? (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Video Player */}
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Lesson Details */}
              <div style={{ backgroundColor: 'var(--player-bg)', color: 'var(--player-text)', marginTop: '24px', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--player-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                  <div>
                    <h2 style={{ color: 'var(--player-title)', fontSize: '1.5rem', marginBottom: '4px' }}>{activeLesson.title}</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Duration: {activeLesson.duration}
                    </span>
                  </div>

                  {/* Mark complete button */}
                  <button
                    onClick={() => handleToggleCompletion(activeLesson._id, completedLessons.includes(activeLesson._id.toString()))}
                    disabled={savingProgress}
                    className="btn"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      backgroundColor: completedLessons.includes(activeLesson._id.toString()) ? 'var(--primary)' : 'transparent',
                      color: 'var(--bg-white)',
                      border: '1.5px solid var(--primary)',
                    }}
                    id="toggle-completion-btn"
                  >
                    <CheckCircle size={16} fill={completedLessons.includes(activeLesson._id.toString()) ? 'var(--bg-white)' : 'transparent'} />
                    {completedLessons.includes(activeLesson._id.toString()) ? 'Lesson Completed' : 'Mark as Completed'}
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontSize: '1rem' }}>Lesson Summary</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {activeLesson.summary || 'No summary notes available for this lesson. Please follow the instructions and references provided in the farm video.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.5)', height: '100%' }}>
              <PlayCircle size={60} />
              <h4 style={{ marginTop: '16px' }}>Select a lesson from the menu to start studying.</h4>
            </div>
          )}
        </div>

        {/* Right: Sidebar Curriculum Drawer */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#111a12' }} className="curriculum-sidebar">
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--bg-white)' }}>
            <h3 style={{ color: 'var(--bg-white)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--primary-light)' }} />
              Course Syllabus
            </h3>
          </div>

          <div style={{ overflowY: 'auto', flexGrow: 1 }}>
            {course.modules?.map((mod, mIdx) => (
              <div key={mod._id || mIdx}>
                {/* Module Title row */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {mod.title}
                </div>

                {/* Lessons list */}
                <div>
                  {mod.lessons?.map((les, lIdx) => {
                    const isCompleted = completedLessons.includes(les._id.toString());
                    const isActive = activeLesson && activeLesson._id === les._id;

                    return (
                      <div
                        key={les._id || lIdx}
                        onClick={() => handleLessonClick(les)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                          backgroundColor: isActive ? 'rgba(82, 183, 136, 0.12)' : 'transparent',
                          transition: 'var(--transition-fast)',
                        }}
                        className="player-lesson-item"
                        id={`lesson-${mIdx}-${lIdx}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1, paddingRight: '10px' }}>
                          {/* Checkbox button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering play
                              handleToggleCompletion(les._id, isCompleted);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                          >
                            <CheckCircle2
                              size={18}
                              style={{
                                color: isCompleted ? 'var(--primary-light)' : 'rgba(255,255,255,0.2)',
                                fill: isCompleted ? 'rgba(82, 183, 136, 0.1)' : 'transparent',
                              }}
                            />
                          </button>

                          <span style={{ fontSize: '0.88rem', color: isActive ? 'var(--primary-light)' : 'rgba(255,255,255,0.75)', fontWeight: isActive ? 600 : 400 }}>
                            {les.title}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                          {les.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Media queries for sidebar layout responsive design */}
      <style>{`
        @media (max-width: 900px) {
          .player-grid {
            grid-template-columns: 1fr !important;
          }
          .curriculum-sidebar {
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.1) !important;
            height: 400px !important;
          }
        }
        .player-lesson-item:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
