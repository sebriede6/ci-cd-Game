// client/src/components/ErrorDisplay.jsx
import React from 'react';
import PropTypes from 'prop-types';

function ErrorDisplay({ message }) {
  // Wenn keine Nachricht vorhanden ist, nichts rendern
  if (!message) {
    return null;
  }
  return <p className="error">Fehler: {message}</p>;
}

ErrorDisplay.propTypes = {
  message: PropTypes.string, // Nachricht ist ein optionaler String
};

export default ErrorDisplay;