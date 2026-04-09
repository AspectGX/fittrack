import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StatCard from '../components/StatCard.jsx';

class BMICalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: '',
      height: '',
      bmi: null,
      category: '',
      error: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  }

  getCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  handleCalculate(e) {
    e.preventDefault();
    const w = parseFloat(this.state.weight);
    const h = parseFloat(this.state.height);

    if (!w || w <= 0 || !h || h <= 0) {
      this.setState({ error: 'Please enter valid weight and height.' });
      return;
    }

    const heightM = h / 100;
    const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));
    const category = this.getCategory(bmi);

    this.setState({ bmi, category, error: '' });
    this.props.onCalculate(w, bmi);
  }

  handleReset() {
    this.setState({ weight: '', height: '', bmi: null, category: '', error: '' });
    this.props.onCalculate(null, null);
  }

  render() {
    const { weight, height, bmi, category, error } = this.state;

    return (
      <section className="page">
        <h1>BMI Calculator</h1>
        <p className="subtitle">Enter your weight and height to calculate BMI.</p>

        <div className="card">
          <form onSubmit={this.handleCalculate}>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="e.g. 70"
                value={weight}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                placeholder="e.g. 175"
                value={height}
                onChange={this.handleChange}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <div className="buttons">
              <button type="submit" className="btn-primary">Calculate</button>
              {bmi !== null && (
                <button type="button" className="btn-secondary" onClick={this.handleReset}>
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {bmi !== null && (
          <div className="results">
            <StatCard label="Your BMI" value={bmi} />
            <StatCard label="Category" value={category} color="#10b981" />
            <StatCard label="Weight (kg)" value={parseFloat(weight)} color="#0ea5e9" />
          </div>
        )}

        {bmi !== null && (
          <div className="card">
            <h3>BMI Scale</h3>
            {[
              { range: 'Below 18.5', label: 'Underweight' },
              { range: '18.5 – 24.9', label: 'Normal' },
              { range: '25.0 – 29.9', label: 'Overweight' },
              { range: '30.0+', label: 'Obese' },
            ].map((row) => (
              <div
                key={row.label}
                className={`scale-row ${category === row.label ? 'scale-active' : ''}`}
              >
                <span>{row.range}</span>
                <span>{row.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
}

BMICalc.propTypes = {
  onCalculate: PropTypes.func.isRequired,
};

export default BMICalc;
