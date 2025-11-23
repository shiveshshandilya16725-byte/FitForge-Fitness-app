import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import { Award, Activity, Calendar, TrendingUp, Dumbbell } from 'lucide-react'; // Ensure these are imported

const Progress = ({ completedWorkouts, user }) => {
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [bodyPartData, setBodyPartData] = useState([]);

  // Ensure we always operate on an array to avoid runtime errors
  const workouts = Array.isArray(completedWorkouts) ? completedWorkouts : [];

  // ... (Keep all the existing calculation logic for streak, weeklyProgress, bodyPartData) ...
  // NOTE: I am skipping the calculation logic block here for brevity, 
  // but ensure your existing logic for these three states remains EXACTLY the same.
  
  useEffect(() => {
    calculateStreak();
    calculateWeeklyProgress();
    calculateBodyPartDistribution();
  }, [completedWorkouts]);

  const calculateStreak = () => {
    if (!workouts || workouts.length === 0) {
      setStreak(0);
      return;
    }

    const sortedDates = workouts
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
      const dayWorkouts = workouts.filter(w => {
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
    workouts.forEach(workout => {
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


  const stats = [
    {
      title: 'Current Streak',
      value: `${streak} days`,
      icon: <Award className="stat-icon" />,
      color: 'purple'
    },
    {
      title: 'Total Workouts',
      value: workouts.length,
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
      value: workouts.reduce((sum, w) => sum + (w.calories || 0), 0),
      icon: <TrendingUp className="stat-icon" />,
      color: 'orange'
    }
  ];

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>Your Progress Hub</h1>
        <p>Visualizing your dedication and improvement over time.</p>
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

      <div className="charts-container">
        <div className="chart-card progress-chart-card">
          <h2>Weekly Activity</h2>
          {weeklyProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyProgress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="var(--gray)" />
                <YAxis allowDecimals={false} stroke="var(--gray)" />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #ccc', 
                        padding: '10px' 
                    }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="workouts" stroke="#667eea" name="Workouts" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="calories" stroke="#48bb78" name="Calories Burned" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">Complete a workout to start tracking your weekly activity!</p>
          )}
        </div>

        <div className="chart-card body-dist-card">
          <h2>Body Part Distribution</h2>
          {bodyPartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bodyPartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // Makes it a donut chart for better look
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bodyPartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value, name, props) => [`${value} Exercises`, props.payload.name]}
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #ccc', 
                        padding: '10px' 
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
          <div className="empty-chart-placeholder">
            <Dumbbell className="placeholder-icon" />
            <p>Start completing routines to see which muscle groups you are training the most!</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;