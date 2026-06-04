import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Clock, Play, BookOpen, Star, CheckCircle, Lock, Shield, Award, HelpCircle, CreditCard } from 'lucide-react';

const CourseDetail = ({ courses, token, user, userEnrollments, refreshEnrollments }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Find course matching ID or legacy slug
  const course = courses.find(c => {
    if (c._id === courseId) return true;
    
    const title = c.title.toLowerCase();
    const slug = courseId ? courseId.toLowerCase() : '';
    if (slug === 'chilli' || slug === 'capsicum') {
      return title.includes('capsicum') || title.includes('chilli') || title.includes('chili') || title.includes('vegetable');
    }
    if (slug === 'tomato') {
      return title.includes('tomato');
    }
    if (slug === 'start-farming') {
      return title.includes('business') || title.includes('start') || title.includes('potato');
    }
    return false;
  });

  useEffect(() => {
    if (course) {
      document.title = `${course.title} | Farming तकनीक by Ashish Morchhale`;
    }
  }, [course]);


  if (!course) {
    return (
      <div style={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h3>Course loading or not found...</h3>
        <Link to="/" style={{ color: 'var(--primary)', marginTop: '10px' }}>Back to Home</Link>
      </div>
    );
  }

  // Check enrollment
  const isEnrolled = userEnrollments.some(e => e.course._id === course._id || e.course === course._id);

  const handleEnrollClick = () => {
    if (!token) {
      // Direct to login
      navigate('/login');
    } else {
      setShowCheckout(true);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    // Simulate payment gateway processing
    setTimeout(async () => {
      try {
        const response = await fetch('/api/enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ courseId: course._id }),
        });

        const json = await response.json();
        if (json.success) {
          setPaymentSuccess(true);
          await refreshEnrollments();
          setTimeout(() => {
            setShowCheckout(false);
            navigate('/dashboard');
          }, 1500);
        } else {
          alert(json.error || 'Enrollment failed.');
        }
      } catch (err) {
        alert('Network error enrolling. Please try again.');
      } finally {
        setPaymentLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>

      {/* Course Detail Hero Banner */}
      <section style={{ backgroundColor: 'var(--course-hero-bg)', color: 'var(--course-hero-text)', padding: '60px 0', borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-normal)' }}>
        <div className="container course-hero-grid">
          <div>
            <span className="badge badge-green" style={{ marginBottom: '16px', backgroundColor: 'rgba(82, 183, 136, 0.2)', color: 'var(--primary-light)' }}>
              🌱 Premium Farming Masterclass
            </span>
            <h1 style={{ color: 'var(--course-hero-title)', fontSize: '2.5rem', marginBottom: '16px' }}>{course.title}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--course-hero-text)', marginBottom: '24px', lineHeight: '1.6' }}>
              {course.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--course-hero-text)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: 'var(--primary-light)' }} />
                Duration: {course.duration}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} style={{ color: 'var(--primary-light)' }} />
                {course.modules?.length || 0} Syllabus Modules
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} style={{ color: 'var(--accent-yellow)', fill: 'var(--accent-yellow)' }} />
                4.9 Rating (1,230 active students)
              </span>
            </div>
          </div>

          {/* Card sidebar info */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--course-hero-price)' }}>₹{course.price}</span>
                {course.originalPrice && (
                  <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--course-hero-original-price)' }}>₹{course.originalPrice}</span>
                )}
                <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.9rem', marginLeft: 'auto' }}>60% OFF</span>
              </div>

              {isEnrolled ? (
                <Link to="/dashboard" className="btn btn-yellow" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} id="detail-resume-btn">
                  Resume Learning
                </Link>
              ) : (
                <button onClick={handleEnrollClick} className="btn btn-yellow" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} id="detail-enroll-btn">
                  Enroll in Course
                </button>
              )}

              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--course-hero-text)' }}>
                🔒 256-Bit SSL Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Content */}
      <section style={{ padding: '60px 0' }}>
        <div className="container course-content-grid">

          {/* Left: Description & Curriculum */}
          <div>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', marginBottom: '30px', backgroundColor: 'var(--bg-white)', border: '1.5px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-dark)' }}>About this Course</h3>
              <p style={{ lineHeight: '1.7', color: 'var(--text-color)', fontSize: '1.02rem' }}>{course.description}</p>
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', border: '1.5px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--primary-dark)' }}>Course Curriculum</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {course.modules?.map((mod, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: 'var(--bg-light)', padding: '16px 20px', fontWeight: 600, color: 'var(--primary-dark)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{mod.title}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mod.lessons?.length || 0} Lessons</span>
                    </div>
                    <div style={{ padding: '10px 0' }}>
                      {mod.lessons?.map((les, lIdx) => (
                        <div key={lIdx} style={{ display: 'flex', padding: '12px 20px', borderBottom: lIdx === mod.lessons.length - 1 ? 'none' : '1px solid var(--border-color)', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '0.92rem', color: 'var(--text-color)', fontWeight: 500 }}>{les.title}</span>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{les.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Guarantee, What you get */}
          <div>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', marginBottom: '30px', backgroundColor: 'var(--bg-white)', border: '1.5px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>What you will get:</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', padding: 0 }}>
                {course.features?.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                    <CheckCircle size={18} style={{ color: 'var(--primary-light)' }} />
                    <span style={{ fontWeight: 500 }}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel text-center" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--secondary)', border: '1.5px dashed var(--primary-light)' }}>
              <Award size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>100% Satisfaction Gurantee</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', lineHeight: '1.5' }}>
                Join our students with peace of mind. We stand behind our training modules compiled directly on active farms in Maharashtra.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Payment checkout modal popup */}
      {showCheckout && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          id="checkout-modal"
        >
          <div className="glass-panel" style={{ backgroundColor: 'var(--bg-white)', width: '100%', maxWidth: '480px', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>

            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <span style={{ fontSize: '4rem' }}>🎉</span>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginTop: '20px' }}>Payment Approved!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                  Setting up your student desk and redirecting...
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowCheckout(false)}
                  style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                  id="close-checkout-btn"
                >
                  ✕
                </button>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={22} style={{ color: 'var(--primary)' }} />
                  Secure Course Checkout
                </h3>

                <div style={{ backgroundColor: 'var(--bg-light)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{course.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Includes Lifetime Access</span>
                  </div>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>₹{course.price}</span>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="form-group">
                    <label className="form-label">Dummy Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                      className="form-control"
                      placeholder="4111 2222 3333 4444"
                      id="checkout-card-number"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                        className="form-control"
                        placeholder="MM/YY"
                        id="checkout-card-expiry"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV / Code</label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        className="form-control"
                        placeholder="•••"
                        id="checkout-card-cvv"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', alignItems: 'flex-start' }}>
                    <Shield size={16} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      Demo Mode Check: Any 16-digit card details are accepted. Simulated payment triggers actual enrollment inside the database.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                    id="checkout-pay-btn"
                  >
                    {paymentLoading ? 'Authorizing Payment...' : `Pay ₹${course.price} & Enroll`}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetail;
