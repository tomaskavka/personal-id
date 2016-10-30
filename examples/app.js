var express = require('express');
var Pin = require('./../build/personal-id').default;
var app = express();

app.get('/:pin', function (req, res) {
  var pin = new Pin(req.params.pin);
  res.json({
    valid: pin.isValid(),
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
