var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

app.use(express.static(__dirname));

app.listen(8000, function() {
    console.log('Listening on port 8000');
});
