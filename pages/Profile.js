import React, { useState } from 'react';
import { User, Calendar, Target, Dumbbell, Clock, Scale, Ruler, Edit, Check, X, HeartPulse } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Sub-Component for Displaying Information Blocks ---
const ProfileDetail = ({ icon: Icon, title, value, color = 'text-primary' }) => (
  <div className="profile-detail-item">
    <Icon className={`detail-icon ${color}`} />
    <div>
      <p className="detail-title">{title}</p>
      <p className="detail-value">{value}</p>
    </div>
  </div>
);

// --- Sub-Component for Editing (Reusing Onboarding logic for simplicity) ---
// NOTE: For a full app, you would link this component back to the Onboarding step logic, 
// but here we simplify by re-using the structure and allowing basic edit/save.
const ProfileEditor = ({ user, setUser, onClose }) => {
    const [editData, setEditData] = useState({ ...user });
    
    const handleToggleArray = (arrayField, item) => {
        const newArray = [...editData[arrayField]];
        const index = newArray.indexOf(item);
        if (index > -1) {
            newArray.splice(index, 1);
        } else {
            newArray.push(item);
        }
        setEditData({ ...editData, [arrayField]: newArray });
    };

    const handleSave = () => {
        // Basic validation before saving
        if (!editData.name || !editData.weight || !editData.goals.length) {
            toast.error("Name, Weight, and Goals are required fields.");
            return;
        }
        
        // Update user state globally
        setUser(editData);
        toast.success('Profile updated successfully!');
        onClose();
    };

    const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const goalsOptions = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness'];
    const equipmentOptions = ['None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 'Gym Access'];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    return (
        <div className="profile-editor-modal">
            <h3>Edit Profile Settings</h3>
            
            <label>Name:</label>
            <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />

            <label>Weight (kg):</label>
            <input type="number" value={editData.weight} onChange={(e) => setEditData({...editData, weight: e.target.value})} />

            <label>Fitness Level:</label>
            <div className="edit-radios">
                {fitnessLevels.map(level => (
                    <button 
                        key={level} 
                        className={`edit-level-btn ${editData.fitnessLevel === level ? 'selected' : ''}`}
                        onClick={() => setEditData({...editData, fitnessLevel: level})}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <label>Goals:</label>
            <div className="edit-toggles">
                {goalsOptions.map(goal => (
                    <button 
                        key={goal} 
                        className={`edit-toggle-btn ${editData.goals.includes(goal) ? 'selected' : ''}`}
                        onClick={() => handleToggleArray('goals', goal)}
                    >
                        {goal}
                    </button>
                ))}
            </div>

            <label>Workout Days:</label>
            <div className="edit-toggles">
                {weekDays.map(day => (
                    <button 
                        key={day} 
                        className={`edit-toggle-btn ${editData.workoutDays.includes(day) ? 'selected' : ''}`}
                        onClick={() => handleToggleArray('workoutDays', day)}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="editor-actions">
                <button className="btn btn-primary" onClick={handleSave}><Check size={18}/> Save Changes</button>
                <button className="btn btn-secondary" onClick={onClose}><X size={18}/> Cancel</button>
            </div>
        </div>
    );
};


// --- Main Profile Component ---
const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
        <ProfileEditor 
            user={user} 
            setUser={setUser} 
            onClose={() => setIsEditing(false)} 
        />
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src="/logo.svg" alt="FitForge Logo" className="profile-logo" />
        <h1>{user.name}'s Profile</h1>
        <button className="btn btn-secondary edit-btn" onClick={() => setIsEditing(true)}>
            <Edit size={18} /> Edit Profile
        </button>
      </div>

      <div className="profile-grid">
        
        {/* Section 1: Physical Stats */}
        <div className="profile-card stats-card">
            <h2>Physical Metrics</h2>
            <ProfileDetail icon={Scale} title="Current Weight" value={`${user.weight} kg`} color="text-orange-500" />
            <ProfileDetail icon={Ruler} title="Height" value={`${user.height} cm`} color="text-cyan-500" />
            <ProfileDetail icon={HeartPulse} title="Age / Gender" value={`${user.age} / ${user.gender}`} color="text-red-500" />
        </div>

        {/* Section 2: Fitness Settings */}
        <div className="profile-card settings-card">
            <h2>Fitness Settings</h2>
            <ProfileDetail icon={Target} title="Primary Goal" value={user.goals.join(', ')} color="text-green-500" />
            <ProfileDetail icon={Dumbbell} title="Fitness Level" value={user.fitnessLevel} color="text-purple-500" />
            <ProfileDetail icon={Clock} title="Time Available" value={user.availableTime} color="text-blue-500" />
        </div>
        
        {/* Section 3: Schedule & Equipment */}
        <div className="profile-card schedule-card full-width">
            <h2>Schedule & Access</h2>
            <ProfileDetail icon={Calendar} title="Workout Days" value={user.workoutDays.join(', ')} color="text-yellow-500" />
            <ProfileDetail icon={Dumbbell} title="Equipment Owned" value={user.equipment.join(', ')} color="text-indigo-500" />
        </div>

      </div>
    </div>
  );
};

export default Profile;