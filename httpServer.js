'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 8000;
const path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

let server = http.createServer((req, res) => {
  fs.readFile(petsPath, 'utf-8', (err, data) => {
    if (err) throw err;

    let pets = JSON.parse(data);
    let petsRead = '';

    if (req.method === 'GET' && (/^\/pets/).test(req.url) && req.url !== '/pets/') {
      // && (/^\/pets\/(\/.*)$/.test(req.url) || req.url === '/pets')
      // let urlComponents = req.url.split('/');

      let petsUrl = req.url.match(/^\/pets\/(.*)$/);

      if (petsUrl === null) petsRead = pets;
      else if (petsUrl[1] > pets.length - 1 || petsUrl[1] < 0) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
        process.exit(1);
      }
      else petsRead = pets[petsUrl[1]];

      let JSONpetsRead = JSON.stringify(petsRead);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSONpetsRead);
    }
    else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log("server is listening...");
});

module.exports = server;
