import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { Sprout, TrendingUp, Users, Play, Award, CheckCircle, ShieldCheck, Mail, Send, Youtube } from 'lucide-react';

const Home = ({ courses, userEnrollments }) => {
  useEffect(() => {
    document.title = "Farming तकनीक | Practical Scientific Farming by Ashish Morchhale";
  }, []);

  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // YouTube Channel Feed States
  const [feedTab, setFeedTab] = useState('videos');
  const [newComment, setNewComment] = useState({ author: '', text: '', location: '' });
  const [comments, setComments] = useState([
    { author: 'Ramesh Mandloi', text: 'आशीष जी, शकरकंद (Sweet Potato) वाले वीडियो से बहुत मदद मिली। इस बार मैंने 1 एकड़ में वैज्ञानिक विधि से लगाया है और पैदावार काफी अच्छी हुई है।', location: 'Kharagone, MP', date: '2 days ago' },
    { author: 'Rajesh Patel', text: 'सर, मिर्च की फसल में जो लीफ कर्ल वायरस (Leaf Curl Virus) और थ्रिप्स आते हैं, उसके लिए कोई जैविक दवाई या पीली चिपचिपी पट्टी का कोई स्पेशल वीडियो बनाइए।', location: 'Anand, Gujarat', date: '5 days ago' },
    { author: 'Sunita Verma', text: 'बहुत ही सरल और स्पष्ट भाषा में समझाते हैं आप। धन्यवाद फार्मिंग तकनीक टीम!', location: 'Indore, MP', date: '1 week ago' },
    { author: 'Gurpreet Singh', text: 'Arbi (अरबी) की वैज्ञानिक खेती की जानकारी कमाल की है सर। क्या सर्दियों में भी हम अरबी लगा सकते हैं?', location: 'Patiala, Punjab', date: '1 week ago' }
  ]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;
    setComments([
      {
        author: newComment.author,
        text: newComment.text,
        location: newComment.location || 'India',
        date: 'Just now'
      },
      ...comments
    ]);
    setNewComment({ author: '', text: '', location: '' });
  };

  // Check if user is enrolled in a given course
  const checkEnrollment = (courseId) => {
    return userEnrollments.some(e => e.course._id === courseId || e.course === courseId);
  };

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const json = await response.json();
      if (json.success) {
        setFormSubmitted(true);
        setContactData({ name: '', email: '', message: '' });
      } else {
        setErrorMsg(json.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>

      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: '560px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Hero text and buttons container */}
          <div className="hero-content">
            <h1 style={{ color: 'var(--bg-white)', fontSize: '3.6rem', marginBottom: '16px', fontWeight: 800, lineHeight: '1.15', fontFamily: 'Outfit' }}>
            Treat your fields <br />like factories.
            </h1>
            
            <p className="hero-para">
             "Get free videos recorded on real farms via the 
             'Farming Taknik' YouTube channel. For advanced learning, explore our paid courses to farm hand-in-hand with industry professionals."
            </p>
            
            {/* Action buttons row */}
            <div className="hero-buttons">
              {/* Google Play store badge */}
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 14px', color: '#fff', textDecoration: 'none', transition: 'var(--transition-fast)' }} className="store-btn">
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                  <span style={{ fontSize: '0.6rem', display: 'block', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>GET IT ON</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Google Play</span>
                </div>
              </a>

              {/* App store badge */}
              <a href="https://www.youtube.com/@farming_taknik/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 14px', color: '#fff', textDecoration: 'none', transition: 'var(--transition-fast)' }} className="store-btn">
                <Youtube size={36} style={{ color: '#ff0000' }} />
                <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                  <span style={{ fontSize: '0.6rem', display: 'block', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Subscribe on</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>YouTube</span>
                </div>
              </a>

              {/* LOG IN button */}
              <Link to="/login" className="btn" style={{ backgroundColor: '#ffffff', color: '#16331c', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} id="hero-login-btn">
                Log In
              </Link>
            </div>
          </div>

          {/* Quick-links Courses Pills Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', width: '100%', marginTop: '30px' }} className="hero-bottom-cards">
            {/* Capsicum Card */}
            <Link to="/course/capsicum" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '8px', backgroundColor: '#fff9f2', textDecoration: 'none', transition: 'var(--transition-normal)' }} className="hero-bottom-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff0d9', fontSize: '2rem' }}>🫑</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1b351e', fontWeight: 700 }}>Capsicum Farming</h4>
                <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Business Course</span>
              </div>
            </Link>

            {/* Tomato Card */}
            <Link to="/course/tomato" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '8px', backgroundColor: '#fff5f5', textDecoration: 'none', transition: 'var(--transition-normal)' }} className="hero-bottom-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffe5e5', fontSize: '2rem' }}>🍅</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1b351e', fontWeight: 700 }}>Tomato Farming</h4>
                <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Business Course</span>
              </div>
            </Link>

            {/* Start Farming Card */}
            <Link to="/course/start-farming" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '8px', backgroundColor: '#f2faf5', textDecoration: 'none', transition: 'var(--transition-normal)' }} className="hero-bottom-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcf5e4', color: '#1f5225', fontSize: '1.4rem', fontWeight: 800 }}>₹</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1b351e', fontWeight: 700 }}>Start a Farming</h4>
                <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Business Course</span>
              </div>
            </Link>
          </div>

        </div>

        <style>{`
          .store-btn:hover {
            transform: translateY(-2px);
            background-color: #111 !important;
            border-color: rgba(255,255,255,0.4) !important;
          }
          .hero-bottom-card {
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border: 1px solid transparent;
          }
          .hero-bottom-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            border-color: var(--primary-light);
          }
          .video-thumbnail-card:hover .video-img {
            transform: scale(1.06);
          }
          .video-thumbnail-card:hover .video-overlay {
            background-color: rgba(0,0,0,0.4) !important;
          }
          .video-thumbnail-card:hover .play-btn {
            transform: scale(1.1);
            background-color: #ff0000 !important;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.6) !important;
          }
        `}</style>
      </section>




      {/* Stats Quickbar */}
      <section style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '30px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: 800 }}>154K+</h2>
              <p style={{ fontWeight: 600, color: 'var(--text-color)', fontSize: '0.9rem' }}>Farmer's Community</p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.08)', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: 800 }}>4.7 ★</h2>
              <p style={{ fontWeight: 600, color: 'var(--text-color)', fontSize: '0.9rem' }}>
                Farmers Rating</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: 800 }}>100%</h2>
              <p style={{ fontWeight: 600, color: 'var(--text-color)', fontSize: '0.9rem' }}>Practical Farm Videos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Started Farming तकनीक */}
      <section id="about-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)' }}>
        <div className="container about-grid">
          <div>
            <img
              src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
              alt="Farming तकनीक Mission by Ashish Morchhale"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
            />
          </div>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '12px' }}>Our Mission</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Why We Started Farming तकनीक?</h2>
            <p style={{ color: 'var(--text-color)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              We believe the future of agriculture lies with empowered farmers. Our journey led by **Ashish Morchhale** began with a commitment to helping Indian farmers thrive through advanced, scientific farming techniques.
            </p>
            <p style={{ color: 'var(--text-color)', marginBottom: '28px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Today, with over **154K+ subscribers** on YouTube, we are dedicated to educating and equipping farmers with the knowledge of fertilizer schedules, crop planning, and nursery setups to make agriculture a highly rewarding business.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary-light)' }} />
                <span style={{ fontWeight: 600 }}>Scientific A-to-Z crop guides (Sweet Potato, Chilli)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary-light)' }} />
                <span style={{ fontWeight: 600 }}>Field demonstrations recorded directly on active farms</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary-light)' }} />
                <span style={{ fontWeight: 600 }}>Direct solutions for leaf curl virus and soil nutrition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <span className="badge badge-green" style={{ marginBottom: '12px' }}>Premium Courses</span>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)' }}>Farming तकनीक Masterclass Courses</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              Reduce your risk and learn crop cycles, commercial models, and sales formulas directly on real farms.
            </p>
          </div>

          <div className="grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={checkEnrollment(course._id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Feed Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)', borderTop: '1px solid var(--border-color)' }} id="youtube-feed-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <span className="badge badge-yellow" style={{ backgroundColor: 'var(--accent-yellow-light)', color: '#f57f17' }}>📺 YouTube Feed</span>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', marginTop: '12px' }}>Latest from Farming तकनीक Channel</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Explore real-farm guides, field demonstrations, and Q&A reviews fetched from Ashish Morchhale's YouTube community.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px', borderRadius: 'var(--radius-md)', maxWidth: '600px', margin: '0 auto 40px auto', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setFeedTab('videos')}
              style={{
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: feedTab === 'videos' ? 'var(--primary)' : 'transparent',
                color: feedTab === 'videos' ? '#fff' : 'var(--text-color)',
                transition: 'var(--transition-fast)'
              }}
            >
              📹 Popular Videos
            </button>
            <button
              onClick={() => setFeedTab('posts')}
              style={{
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: feedTab === 'posts' ? 'var(--primary)' : 'transparent',
                color: feedTab === 'posts' ? '#fff' : 'var(--text-color)',
                transition: 'var(--transition-fast)'
              }}
            >
              📰 Community Posts
            </button>
            <button
              onClick={() => setFeedTab('comments')}
              style={{
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: feedTab === 'comments' ? 'var(--primary)' : 'transparent',
                color: feedTab === 'comments' ? '#fff' : 'var(--text-color)',
                transition: 'var(--transition-fast)'
              }}
            >
              💬 Farmer Q&A ({comments.length})
            </button>
          </div>

          {/* Videos Grid */}
          {feedTab === 'videos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              
              {/* Card 1 */}
              <div className="glass-panel premium-card" style={{ padding: '20px', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-lg)' }}>
                <a 
                  href="https://www.youtube.com/watch?v=KzD71h_520o" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    position: 'relative', 
                    display: 'block', 
                    width: '100%', 
                    paddingBottom: '56.25%', 
                    marginBottom: '16px', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }} 
                  className="video-thumbnail-card"
                >
                  <img 
                    src="https://img.youtube.com/vi/KzD71h_520o/hqdefault.jpg" 
                    alt="Sweet Potato Farming Guide"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-normal)' }}
                    className="video-img"
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', transition: 'var(--transition-normal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="video-overlay">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '1.25rem', boxShadow: '0 4px 15px rgba(45, 106, 79, 0.4)', transition: 'var(--transition-fast)', paddingLeft: '4px' }} className="play-btn">
                      ▶
                    </div>
                  </div>
                </a>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                  शकरकंद की वैज्ञानिक खेती कब और कैसे करें - A to Z जानकारी
                </h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span>👁️ 200K+ Views</span>
                  <span>⏱️ 15:30 Mins</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-color)', lineHeight: '1.5' }}>
                  Learn how to cultivate high-yield sweet potatoes. Includes vine cutting treatment, soil preparation, and bed structure methods.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-panel premium-card" style={{ padding: '20px', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-lg)' }}>
                <a 
                  href="https://www.youtube.com/watch?v=J6iP6Jm9oJk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    position: 'relative', 
                    display: 'block', 
                    width: '100%', 
                    paddingBottom: '56.25%', 
                    marginBottom: '16px', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }} 
                  className="video-thumbnail-card"
                >
                  <img 
                    src="https://img.youtube.com/vi/J6iP6Jm9oJk/hqdefault.jpg" 
                    alt="Summer Crops Guide"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-normal)' }}
                    className="video-img"
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', transition: 'var(--transition-normal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="video-overlay">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '1.25rem', boxShadow: '0 4px 15px rgba(45, 106, 79, 0.4)', transition: 'var(--transition-fast)', paddingLeft: '4px' }} className="play-btn">
                      ▶
                    </div>
                  </div>
                </a>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                  मई और जून में लगाई जाने वाली सबसे ज्यादा मुनाफा देने वाली फसलें
                </h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span>👁️ 180K+ Views</span>
                  <span>⏱️ 12:45 Mins</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-color)', lineHeight: '1.5' }}>
                  A monthly breakdown of cash crops that maximize returns during peak summer heat. Focuses on irrigation and mandi rates.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-panel premium-card" style={{ padding: '20px', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-lg)' }}>
                <a 
                  href="https://www.youtube.com/watch?v=f9vT8d9Bv2k" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    position: 'relative', 
                    display: 'block', 
                    width: '100%', 
                    paddingBottom: '56.25%', 
                    marginBottom: '16px', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }} 
                  className="video-thumbnail-card"
                >
                  <img 
                    src="https://img.youtube.com/vi/f9vT8d9Bv2k/hqdefault.jpg" 
                    alt="Arbi Farming Guide"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-normal)' }}
                    className="video-img"
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', transition: 'var(--transition-normal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="video-overlay">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '1.25rem', boxShadow: '0 4px 15px rgba(45, 106, 79, 0.4)', transition: 'var(--transition-fast)', paddingLeft: '4px' }} className="play-btn">
                      ▶
                    </div>
                  </div>
                </a>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                  अरबी (Taro Root / Arbi) की वैज्ञानिक खेती - बीज उपचार से कटाई तक
                </h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span>👁️ 140K+ Views</span>
                  <span>⏱️ 18:10 Mins</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-color)', lineHeight: '1.5' }}>
                  Complete tutorial covering line spacing, basal fertilizer dosing, moisture monitoring, and tuber growth booster sprays.
                </p>
              </div>

            </div>
          )}

          {/* Community Posts */}
          {feedTab === 'posts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>🌱</span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--primary-dark)' }}>Farming तकनीक (Ashish Morchhale)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted 2 days ago</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  नमस्कार किसान भाइयों! मिर्च (Chilli) की फसल में इस समय थ्रिप्स और लीफ कर्ल वायरस (Leaf Curl Virus) का प्रकोप बढ़ रहा है। बचाव के लिए अपनी मिर्च की नर्सरी में मच्छरदानी का उपयोग करें और खेत में पीली चिपचिपी पट्टियां (Yellow Sticky Traps) जरूर लगाएं। रासायनिक छिड़काव के लिए संतुलित खुराक का ही प्रयोग करें।
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>🌱</span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--primary-dark)' }}>Farming तकनीक (Ashish Morchhale)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted 1 week ago</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  शकरकंद (Sweet Potato) की वैज्ञानिक खेती करने वाले किसान भाई ध्यान दें: बेल (Vine) की कटिंग करते समय हमेशा ऊपरी 3-4 गांठों वाले हिस्से का चयन करें, इससे जड़ें जल्दी और मजबूत बनती हैं। बुवाई से पहले फफूंदनाशक दवा से उपचार (treatment) जरूर करें।
                </p>
              </div>
            </div>
          )}

          {/* Farmer Comments */}
          {feedTab === 'comments' && (
            <div className="comments-split">
              
              {/* Left Column: Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Farmer Q&A Discussion Board</h4>
                
                {comments.map((comm, idx) => (
                  <div key={idx} style={{ padding: '16px 20px', borderRadius: '8px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', display: 'block' }}>{comm.author}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comm.location}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comm.date}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: '1.5' }}>{comm.text}</p>
                  </div>
                ))}
              </div>

              {/* Right Column: Add Comment Form */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '16px' }}>Ask a Question</h4>
                
                <form onSubmit={handleCommentSubmit}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      value={newComment.author}
                      onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                      className="form-control"
                      placeholder="e.g. Ramesh Patel"
                      style={{ padding: '10px 12px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Location</label>
                    <input
                      type="text"
                      value={newComment.location}
                      onChange={(e) => setNewComment({ ...newComment, location: e.target.value })}
                      className="form-control"
                      placeholder="e.g. Anand, Gujarat"
                      style={{ padding: '10px 12px' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Comment / Inquiry</label>
                    <textarea
                      required
                      rows="3"
                      value={newComment.text}
                      onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                      className="form-control"
                      placeholder="Ask Ashish ji about vine nursery or leaf curl spray schedules..."
                      style={{ padding: '10px 12px', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}>
                    Post Question
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section className="newsletter-section">
        <div className="container newsletter-grid">
          <div>
            <h2 style={{ color: 'var(--newsletter-title)', fontSize: '2.2rem', marginBottom: '10px' }}>Subscribe to get updated</h2>
            <p style={{ color: 'var(--newsletter-text)' }}>
              Join our mailing list to receive free farming guides, news updates, crop tips, and discounts on future masterclasses.
            </p>
          </div>
          <div className="newsletter-form-container">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button 
              className="btn" 
              style={{ 
                padding: '16px 24px',
                background: 'var(--newsletter-btn-bg)',
                color: 'var(--newsletter-btn-text)',
                boxShadow: 'var(--newsletter-btn-shadow)'
              }}
            >
              <Mail size={16} />
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <span className="badge badge-green" style={{ marginBottom: '12px' }}>Support Desk</span>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)' }}>Have any questions? Send a message</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Need help choosing the right course or troubleshooting an issue? Write to us.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '3.5rem' }}>✅</span>
                <h3 style={{ color: 'var(--primary)', marginTop: '16px', fontSize: '1.6rem' }}>Message Submitted Successfully!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                  Thank you for reaching out. Akash or one of our team members will get back to you shortly via email.
                </p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setFormSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                {errorMsg && (
                  <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontWeight: 500 }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={contactData.name}
                      onChange={handleContactChange}
                      className="form-control"
                      placeholder="e.g. Ramesh Patel"
                      id="contact-name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={contactData.email}
                      onChange={handleContactChange}
                      className="form-control"
                      placeholder="e.g. ramesh@gmail.com"
                      id="contact-email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Inquiry</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={contactData.message}
                    onChange={handleContactChange}
                    className="form-control"
                    placeholder="Describe what you want to ask or need help with..."
                    style={{ resize: 'vertical' }}
                    id="contact-message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
                  id="contact-submit-btn"
                >
                  {submitting ? 'Submitting...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
