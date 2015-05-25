require('../lib/image/download')().then(function() {
    console.log('success');
  }).catch(function(err) {
    console.log('error: ' + JSON.stringify(err));
  });
