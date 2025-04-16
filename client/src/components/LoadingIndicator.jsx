// client/src/components/LoadingIndicator.jsx
import React from 'react';
import PropTypes from 'prop-types';

function LoadingIndicator({ text = "Lade..." }) { // Standardtext, falls keiner übergeben wird
    return <p>{text}</p>;
}

LoadingIndicator.propTypes = {
  text: PropTypes.string,
};

export default LoadingIndicator;