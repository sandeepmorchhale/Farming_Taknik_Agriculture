import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Twitter, MessageSquare, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--footer-bg)', 
      color: 'var(--footer-text)', 
      padding: '70px 0 30px 0', 
      borderTop: '1px solid var(--border-color)',
      transition: 'background-color var(--transition-normal), color var(--transition-normal)'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
        
        {/* About / Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '2.2rem' }}>🌱</span>
            <h3 style={{ color: 'var(--footer-title)', margin: 0, fontSize: '1.4rem' }}>Farming तकनीक</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px', color: 'var(--footer-text)' }}>
            A Movement by Farming तकनीक for Scientific Agriculture & Vegetable Farming. Empowering Farmers with practical guides led by Ashish Morchhale.
          </p>
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://www.youtube.com/@farming_taknik/" target="_blank" rel="noopener noreferrer" style={{ padding: '8px', backgroundColor: 'var(--secondary)', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }} className="social-icon">
              <Youtube size={18} />
            </a>
            <a href="https://www.instagram.com/farmingtaknik/" target="_blank" rel="noopener noreferrer" style={{ padding: '8px', backgroundColor: 'var(--secondary)', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }} className="social-icon">
              <Instagram size={18} />
            </a>
            <a href="https://www.facebook.com/farmingtaknik/" target="_blank" rel="noopener noreferrer" style={{ padding: '8px', backgroundColor: 'var(--secondary)', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }} className="social-icon">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com/Farming_taknik" target="_blank" rel="noopener noreferrer" style={{ padding: '8px', backgroundColor: 'var(--secondary)', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }} className="social-icon">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Top-Rated Courses Column */}
        <div>
          <h4 style={{ color: 'var(--footer-title)', marginBottom: '20px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Masterclass Programs</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', padding: 0 }}>
            <li><Link to="/course/capsicum" style={{ color: 'var(--footer-text)', transition: 'var(--transition-fast)' }} className="footer-link">Chilli & Vegetable Masterclass</Link></li>
            <li><Link to="/course/tomato" style={{ color: 'var(--footer-text)', transition: 'var(--transition-fast)' }} className="footer-link">Tomato Farming Masterclass</Link></li>
            <li><Link to="/course/start-farming" style={{ color: 'var(--footer-text)', transition: 'var(--transition-fast)' }} className="footer-link">Sweet Potato Farming Masterclass</Link></li>
            <li><Link to="/login" style={{ color: 'var(--footer-text)', transition: 'var(--transition-fast)' }} className="footer-link">Course Dashboard Login</Link></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 style={{ color: 'var(--footer-title)', marginBottom: '20px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', padding: 0 }}>
            <li><Link to="/" style={{ color: 'var(--footer-text)' }} className="footer-link">Home</Link></li>
            <li><a href="#about-section" style={{ color: 'var(--footer-text)' }} className="footer-link">Our Mission</a></li>
            <li><a href="#contact-section" style={{ color: 'var(--footer-text)' }} className="footer-link">Support Helpdesk</a></li>
          </ul>
        </div>

        {/* Contact info column */}
        <div>
          <h4 style={{ color: 'var(--footer-title)', marginBottom: '20px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support & Enquiries</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} style={{ color: 'var(--primary-light)' }} />
              <a href="https://wa.me/+919274748282" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--footer-text)' }}>WhatsApp Support (+91 ..........)</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'var(--primary-light)' }} />
              <div>
                <a href="mailto:support@farmingtaknik.com" style={{ color: 'var(--footer-text)', display: 'block' }}>support@farmingtaknik.com</a>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>For Student Support</span>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'var(--primary-light)' }} />
              <div>
                <a href="mailto:farmingtaknik@gmail.com" style={{ color: 'var(--footer-text)', display: 'block' }}>farmingtaknik@gmail.com</a>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>For Business Enquiries</span>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={16} style={{ color: 'var(--primary-light)', marginTop: '4px' }} />
              <span style={{ color: 'var(--footer-text)' }}>Indore, Madhya Pradesh, India</span>
            </li>
          </ul>
        </div>

      </div>

      <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }} />

      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>© 2026 Farming तकनीक (Ashish Morchhale) | All rights reserved.</p>
        <p> <a href="https://sandeepmorchhale.vercel.app">Built in ❤️ Sandeep Morchhale (Click For Your Order )</a></p>
      </div>

      <style>{`
        .social-icon:hover {
          background-color: var(--primary) !important;
          color: #fff !important;
          transform: translateY(-2px);
          transition: var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--primary) !important;
          padding-left: 4px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
