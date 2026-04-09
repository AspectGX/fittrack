/*
=== REACT CONCEPTS USED IN THIS PROJECT ===

1. REACT JSX & COMPONENTS
   - JSX is HTML-like syntax written inside JavaScript (every return() block uses JSX)
   - App.jsx: Functional component — the root of the app, contains header, nav, routes, footer
   - BMICalc.jsx: Class component — BMI calculator with form, calculates BMI from weight/height
   - NutritionLog.jsx: Functional component — calorie tracker, logs food items, shows stats
   - StatCard.jsx: Functional component — reusable card that displays a label and a value
   - Conditional rendering: {bmi !== null && <div>...</div>} shows elements only when condition is true
   - List rendering: .map() is used to render arrays as JSX elements (scale rows, goal buttons, food log)

2. COMPONENT API & CONSTRUCTORS
   - BMICalc.jsx uses a class component with constructor(props) and super(props)
   - constructor initializes this.state = { weight: '', height: '', bmi: null, ... }
   - this.handleChange = this.handleChange.bind(this) binds methods so 'this' works in event handlers
   - this.setState({ bmi, category }) updates state and triggers re-render
   - render() method returns the JSX that gets displayed on screen

3. REACT DATAFLOW (One-way data flow)
   - Parent-to-child (props): App passes weight and bmi as props to NutritionLog
   - Child-to-parent (callbacks): App passes handleCalculate function as onCalculate prop to BMICalc
   - BMICalc calls this.props.onCalculate(weight, bmi) to send calculated data back up to App
   - App stores it in state via useState, then passes it down to NutritionLog as props
   - Flow: BMICalc → (callback) → App (state) → (props) → NutritionLog

4. PROPS VALIDATION
   - StatCard.jsx: PropTypes.string.isRequired for label, PropTypes.oneOfType for value, defaultProps for color
   - BMICalc.jsx: PropTypes.func.isRequired for onCalculate callback
   - NutritionLog.jsx: PropTypes.number for weight and bmi, defaultProps sets them to null

5. STYLING IN REACT
   - External CSS: App.css is imported in main.jsx, styles applied via className="card", className="btn-primary" etc.
   - Inline styles: StatCard.jsx uses style={{ color: color, fontSize: '1.5rem' }} directly on JSX elements
   - Dynamic className: NavLink uses className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}

6. HOOKS & ROUTING
   - useState (App.jsx): const [weight, setWeight] = useState(null) — stores data that changes over time
   - useState (NutritionLog.jsx): manages goal, foodName, foodCalories, log array, error
   - useEffect (NutritionLog.jsx): recalculates target calories whenever weight or goal changes
   - BrowserRouter (main.jsx): wraps the app to enable URL-based navigation
   - Routes + Route (App.jsx): maps URL paths "/" and "/calories" to BMICalc and NutritionLog components
   - NavLink (App.jsx): navigation links that automatically highlight the active page
   - Navigate (App.jsx): redirects any unknown URL to the home page
*/

import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import BMICalc from './pages/BMICalc.jsx';
import NutritionLog from './pages/NutritionLog.jsx';

function App() {
  const [weight, setWeight] = useState(null);
  const [bmi, setBmi] = useState(null);

  function handleCalculate(w, b) {
    setWeight(w);
    setBmi(b);
  }

  return (
    <div className="app">
      <header className="header">
        <h2>Fitness Tracker</h2>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            BMI Calculator
          </NavLink>
          <NavLink to="/calories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Calorie Tracker
          </NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<BMICalc onCalculate={handleCalculate} />} />
          <Route path="/calories" element={<NutritionLog weight={weight} bmi={bmi} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Fitness Tracker</p>
      </footer>
    </div>
  );
}

export default App;
