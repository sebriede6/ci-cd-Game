// client/src/components/ScoreControls.jsx
import React from 'react';
import PropTypes from 'prop-types';

// Empfängt Funktionen 'onIncrement', 'onDecrement' und den Status 'isLoading' als Props
function ScoreControls({ onIncrement, onDecrement, isLoading }) {
  return (
    <div className="buttons">
      <button onClick={onIncrement} disabled={isLoading}>
        +1
      </button>
      <button onClick={onDecrement} disabled={isLoading}>
        -1
      </button>
    </div>
  );
}

// Prop Types definieren
ScoreControls.propTypes = {
  onIncrement: PropTypes.func.isRequired, // Erwartet eine Funktion
  onDecrement: PropTypes.func.isRequired, // Erwartet eine Funktion
  isLoading: PropTypes.bool.isRequired,   // Erwartet einen Boolean
};

export default ScoreControls;