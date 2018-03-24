/* eslint-disable no-console, global-require */
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const https = require('https');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

const config = require('./src/config.json');

mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoUrl);

const app = express();
app.set('port', 5000);

app.use(express.static('static'));
app.use(bodyParser.json());

const httpsOptions = {
  key: fs.readFileSync('certificates/privkey.pem'),
  cert: fs.readFileSync('certificates/fullchain.pem')
};

const server = https.createServer(httpsOptions, app);

server.listen(app.get('port'), () => {
  console.log(`AbigailProxy running on port ${app.get('port')}!`);
});

require('./src/sockets').listen(server);

// db.createUser({user:"admin", pwd:"veryRealpassword2Prot3c7MyData", roles:[{role:"root", db:"admin"}]})