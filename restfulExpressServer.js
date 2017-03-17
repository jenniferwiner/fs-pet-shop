'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const bodyParser = require('body-parser');
const morgan = require('morgan');
const basicAuth = require('basic-auth');

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

app.use(bodyParser.json());

app.disable('x-powered-by');

let auth = function(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm="Required"');

    return res.sendStatus(401);
  }

  let user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'admin' && user.pass === 'meowmix') {
    return next();
  }
  else {
    return unauthorized(res);
  }
};

app.get('/pets', auth, (req, res) => {
  fs.readFile(petsPath, (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    res.set('Content-Type', 'application/json');
    res.send(data);
  });
});

app.get('/pets/:id', auth, (req, res) => {
  fs.readFile(petsPath, (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    let index = parseInt(req.params.id);
    let jsonData = JSON.parse(data);

    if (index < 0 || index >= jsonData.length || isNaN(index)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.send(jsonData[index]);
  });
});

app.post('/pets', auth, (req, res) => {
  if (req.body.name === '' || req.body.age === '' || req.body.kind === '' || isNaN(req.body.age)) {
    return res.sendStatus(400);
  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        return res.sendStatus(500);
      }
      let jsonData = JSON.parse(data);

      jsonData.push(req.body);

      fs.writeFile(petsPath, JSON.stringify(jsonData), (writeErr) => {
        console.error(writeErr);
      });
      res.set('Content-Type', 'application/json');
      res.send(req.body);
    });
  }
});

app.patch('/pets/:id', auth, (req, res) => {
  if (req.body.age === '' || isNaN(req.body.age)) {
    return res.sendStatus(400);
  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        return res.sendStatus(500);
      }

      let jsonData = JSON.parse(data);
      let index = parseInt(req.params.id);

      if (index < 0 || index >= jsonData.length || isNaN(index)) {
        return res.sendStatus(404);
      }
      else {
        for (let key in req.body) {
          jsonData[index][key] = req.body[key];
        }
      }
      fs.writeFile(petsPath, JSON.stringify(jsonData), (writeErr) => {
        console.error(writeErr);
      });
      res.set('Content-Type', 'application/json');
      res.send(jsonData[index]);
    });
  }
});

app.delete('/pets/:id', auth, (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    else {
      let index = parseInt(req.params.id);
      let jsonData = JSON.parse(data);

      if (index < 0 || index >= jsonData.length || isNaN(index)) {
        return res.sendStatus(404);
      }
      let deletedPet = jsonData[index];

      jsonData.splice(index, 1);

      fs.writeFile(petsPath, JSON.stringify(jsonData), (writeErr) => {
        console.error(writeErr);
      });

      res.set('Content-Type', 'application/json');
      res.send(deletedPet);
    }
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, function(err) {
  if (err) throw err;
  console.log('Listening on port', port);
});

module.exports = app;
