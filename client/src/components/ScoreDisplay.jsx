// client/src/components/ScoreDisplay.jsx
import React from 'react';
import PropTypes from 'prop-types'; // Importieren für Prop-Typ-Validierung (gute Praxis!)

function ScoreDisplay({ score }) { // Empfängt 'score' als Prop
  // Wir gehen davon aus, dass die App-Komponente diese Komponente nur rendert,
  // wenn der Score nicht mehr null ist (also geladen wurde).
  return (
    <p className="scoreDisplay">
      Aktueller Spielstand: {score}
    </p>
  );
}

// Prop Types definieren: Erwartet, dass 'score' eine Zahl ist und erforderlich ist.
// Hilft, Fehler frühzeitig zu finden.
ScoreDisplay.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreDisplay; // Komponente exportieren, damit sie importiert werden kann