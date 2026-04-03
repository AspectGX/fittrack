import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StatCard from '../components/StatCard.jsx';

class BMICalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: '',
      height: '',
      heightUnit: 'cm',
      bmi: null,
      category: '',
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleUnitToggle = this.handleUnitToggle.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  }

  handleUnitToggle(unit) {
    this.setState({ heightUnit: unit, height: '', error: '' });
  }

  getCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal Weight';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
  }

  handleCalculate(e) {
    e.preventDefault();
    const weight = parseFloat(this.state.weight);
    const heightRaw = parseFloat(this.state.height);

    if (!weight || !heightRaw || weight <= 0 || heightRaw <= 0) {
      this.setState({ error: 'Please enter valid positive values for weight and height.' });
      return;
    }

    const heightCm = this.state.heightUnit === 'in' ? heightRaw * 2.54 : heightRaw;
    const heightInMeters = heightCm / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    const category = this.getCategory(bmi);

    this.setState({ bmi, category });
    this.props.onCalculate(weight, bmi);
  }

  handleReset() {
    this.setState({
      weight: '',
      height: '',
      heightUnit: 'cm',
      bmi: null,
      category: '',
      error: '',
    });
    this.props.onCalculate(null, null);
  }

  render() {
    const { weight, height, heightUnit, bmi, category, error } = this.state;

    return (
      <section className="page-section">
        <div className="page-header">
          <h1 className="page-title">BMI Calculator</h1>
          <p className="page-subtitle">
            Enter your body weight and height to calculate your Body Mass Index.
          </p>
        </div>

        <div className="card">
          <form onSubmit={this.handleCalculate} className="form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="weight">
                Body Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                name="weight"
                className="form-input"
                placeholder="e.g. 75"
                value={weight}
                onChange={this.handleChange}
                min="1"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="height">
                Height
              </label>
              <div className="input-with-toggle">
                <input
                  id="height"
                  type="number"
                  name="height"
                  className="form-input"
                  placeholder={heightUnit === 'cm' ? 'e.g. 175' : 'e.g. 69'}
                  value={height}
                  onChange={this.handleChange}
                  min="1"
                  step="0.1"
                />
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${heightUnit === 'cm' ? 'unit-btn--active' : ''}`}
                    onClick={() => this.handleUnitToggle('cm')}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${heightUnit === 'in' ? 'unit-btn--active' : ''}`}
                    onClick={() => this.handleUnitToggle('in')}
                  >
                    in
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                Calculate BMI
              </button>
              {bmi !== null && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={this.handleReset}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {bmi !== null && (
          <div className="results-grid">
            <StatCard label="BMI Score" value={bmi} />
            <StatCard label="Category" value={category} />
            <StatCard label="Weight (kg)" value={parseFloat(weight)} />
            <StatCard
              label={`Height (${heightUnit})`}
              value={parseFloat(height)}
            />
          </div>
        )}

        {bmi !== null && (
          <div className="bmi-scale card">
            <h3 className="scale-title">BMI Reference Scale</h3>
            <div className="scale-rows">
              {[
                { range: 'Below 18.5', label: 'Underweight' },
                { range: '18.5 — 24.9', label: 'Normal Weight' },
                { range: '25.0 — 29.9', label: 'Overweight' },
                { range: '30.0 and above', label: 'Obese' },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`scale-row ${category === row.label ? 'scale-row--active' : ''}`}
                >
                  <span className="scale-range">{row.range}</span>
                  <span className="scale-label">{row.label}</span>
                </div>
              ))}
            </div>
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
