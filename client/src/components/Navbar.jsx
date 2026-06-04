import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Award, Sun, Moon } from 'lucide-react';

const Navbar = ({ user, onLogout, theme, onToggleTheme, courses = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const getShortName = (title) => {
    if (title.includes('Capsicum') || title.includes('Chilli') || title.includes('Chili')) return 'Chilli Course';
    if (title.includes('Tomato')) return 'Tomato Course';
    if (title.includes('Business') || title.includes('Start')) return 'Start Farming';
    return title.replace(' Cultivation Masterclass', '').replace(' Masterclass', '');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...courses.map(c => ({
      name: getShortName(c.title),
      path: `/course/${c._id}`
    }))
  ];

  // Helper to check active tab
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'var(--transition-normal)',
        padding: scrolled ? '12px 0' : '20px 0',
      }}
      className={`glass-panel ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🌱</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary-dark)' }}>
              Farming Taknik
            </h3>
            {/* <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginTop: '-4px' }}>
              Indian Farmer Clone
            </span> */}
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '30px' }} className="desktop-menu-container">
          <ul style={{ display: 'flex', listStyle: 'none', gap: '24px', alignItems: 'center', margin: 0 }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: isActive(link.path) ? 'var(--primary)' : 'var(--text-color)',
                    borderBottom: isActive(link.path) ? '2px solid var(--primary)' : '2px solid transparent',
                    paddingBottom: '4px',
                  }}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme Switcher Toggle */}
            <button
              onClick={onToggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                backgroundColor: 'var(--secondary)',
                transition: 'var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)'
              }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              id="theme-toggle-btn"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} style={{ color: 'var(--accent-yellow)' }} />}
            </button>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary-dark)',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  id="user-menu-btn"
                >
                  <User size={16} />
                  <span>Hi, {user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'var(--transition-fast)' }} />
                </button>
                {dropdownOpen && (
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '200px',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      overflow: 'hidden',
                      animation: 'fadeInUp 0.2s ease',
                      border: '1px solid var(--primary-accent)',
                      padding: '8px 0',
                      backgroundColor: 'var(--bg-white)',
                    }}
                  >
                    <Link
                      to="/dashboard"
                      style={{ display: 'block', padding: '10px 16px', fontWeight: 500, fontSize: '0.9rem' }}
                      id="dropdown-dashboard-link"
                    >
                      My Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        style={{ display: 'block', padding: '10px 16px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}
                        id="dropdown-admin-link"
                      >
                        Admin Suite
                      </Link>
                    )}
                    <hr style={{ border: 'none', borderBottom: '1px solid rgba(0,0,0,0.06)', margin: '6px 0' }} />
                    <button
                      onClick={handleLogoutClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                      }}
                      id="dropdown-logout-btn"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary)' }}
                  id="nav-login-btn"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                  id="nav-register-btn"
                >
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', background: 'none', color: 'var(--primary-dark)', cursor: 'pointer' }}
          className="mobile-menu-toggle"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '20px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'var(--bg-white)',
            borderBottom: '2px solid var(--primary-light)',
          }}
          id="mobile-drawer"
        >
          <ul style={{ display: 'flex', flexDirection: 'column', listStyle: 'none', gap: '14px', margin: 0, padding: 0 }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: isActive(link.path) ? 'var(--primary)' : 'var(--text-color)',
                    display: 'block',
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <hr style={{ border: 'none', borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Mobile Theme Switcher Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-color)' }}>Theme Mode</span>
              <button
                onClick={onToggleTheme}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--primary-dark)',
                  backgroundColor: 'var(--secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
                id="theme-toggle-mobile"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={16} />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun size={16} style={{ color: 'var(--accent-yellow)' }} />
                    Light Mode
                  </>
                )}
              </button>
            </div>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', fontWeight: 600, paddingBottom: '4px' }}>
                  <User size={18} />
                  <span>Logged in as: {user.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="btn btn-secondary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px' }}
                >
                  My Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="btn btn-primary"
                    style={{ width: '100%', textAlign: 'center', padding: '10px', backgroundColor: 'var(--primary-dark)' }}
                  >
                    Admin Suite
                  </Link>
                )}
                <button
                  onClick={handleLogoutClick}
                  className="btn"
                  style={{ width: '100%', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', display: 'flex', justifyContent: 'center', gap: '8px' }}
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px' }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px' }}
                >
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Responsive Inline CSS Helper */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-menu-container {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
