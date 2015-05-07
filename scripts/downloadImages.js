var download = require('../lib/image/download');

download.fetch(function(err) {
  if(err) {
    console.log('error: ' + JSON.stringify(err));
    return;
  }
});
