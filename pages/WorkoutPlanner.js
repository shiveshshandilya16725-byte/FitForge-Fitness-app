import React, { useState, useEffect } from 'react';
import { Plus, Play, Check, X, Clock, Dumbbell } from 'lucide-react';
import { exerciseDatabase } from '../data/exercises';
import toast from 'react-hot-toast';

const WorkoutPlanner = ({ user, workouts, setWorkouts, setCompletedWorkouts }) => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeExercise, setActiveExercise] = useState(0);
  const [timer, setTimer] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  useEffect(() => {
    const dayWorkout = workouts.find(w => w.day === selectedDay);
    setCurrentWorkout(dayWorkout);
  }, [selectedDay, workouts]);

  useEffect(() => {
    let interval;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && isPlaying) {
      handleExerciseComplete();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const generateWorkoutPlan = () => {
    const { fitnessLevel, goals, equipment, availableTime } = user;
    
    // Filter exercises based on user criteria
    let suitableExercises = exerciseDatabase.filter(ex => {
      const levelMatch = ex.difficulty === fitnessLevel.toLowerCase() || 
                         ex.difficulty === 'all';
      const equipmentMatch = equipment.includes(ex.equipment) || 
                             ex.equipment === 'None';
      const goalMatch = goals.some(goal => ex.targetGoals.includes(goal));
      
      return levelMatch && equipmentMatch && goalMatch;
    });

    // Determine number of exercises based on time
    let exerciseCount = 4;
    if (availableTime === '15-30 min') exerciseCount = 4;
    else if (availableTime === '30-45 min') exerciseCount = 6;
    else if (availableTime === '45-60 min') exerciseCount = 8;
    else exerciseCount = 10;

    // Select random exercises ensuring variety
    const selectedExercises = [];
    const bodyParts = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
    
    bodyParts.forEach(part => {
      const partExercises = suitableExercises.filter(ex => ex.bodyPart === part);
      if (partExercises.length > 0 && selectedExercises.length < exerciseCount) {
        const randomEx = partExercises[Math.floor(Math.random() * partExercises.length)];
        selectedExercises.push({
          ...randomEx,
          sets: fitnessLevel === 'Beginner' ? 3 : fitnessLevel === 'Intermediate' ? 4 : 5,
          reps: randomEx.reps || 12,
          rest: 60
        });
      }
    });

    // Fill remaining slots if needed
    while (selectedExercises.length < exerciseCount && suitableExercises.length > 0) {
      const randomEx = suitableExercises[Math.floor(Math.random() * suitableExercises.length)];
      if (!selectedExercises.find(ex => ex.id === randomEx.id)) {
        selectedExercises.push({
          ...randomEx,
          sets: fitnessLevel === 'Beginner' ? 3 : 4,
          reps: randomEx.reps || 12,
          rest: 60
        });
      }
    }

    const workout = {
      id: Date.now(),
      day: selectedDay,
      name: `${selectedDay} - ${goals[0]} Focus`,
      exercises: selectedExercises,
      duration: availableTime.split(' ')[0].split('-')[1] || 30,
      difficulty: fitnessLevel
    };

    setGeneratedPlan(workout);
    return workout;
  };

  const saveWorkout = (workout) => {
    const updatedWorkouts = workouts.filter(w => w.day !== selectedDay);
    updatedWorkouts.push(workout);
    setWorkouts(updatedWorkouts);
    setCurrentWorkout(workout);
    setIsCreating(false);
    setGeneratedPlan(null);
    toast.success('Workout saved successfully!');
  };

  const startWorkout = () => {
    if (!currentWorkout || !currentWorkout.exercises || currentWorkout.exercises.length === 0) {
      toast.error('No exercises in this workout!');
      return;
    }
    setIsPlaying(true);
    setActiveExercise(0);
    setTimer(currentWorkout.exercises[0].duration || 30);
  };

  const handleExerciseComplete = () => {
    if (activeExercise < currentWorkout.exercises.length - 1) {
      setActiveExercise(activeExercise + 1);
      setTimer(currentWorkout.exercises[activeExercise + 1].duration || 30);
      toast.success('Exercise completed! Moving to next.');
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    setIsPlaying(false);
    const completed = {
      ...currentWorkout,
      date: new Date().toISOString(),
      calories: calculateCalories()
    };
    
    setCompletedWorkouts(prev => [...prev, completed]);
    toast.success('🎉 Workout completed! Great job!');
    setActiveExercise(0);
  };

  const calculateCalories = () => {
    const duration = parseInt(currentWorkout.duration) || 30;
    const intensity = currentWorkout.difficulty === 'Beginner' ? 5 : 
                     currentWorkout.difficulty === 'Intermediate' ? 7 : 9;
    return Math.round(duration * intensity);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workout-planner">
      <div className="planner-header">
        <h1>Workout Planner</h1>
        <p>Create and manage your personalized workout routines</p>
      </div>

      <div className="day-selector">
        {user.workoutDays.map(day => (
          <button
            key={day}
            className={`day-tab ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
            {workouts.some(w => w.day === day) && <Check className="day-check" />}
          </button>
        ))}
      </div>

      {!currentWorkout && !isCreating ? (
        <div className="empty-workout">
          <Dumbbell className="empty-icon" />
          <h2>No workout planned for {selectedDay}</h2>
          <p>Let's create a personalized workout for this day!</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <Plus /> Create Workout
          </button>
        </div>
      ) : isCreating ? (
        <div className="workout-creator">
          <h2>Generate Workout for {selectedDay}</h2>
          <div className="creator-content">
            {!generatedPlan ? (
              <div className="generator-options">
                <p>Based on your profile:</p>
                <ul className="profile-summary">
                  <li>Fitness Level: {user.fitnessLevel}</li>
                  <li>Goals: {user.goals.join(', ')}</li>
                  <li>Available Time: {user.availableTime}</li>
                  <li>Equipment: {user.equipment.join(', ')}</li>
                </ul>
                <button 
                  className="btn btn-primary"
                  onClick={generateWorkoutPlan}
                >
                  Generate Personalized Plan
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="generated-plan">
                <h3>{generatedPlan.name}</h3>
                <p className="plan-meta">
                  {generatedPlan.exercises.length} exercises • {generatedPlan.duration} minutes
                </p>
                <div className="exercise-list">
                  {generatedPlan.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <div className="exercise-number">{index + 1}</div>
                      <div className="exercise-details">
                        <h4>{exercise.name}</h4>
                        <p>{exercise.sets} sets × {exercise.reps} reps</p>
                        <p className="exercise-meta">
                          {exercise.bodyPart} • {exercise.equipment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="plan-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => saveWorkout(generatedPlan)}
                  >
                    Save Workout
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={generateWorkoutPlan}
                  >
                    Regenerate
                  </button>
                  <button 
                    className="btn btn-ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setGeneratedPlan(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="workout-display">
          {!isPlaying ? (
            <>
              <div className="workout-header">
                <h2>{currentWorkout.name}</h2>
                <div className="workout-meta">
                  <Clock /> {currentWorkout.duration} min
                  <span className="difficulty-badge">{currentWorkout.difficulty}</span>
                </div>
              </div>
              <div className="exercise-list">
                {currentWorkout.exercises?.map((exercise, index) => (
                  <div key={index} className="exercise-card">
                    <div className="exercise-number">{index + 1}</div>
                    <div className="exercise-info">
                      <h3>{exercise.name}</h3>
                      <p>{exercise.sets} sets × {exercise.reps} reps</p>
                      <p className="exercise-tips">{exercise.bodyPart} • {exercise.equipment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="workout-actions">
                <button className="btn btn-primary" onClick={startWorkout}>
                  <Play /> Start Workout
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setCurrentWorkout(null);
                    setWorkouts(workouts.filter(w => w.day !== selectedDay));
                  }}
                >
                  Delete Workout
                </button>
              </div>
            </>
          ) : (
            <div className="workout-player">
              <h2>Workout in Progress</h2>
              <div className="current-exercise">
                <h3>{currentWorkout.exercises[activeExercise].name}</h3>
                <div className="timer-display">{formatTime(timer)}</div>
                <p className="exercise-instruction">
                  {currentWorkout.exercises[activeExercise].sets} sets × {currentWorkout.exercises[activeExercise].reps} reps
                </p>
              </div>
              <div className="progress-tracker">
                <p>Exercise {activeExercise + 1} of {currentWorkout.exercises.length}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((activeExercise + 1) / currentWorkout.exercises.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="player-controls">
                <button 
                  className="btn btn-primary"
                  onClick={handleExerciseComplete}
                >
                  Next Exercise
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveExercise(0);
                  }}
                >
                  <X /> Stop Workout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;