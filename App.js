import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation'; // Top Nav (for Desktop)
import MobileNavigation from './components/MobileNavigation'; // NEW: Bottom Nav (for Mobile)
import Onboarding from './pages/Onboarding';
import './App.css';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkoutPlanner = lazy(() => import('./pages/WorkoutPlanner'));
const Progress = lazy(() => import('./pages/Progress'));
const Diet = lazy(() => import('./pages/Diet'));
const Profile = lazy(() => import('./pages/Profile'));


// --- Utility Hook for Mobile Detection ---
// This hook detects screen width to switch navigation bars
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

function App() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const { width } = useWindowSize();
  
  // Set breakpoint: if width is <= 900px, treat as mobile
  const isMobile = width <= 900; 

  // Load data from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fitnessUser');
    const savedWorkouts = localStorage.getItem('workouts');
    const savedCompleted = localStorage.getItem('completedWorkouts');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedCompleted) setCompletedWorkouts(JSON.parse(savedCompleted));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem('fitnessUser', JSON.stringify(user));
    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
  }, [user, workouts, completedWorkouts]);

  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" />
        
        {/* Render appropriate navigation based on screen size */}
        {isMobile ? <MobileNavigation /> : <Navigation />}

        <main className={`main-content ${isMobile ? 'mobile-padding' : ''}`}>
          <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    user={user} 
                    workouts={workouts}
                    completedWorkouts={completedWorkouts}
                  />
                } 
              />
              <Route 
                path="/workout" 
                element={
                  <WorkoutPlanner 
                    user={user}
                    workouts={workouts}
                    setWorkouts={setWorkouts}
                    setCompletedWorkouts={setCompletedWorkouts}
                  />
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <Progress 
                    completedWorkouts={completedWorkouts}
                    user={user}
                  />
                } 
              />
              <Route 
                path="/diet" 
                element={<Diet user={user} />} 
              />
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    user={user} 
                    setUser={setUser}
                  />
                } 
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;