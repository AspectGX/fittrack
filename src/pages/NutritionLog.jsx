import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StatCard from '../components/StatCard.jsx';

const GOALS = {
  Bulk: { multiplier: 1.15, label: 'Caloric Surplus (+15%)' },
  Maintain: { multiplier: 1.0, label: 'Maintenance Calories' },
  Cut: { multiplier: 0.85, label: 'Caloric Deficit (-15%)' },
};

function NutritionLog({ weight, bmi }) {
  const [goal, setGoal] = useState('Maintain');
  const [targetCalories, setTargetCalories] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [log, setLog] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (weight && weight > 0) {
      // Standard BMR estimate using body weight only (Mifflin simplified base)
      // BMR ≈ 22 × weight (kg) as a neutral estimate; apply activity factor of 1.375 (lightly active)
      const bmr = 22 * weight;
      const tdee = Math.round(bmr * 1.375);
      const adjusted = Math.round(tdee * GOALS[goal].multiplier);
      setTargetCalories(adjusted);
    } else {
      setTargetCalories(null);
    }
  }, [weight, goal]);

  const totalConsumed = log.reduce((sum, item) => sum + item.calories, 0);
  const remaining = targetCalories !== null ? targetCalories - totalConsumed : null;

  function handleAddFood(e) {
    e.preventDefault();
    const calories = parseInt(foodCalories, 10);

    if (!foodName.trim()) {
      setFormError('Food name is required.');
      return;
    }
    if (!foodCalories || isNaN(calories) || calories <= 0) {
      setFormError('Please enter a valid calorie amount.');
      return;
    }

    setLog((prev) => [
      ...prev,
      { id: Date.now(), name: foodName.trim(), calories },
    ]);
    setFoodName('');
    setFoodCalories('');
    setFormError('');
  }

  function handleRemoveEntry(id) {
    setLog((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearLog() {
    setLog([]);
  }

  if (!weight) {
    return (
      <section className="page-section">
        <div className="page-header">
          <h1 className="page-title">Calorie Tracker</h1>
        </div>
        <div className="card notice-card">
          <p className="notice-text">
            No weight data detected. Please complete the BMI Calculator on the
            previous page before using the Calorie Tracker.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <h1 className="page-title">Calorie Tracker</h1>
        <p className="page-subtitle">
          Set your dietary goal and log your food intake for the day.
        </p>
      </div>

      {/* Shared props from BMI page */}
      <div className="results-grid">
        <StatCard label="Body Weight (kg)" value={weight} />
        <StatCard label="BMI Score" value={bmi} />
      </div>

      {/* Goal Selector */}
      <div className="card">
        <h2 className="card-title">Dietary Goal</h2>
        <div className="goal-selector">
          {Object.keys(GOALS).map((g) => (
            <button
              key={g}
              type="button"
              className={`goal-btn ${goal === g ? 'goal-btn--active' : ''}`}
              onClick={() => setGoal(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <p className="goal-description">{GOALS[goal].label}</p>
      </div>

      {/* Calorie Targets */}
      {targetCalories !== null && (
        <div className="results-grid">
          <StatCard label="Daily Target (kcal)" value={targetCalories} />
          <StatCard label="Consumed (kcal)" value={totalConsumed} />
          <StatCard
            label="Remaining (kcal)"
            value={remaining < 0 ? `${Math.abs(remaining)} over` : remaining}
          />
        </div>
      )}

      {/* Progress Bar */}
      {targetCalories !== null && (
        <div className="card">
          <div className="progress-header">
            <span className="progress-label">Daily Progress</span>
            <span className="progress-value">
              {totalConsumed} / {targetCalories} kcal
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${totalConsumed > targetCalories ? 'progress-fill--over' : ''}`}
              style={{
                width: `${Math.min((totalConsumed / targetCalories) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="progress-percent">
            {Math.round((totalConsumed / targetCalories) * 100)}% of daily target reached
          </p>
        </div>
      )}

      {/* Food Log Form */}
      <div className="card">
        <h2 className="card-title">Log Food Item</h2>
        <form onSubmit={handleAddFood} className="form form--inline" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="foodName">
              Food Item
            </label>
            <input
              id="foodName"
              type="text"
              className="form-input"
              placeholder="e.g. Grilled Chicken Breast"
              value={foodName}
              onChange={(e) => {
                setFoodName(e.target.value);
                setFormError('');
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="foodCalories">
              Calories (kcal)
            </label>
            <input
              id="foodCalories"
              type="number"
              className="form-input"
              placeholder="e.g. 250"
              value={foodCalories}
              min="1"
              onChange={(e) => {
                setFoodCalories(e.target.value);
                setFormError('');
              }}
            />
          </div>
          {formError && <p className="form-error">{formError}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              Add Entry
            </button>
          </div>
        </form>
      </div>

      {/* Food Log Table */}
      {log.length > 0 && (
        <div className="card">
          <div className="log-header">
            <h2 className="card-title">Food Log</h2>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleClearLog}
            >
              Clear All
            </button>
          </div>
          <table className="log-table">
            <thead>
              <tr>
                <th className="log-th">#</th>
                <th className="log-th">Food Item</th>
                <th className="log-th">Calories (kcal)</th>
                <th className="log-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {log.map((item, index) => (
                <tr key={item.id} className="log-row">
                  <td className="log-td log-td--index">{index + 1}</td>
                  <td className="log-td">{item.name}</td>
                  <td className="log-td log-td--calories">{item.calories}</td>
                  <td className="log-td">
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveEntry(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="log-total-row">
                <td className="log-td" colSpan={2}>
                  Total
                </td>
                <td className="log-td log-td--calories log-td--total">
                  {totalConsumed}
                </td>
                <td className="log-td" />
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
