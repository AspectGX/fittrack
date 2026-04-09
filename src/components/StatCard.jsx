import React from 'react';
import PropTypes from 'prop-types';

function StatCard({ label, value, color }) {
  const valueStyle = {
    color: color || '#7c3aed',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  color: PropTypes.string,
};

StatCard.defaultProps = {
  color: '#7c3aed',
};

export default StatCard;
