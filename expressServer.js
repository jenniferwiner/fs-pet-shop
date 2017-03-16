'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

app.use(bodyParser.json())

app.disable('x-powered-by');

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    let pets = JSON.parse(data);
    res.set('Content-Type', 'application/json')
    res.send(pets);
  })
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(505);
    }
    let pets = JSON.parse(data);
    let id = parseInt(req.params.id);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.send(pets[id]);
  })
});

app.post('/pets', (req, res) => {
  if (req.body.name === '' || req.body.kind === '' || req.body.age === '' || isNaN(req.body.age)) {
    return res.sendStatus(400);

  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      let pets = JSON.parse(data);

      pets.push(req.body);

      fs.writeFile(petsPath, JSON.stringify(pets), (writeErr) => {
        console.error(writeErr);
      });
    });
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(req.body));
  }
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, function(err) {
  if (err) throw err;
  console.log('Listening on port', port);
});

module.exports = app;
