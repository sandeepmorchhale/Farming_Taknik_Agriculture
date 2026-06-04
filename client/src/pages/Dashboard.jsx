import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, CheckCircle, ArrowRight, PlayCircle, User } from 'lucide-react';

const Dashboard = ({ user, enrollments, courses }) => {
  useEffect(() => {
    document.title = "Student Dashboard | Farming तकनीक";
  }, []);

  // Find which courses the student has NOT enrolled in yet
  const enrolledCourseIds = enrollments.map(e => e.course._id);
  const recommendedCourses = courses.filter(c => !enrolledCourseIds.includes(c._id));

  // Count total completed lessons across all enrolled courses
  const totalCompletedLessons = enrollments.reduce((sum, e) => sum + (e.completedLessons?.length || 0), 0);

  return (
    <div style={{ padding: '60px 0', animation: 'fadeInUp 0.4s ease' }}>
      <div className="container">

        {/* Dashboard Welcome Header */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--secondary) 100%)', border: '1px solid var(--primary-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-white)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
              <User size={30} />
            </div>
            <div>
              <span className="badge badge-green" style={{ textTransform: 'capitalize' }}>Student Desk</span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginTop: '4px' }}>Welcome, {user.name}!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Email: {user.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>{enrollments.length}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Enrolled Courses</span>
            </div>
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)' }}></div>
            <div style={{ textAlign: 'center', paddingLeft: '24px' }}>
              <h4 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>{totalCompletedLessons}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Lessons</span>
            </div>
          </div>
        </div>

        {/* My Enrolled Courses Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={22} style={{ color: 'var(--primary)' }} />
          My Registered Courses
        </h3>

        {enrollments.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '60px 20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', border: '1.5px solid rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '3rem' }}>📚</span>
            <h4 style={{ color: 'var(--primary-dark)', marginTop: '16px', fontSize: '1.25rem' }}>No Courses Registered Yet</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 20px auto' }}>
              You haven't enrolled in any agricultural training sessions yet. Browse our top-rated courses on tomato and capsicum cultivation.
            </p>
            <a href="#browse-section" className="btn btn-primary">
              Browse Catalog
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px' }}>
            {enrollments.map((enr) => {
              const { course, completedLessons } = enr;

              // Calculate completion percentage
              const totalLessonsCount = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
              const completedCount = completedLessons?.length || 0;
              const percent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

              return (
                <div key={enr._id} className="glass-panel premium-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', backgroundColor: 'var(--bg-white)', border: '1.5px solid rgba(0,0,0,0.03)' }}>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexGrow: 1, minWidth: '300px' }}>
                    <img src={course.thumbnail} alt={course.title} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: 0 }}>{course.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Duration: {course.duration}</p>

                      {/* Progress Bar container */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flexGrow: 1, height: '8px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', flexShrink: 0 }}>
                          {percent}% ({completedCount}/{totalLessonsCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {percent === 100 && (
                      <span className="badge badge-green" style={{ display: 'flex', gap: '4px' }}>
                        <Award size={14} /> Completed
                      </span>
                    )}
                    <Link to={`/course-player/${course._id}`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }} id={`resume-btn-${course._id}`}>
                      {percent === 0 ? 'Start Course' : 'Continue Study'}
                      <PlayCircle size={16} />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Recommended/Unenrolled Courses Section */}
        {recommendedCourses.length > 0 && (
          <div id="browse-section" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '40px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>
              Explore Other Farming Business Masterclasses
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {recommendedCourses.map((c) => {
                return (
                  <div key={c._id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-white)' }}>
                    <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-dark)' }}>{c.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 16px 0', flexGrow: 1 }}>{c.subtitle}</p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '14px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)' }}>₹{c.price}</span>
                        <Link to={`/course/${c._id}`} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                          View Details
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
