import React from 'react';
import { Apple, Utensils, Coffee, Droplets } from 'lucide-react';

const Diet = ({ user }) => {
  const calculateCalories = () => {
    const { weight, height, age, gender, goals } = user;
    let bmr = 0;
    
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const activityFactor = 1.5; // Moderate activity
    let tdee = bmr * activityFactor;
    
    if (goals.includes('Weight Loss')) tdee -= 500;
    if (goals.includes('Muscle Gain')) tdee += 300;
    
    return Math.round(tdee);
  };

  const dailyCalories = calculateCalories();
  const protein = Math.round((dailyCalories * 0.3) / 4);
  const carbs = Math.round((dailyCalories * 0.4) / 4);
  const fats = Math.round((dailyCalories * 0.3) / 9);

  const mealPlans = {
    breakfast: [
      { name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, fats: 8 },
      { name: 'Greek Yogurt Parfait', calories: 250, protein: 20, carbs: 30, fats: 5 },
      { name: 'Scrambled Eggs with Toast', calories: 350, protein: 25, carbs: 30, fats: 15 }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 400, protein: 35, carbs: 20, fats: 20 },
      { name: 'Quinoa Buddha Bowl', calories: 450, protein: 15, carbs: 60, fats: 15 },
      { name: 'Turkey Wrap', calories: 380, protein: 30, carbs: 40, fats: 12 }
    ],
    dinner: [
      { name: 'Salmon with Vegetables', calories: 450, protein: 40, carbs: 30, fats: 20 },
      { name: 'Lean Beef Stir-fry', calories: 500, protein: 35, carbs: 45, fats: 18 },
      { name: 'Vegetarian Curry', calories: 400, protein: 15, carbs: 60, fats: 15 }
    ],
    snacks: [
      { name: 'Protein Shake', calories: 150, protein: 25, carbs: 10, fats: 3 },
      { name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fats: 16 },
      { name: 'Apple with Peanut Butter', calories: 200, protein: 6, carbs: 25, fats: 10 }
    ]
  };

  return (
    <div className="diet-page">
      <div className="diet-header">
        <h1>Nutrition Plan</h1>
        <p>Personalized diet recommendations based on your goals</p>
      </div>

      <div className="macro-cards">
        <div className="macro-card calories">
          <Apple className="macro-icon" />
          <h3>{dailyCalories}</h3>
          <p>Daily Calories</p>
        </div>
        <div className="macro-card protein">
          <Utensils className="macro-icon" />
          <h3>{protein}g</h3>
          <p>Protein</p>
        </div>
        <div className="macro-card carbs">
          <Coffee className="macro-icon" />
          <h3>{carbs}g</h3>
          <p>Carbohydrates</p>
        </div>
        <div className="macro-card fats">
          <Droplets className="macro-icon" />
          <h3>{fats}g</h3>
          <p>Fats</p>
        </div>
      </div>

      <div className="meal-plans">
        <h2>Recommended Meal Plan</h2>
        {Object.entries(mealPlans).map(([mealType, meals]) => (
          <div key={mealType} className="meal-section">
            <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
            <div className="meal-cards">
              {meals.map((meal, index) => (
                <div key={index} className="meal-card">
                  <h4>{meal.name}</h4>
                  <div className="meal-macros">
                    <span>{meal.calories} cal</span>
                    <span>{meal.protein}g protein</span>
                    <span>{meal.carbs}g carbs</span>
                    <span>{meal.fats}g fats</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hydration-reminder">
        <Droplets className="hydration-icon" />
        <h3>Stay Hydrated!</h3>
        <p>Aim for at least 8 glasses of water per day</p>
      </div>
    </div>
  );
};

export default Diet;