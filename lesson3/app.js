var express = require('express');

var app = express();

var path = require('path');

app.use('/', express.static(path.join(__dirname, '/bin')));

app.listen(3000, function () {
  console.log('Server started on http://localhost:3000/');
});
