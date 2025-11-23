// src/components/Navigation.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, TrendingUp, Apple, User } from 'lucide-react';

const Navigation = () => {
  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '0.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo & Name */}
      <NavLink to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none'
      }}>
        {/* Logo Image (path matches public/images/fitforge-logo.png) */}
        <img 
          src={`${process.env.PUBLIC_URL}/images/fitforge-logo.png`}
          alt="FitForge"
          style={{
            height: '40px', // Adjust size as needed
            width: 'auto',
            display: 'block' // Fixes any inline spacing issues
          }}
        />
        {/* Remove the line below if your logo already has "FITFORGE" text */}
        <span style={{
          color: '#2d3748',
          fontWeight: 'bold',
          fontSize: '1.3rem'
        }}>FitForge</span>
      </NavLink>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {[
          { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
          { name: 'Workout', icon: <Dumbbell size={18} />, path: '/workout' },
          { name: 'Progress', icon: <TrendingUp size={18} />, path: '/progress' },
          { name: 'Diet', icon: <Apple size={18} />, path: '/diet' },
          { name: 'Profile', icon: <User size={18} />, path: '/profile' }
        ].map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: isActive ? '#667eea' : '#2d3748',
              fontWeight: isActive ? 600 : 500
            })}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;