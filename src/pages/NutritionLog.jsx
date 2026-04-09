import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StatCard from '../components/StatCard.jsx';

function NutritionLog({ weight, bmi }) {
  const [goal, setGoal] = useState('Maintain');
  const [targetCalories, setTargetCalories] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [log, setLog] = useState([]);
  const [error, setError] = useState('');

  const goals = {
    Bulk: 1.15,
    Maintain: 1.0,
    Cut: 0.85,
  };

  useEffect(() => {
    if (weight && weight > 0) {
      const bmr = 22 * weight;
      const tdee = Math.round(bmr * 1.375);
      const adjusted = Math.round(tdee * goals[goal]);
      setTargetCalories(adjusted);
    } else {
      setTargetCalories(null);
    }
  }, [weight, goal]);

  const totalConsumed = log.reduce((sum, item) => sum + item.calories, 0);

  function handleAddFood(e) {
    e.preventDefault();
    const cal = parseInt(foodCalories);
    if (!foodName.trim()) { setError('Enter food name.'); return; }
    if (!cal || cal <= 0) { setError('Enter valid calories.'); return; }
    setLog([...log, { id: Date.now(), name: foodName.trim(), calories: cal }]);
    setFoodName('');
    setFoodCalories('');
    setError('');
  }

  function handleRemove(id) {
    setLog(log.filter((item) => item.id !== id));
  }

  if (!weight) {
    return (
      <section className="page">
        <h1>Calorie Tracker</h1>
        <div className="card">
          <p>Please complete the BMI Calculator first.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Calorie Tracker</h1>
      <p className="subtitle">Log your food and track daily calories.</p>

      <div className="results">
        <StatCard label="Weight (kg)" value={weight} />
        <StatCard label="BMI" value={bmi} color="#0ea5e9" />
      </div>

      <div className="card">
        <h3>Select Goal</h3>
        <div className="goal-buttons">
          {Object.keys(goals).map((g) => (
            <button
              key={g}
              className={goal === g ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setGoal(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {targetCalories && (
        <div className="results">
          <StatCard label="Target (kcal)" value={targetCalories} />
          <StatCard label="Consumed (kcal)" value={totalConsumed} color="#f59e0b" />
          <StatCard
            label="Remaining (kcal)"
            value={targetCalories - totalConsumed}
            color={totalConsumed > targetCalories ? '#ef4444' : '#10b981'}
          />
        </div>
      )}

      <div className="card">
        <h3>Add Food</h3>
        <form onSubmit={handleAddFood} className="food-form">
          <input
            type="text"
            placeholder="Food name"
            value={foodName}
            onChange={(e) => { setFoodName(e.target.value); setError(''); }}
          />
          <input
            type="number"
            placeholder="Calories"
            value={foodCalories}
            onChange={(e) => { setFoodCalories(e.target.value); setError(''); }}
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {log.length > 0 && (
        <div className="card">
          <h3>Food Log</h3>
          <table className="log-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Food</th>
                <th>Calories</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {log.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.calories}</td>
                  <td>
                    <button className="btn-remove" onClick={() => handleRemove(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Total</strong></td>
                <td><strong>{totalConsumed}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}

NutritionLog.propTypes = {
  weight: PropTypes.number,
  bmi: PropTypes.number,
};

NutritionLog.defaultProps = {
  weight: null,
  bmi: null,
};

export default NutritionLog;
