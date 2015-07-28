import React from 'react';
import App from './containers/App';

(function initialize() {

  fetch('http://localhost:8080/api')
    .then((response) => {
      return response.json();
    })
    .then((teams) => {
      return React.render(
        <App teams={teams} />,
        document.getElementById('trades')
      );
    })
    .catch((err) => {
      console.log(err);
    });
})();
