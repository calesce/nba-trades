import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';

(function initialize() {

  fetch('http://localhost:3000/api')
    .then((response) => {
      return response.json();
    })
    .then((teams) => {
      return render(
        <App teams={teams} />,
        document.getElementById('trades')
      );
    })
    .catch((err) => {
      console.log(err);
    });
})();
