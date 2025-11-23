import React, { useState, useEffect } from 'react';
import { Activity, Target, TrendingUp, Calendar, Award, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = ({ user, workouts, completedWorkouts }) => {
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [bodyPartData, setBodyPartData] = useState([]);
  const [todayWorkout, setTodayWorkout] = useState(null);

  useEffect(() => {
    calculateStreak();
    calculateWeeklyProgress();
    calculateBodyPartDistribution();
    getTodayWorkout();
    checkNotification();
  }, [completedWorkouts, workouts]);

  const calculateStreak = () => {
    if (!completedWorkouts || completedWorkouts.length === 0) {
      setStreak(0);
      return;
    }

    const sortedDates = completedWorkouts
      .map(w => new Date(w.date))
      .sort((a, b) => b - a);

    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const workoutDate = new Date(sortedDates[i]);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const calculateWeeklyProgress = () => {
    const weekStart = startOfWeek(new Date());
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayWorkouts = completedWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate.toDateString() === day.toDateString();
      });

      weekData.push({
        day: format(day, 'EEE'),
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0)
      });
    }

    setWeeklyProgress(weekData);
  };

  const calculateBodyPartDistribution = () => {
    const bodyParts = {};
    completedWorkouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach(exercise => {
          const part = exercise.bodyPart || 'Other';
          bodyParts[part] = (bodyParts[part] || 0) + 1;
        });
      }
    });

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const data = Object.keys(bodyParts).map((part, index) => ({
      name: part,
      value: bodyParts[part],
      color: colors[index % colors.length]
    }));

    setBodyPartData(data);
  };

  const getTodayWorkout = () => {
    const today = format(new Date(), 'EEE');
    const todayPlan = workouts.find(w => w.day === today);
    setTodayWorkout(todayPlan);
  };

  const checkNotification = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour === 8 || hour === 18) { // Morning or evening reminder
      const today = format(new Date(), 'EEE');
      if (user.workoutDays.includes(today)) {
        const todayCompleted = completedWorkouts.some(w => {
          const workoutDate = new Date(w.date);
          return isToday(workoutDate);
        });

        if (!todayCompleted) {
          toast('Time for your workout! 💪', {
            icon: '🏋️',
            duration: 5000,
          });
        }
      }
    }
  };

  const stats = [
    {
      title: 'Current Streak',
      value: `${streak} days`,
      icon: <Award className="stat-icon" />,
      color: 'purple'
    },
    {
      title: 'Total Workouts',
      value: completedWorkouts.length,
      icon: <Activity className="stat-icon" />,
      color: 'blue'
    },
    {
      title: 'This Week',
      value: weeklyProgress.reduce((sum, day) => sum + day.workouts, 0),
      icon: <Calendar className="stat-icon" />,
      color: 'green'
    },
    {
      title: 'Calories Burned',
      value: completedWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
      icon: <TrendingUp className="stat-icon" />,
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back to FitForge, {user.name}! 👋</h1>
        <p>Here's your fitness journey at a glance</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            {stat.icon}
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {todayWorkout && (
        <div className="today-workout-card">
          <div className="card-header">
            <h2>Today's Workout</h2>
            <Clock className="header-icon" />
          </div>
          <div className="workout-preview">
            <h3>{todayWorkout.name}</h3>
            <p>{todayWorkout.exercises?.length || 0} exercises • {todayWorkout.duration || '30'} minutes</p>
            <button className="btn btn-primary">Start Workout</button>
          </div>
        </div>
      )}

      <div className="charts-container">
        <div className="chart-card">
          <h2>Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="workouts" stroke="#8884d8" name="Workouts" />
              <Line type="monotone" dataKey="calories" stroke="#82ca9d" name="Calories" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Body Part Distribution</h2>
          {bodyPartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bodyPartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bodyPartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">Start completing workouts to see your progress!</p>
          )}
        </div>
      </div>

      <div className="motivation-card">
        <h2>💪 Keep Going!</h2>
        <p>You're on a {streak} day streak! Don't break the chain!</p>
      </div>
    </div>
  );
};

export default Dashboard;