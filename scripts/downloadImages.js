var download = require('../lib/image/download');
var start = new Date();

download.fetch(function(err) {
  if(err) {
    console.log('error: ' + JSON.stringify(err));
    return;
  }
  
  process.exit();
});
