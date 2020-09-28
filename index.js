const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = new http.Server(app);

app.use('/', express.static(path.resolve(__dirname, 'public')), (req, res) => {
    res.statusCode = 404;
    res.end();
});

server.listen(3000, () => {
    console.log('Listening on 3000')
});
