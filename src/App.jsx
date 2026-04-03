import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import BMICalc from './pages/BMICalc.jsx';
import NutritionLog from './pages/NutritionLog.jsx';

function App() {
  const [weight, setWeight] = useState(null);
  const [bmi, setBmi] = useState(null);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <span className="app-brand">Fitness &amp; Nutrition Tracker</span>
          <nav className="app-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
            >
              BMI Calculator
            </NavLink>
            <NavLink
              to="/calories"
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
            >
              Calorie Tracker
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <BMICalc
                onCalculate={(w, b) => {
                  setWeight(w);
                  setBmi(b);
                }}
              />
            }
          />
          <Route
            path="/calories"
            element={<NutritionLog weight={weight} bmi={bmi} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Academic Project — Fitness &amp; Nutrition Tracker</p>
      </footer>
    </div>
  );
}

export default App;
