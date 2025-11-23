// src/pages/Onboarding.js
import React, { useState } from 'react';
import { User, Target, Activity, Clock, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    fitnessLevel: '',
    goals: [],
    equipment: [],
    availableTime: '',
    workoutDays: []
  });

  const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const goals = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness'];
  const equipmentOptions = ['None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 'Gym Access'];
  const timeOptions = ['15-30 min', '30-45 min', '45-60 min', '60+ min'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      if (validateData()) {
        onComplete(userData);
        toast.success('Welcome to FitForge! Let’s start your fitness journey.');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateData = () => {
    if (!userData.name || !userData.age || !userData.height || !userData.weight) {
      toast.error('Please fill in all basic information');
      return false;
    }
    if (userData.goals.length === 0) {
      toast.error('Please select at least one fitness goal');
      return false;
    }
    if (userData.workoutDays.length === 0) {
      toast.error('Please select at least one workout day');
      return false;
    }
    return true;
  };

  const toggleArrayItem = (array, item, field) => {
    const newArray = [...userData[field]];
    const index = newArray.indexOf(item);
    if (index > -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(item);
    }
    setUserData({ ...userData, [field]: newArray });
  };

  return (
    <>
      <style>{`
        .onboarding-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .onboarding-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-width: 550px;
          width: 100%;
          padding: 2.5rem;
        }

        .onboarding-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .onboarding-logo {
          height: 50px;
          width: auto;
          margin-bottom: 1rem;
        }

        .onboarding-title {
          font-size: 1.1rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .onboarding-subtitle {
          font-size: 1.8rem;
          color: #2d3748;
          font-weight: 700;
        }

        .progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          width: ${(step / 5) * 100}%;
          transition: width 0.3s ease;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #718096;
          width: 20px;
          height: 20px;
        }

        .form-input {
          width: 100%;
          padding: 0.85rem 1rem;
          padding-left: 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .radio-group {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          color: #2d3748;
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .selection-card {
          padding: 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .selection-card:hover {
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .selection-card.selected {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
        }

        .section-title {
          font-size: 1.2rem;
          margin: 1.5rem 0 1rem;
          color: #2d3748;
          text-align: center;
        }

        .weekdays-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .day-button {
          padding: 0.85rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .day-button:hover {
          border-color: #667eea;
        }

        .day-button.selected {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2.5rem;
        }

        .btn {
          padding: 0.85rem 1.75rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #2d3748;
        }

        .btn-secondary:hover {
          background: #cbd5e0;
        }

        @media (max-width: 480px) {
          .onboarding-card {
            padding: 1.5rem;
          }

          .weekdays-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .radio-group {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="onboarding-container">
        <div className="onboarding-card">
          {/* App Logo & Header */}
          <div className="onboarding-header">
            <img 
              src={`${process.env.PUBLIC_URL}/images/fitforge-logo.png`} 
              alt="FitForge Logo" 
              className="onboarding-logo"
            />
            <p className="onboarding-title">Get Started</p>
            <h2 className="onboarding-subtitle">
              {step === 1 && 'Tell Us About Yourself'}
              {step === 2 && 'Your Fitness Level'}
              {step === 3 && 'Your Fitness Goals'}
              {step === 4 && 'Equipment & Time'}
              {step === 5 && 'Your Workout Schedule'}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          {/* Form Content */}
          <div className="form-group">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div className="input-group">
                  <User className="input-icon" />
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Age"
                    value={userData.age}
                    onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                  <input
                    type="number"
                    placeholder="Height (cm)"
                    value={userData.height}
                    onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={userData.weight}
                  onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                />
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={userData.gender === 'male'}
                      onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                    />
                    <span>Male</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={userData.gender === 'female'}
                      onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </>
            )}

            {/* Step 2: Fitness Level */}
            {step === 2 && (
              <div className="selection-grid">
                {fitnessLevels.map((level) => (
                  <button
                    key={level}
                    className={`selection-card ${userData.fitnessLevel === level ? 'selected' : ''}`}
                    onClick={() => setUserData({ ...userData, fitnessLevel: level })}
                  >
                    <Activity className="card-icon" size={24} />
                    <span>{level}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div className="selection-grid">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    className={`selection-card ${userData.goals.includes(goal) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem(goals, goal, 'goals')}
                  >
                    <Target className="card-icon" size={24} />
                    <span>{goal}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Equipment & Time */}
            {step === 4 && (
              <>
                <h3 className="section-title">Available Equipment</h3>
                <div className="selection-grid">
                  {equipmentOptions.map((equipment) => (
                    <button
                      key={equipment}
                      className={`selection-card ${userData.equipment.includes(equipment) ? 'selected' : ''}`}
                      onClick={() => toggleArrayItem(equipmentOptions, equipment, 'equipment')}
                    >
                      <Dumbbell className="card-icon" size={20} />
                      <span>{equipment}</span>
                    </button>
                  ))}
                </div>

                <h3 className="section-title">Workout Duration</h3>
                <div className="selection-grid">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      className={`selection-card ${userData.availableTime === time ? 'selected' : ''}`}
                      onClick={() => setUserData({ ...userData, availableTime: time })}
                    >
                      <Clock className="card-icon" size={20} />
                      <span>{time}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 5: Workout Days */}
            {step === 5 && (
              <>
                <h3 className="section-title">Select Your Workout Days</h3>
                <div className="weekdays-grid">
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      className={`day-button ${userData.workoutDays.includes(day) ? 'selected' : ''}`}
                      onClick={() => toggleArrayItem(weekDays, day, 'workoutDays')}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="button-group">
            {step > 1 && (
              <button onClick={handleBack} className="btn btn-secondary">
                Back
              </button>
            )}
            <button onClick={handleNext} className="btn btn-primary">
              {step === 5 ? 'Start Your Journey' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;