import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, TrendingUp, Apple, User } from 'lucide-react';

const MobileNavigation = () => {
  return (
    <nav className="mobile-navigation">
      <NavLink to="/dashboard" className="mobile-nav-link">
        <Home size={24} />
      </NavLink>
      <NavLink to="/workout" className="mobile-nav-link">
        <Dumbbell size={24} />
      </NavLink>
      <NavLink to="/progress" className="mobile-nav-link">
        <TrendingUp size={24} />
      </NavLink>
      <NavLink to="/diet" className="mobile-nav-link">
        <Apple size={24} />
      </NavLink>
      <NavLink to="/profile" className="mobile-nav-link">
        <User size={24} />
      </NavLink>
    </nav>
  );
};

export default MobileNavigation;