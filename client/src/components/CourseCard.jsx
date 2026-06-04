import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, PlayCircle, BookOpen, Star, ArrowRight } from 'lucide-react';

const CourseCard = ({ course, isEnrolled }) => {
  const { _id, title, subtitle, thumbnail, price, originalPrice, duration, features } = course;
  
  // Calculate discount percentage
  const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const courseLink = `/course/${_id}`;

  return (
    <div className="premium-card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Thumbnail area */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
          className="card-img"
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="badge badge-green">
            <BookOpen size={12} />
            Farming
          </span>
          {discount > 0 && (
            <span className="badge badge-yellow">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--primary-dark)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', flexGrow: 1 }}>
          {subtitle}
        </p>

        {/* Quick specs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} style={{ color: 'var(--primary-light)' }} />
            {duration}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PlayCircle size={14} style={{ color: 'var(--primary-light)' }} />
            {course.modules?.length || 0} Modules
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} style={{ color: 'var(--accent-yellow)', fill: 'var(--accent-yellow)' }} />
            4.9 (1.9k)
          </span>
        </div>

        {/* Price and Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                ₹{price}
              </span>
              {originalPrice && (
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{originalPrice}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase' }}>
              One-Time Payment
            </span>
          </div>

          {isEnrolled ? (
            <Link
              to="/dashboard"
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Resume Learning
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              to={courseLink}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'var(--primary-light)', color: 'var(--primary)' }}
            >
              Start Learning
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .premium-card:hover .card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default CourseCard;
