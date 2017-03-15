#!/usr/local/bin/node
'use strict';

const fs = require('fs');
const path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) throw err;

    let pets = JSON.parse(data);
    let petNumber = process.argv[3];
    let petsRead = petNumber ? pets[petNumber] : pets;

    if (petsRead) console.log(petsRead);
    else {
      console.error(`Usage: ${node} ${file} read INDEX`);
      process.exit(1);
    }
  });
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) throw readErr;

    let pets = JSON.parse(data);
    let age = parseInt(process.argv[3]);
    let kind = process.argv[4];
    let name = process.argv[5];

    if (!name) {
      console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
      process.exit(1);
    }

    let petAddedObj = { age: age, kind: kind, name: name };

    pets.push(petAddedObj);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) throw writeErr;
      console.log(petAddedObj);
    });
  });
}
else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(updateErr, data) {
    if (updateErr) throw updateErr;

    let pets = JSON.parse(data);
    let petNumber = process.argv[3];
    let age = parseInt(process.argv[4]);
    let kind = process.argv[5];
    let name = process.argv[6];

    if (!process.argv[6] || pets[petNumber] === undefined) {
      console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
      process.exit(1);
    }

    let petAddedObj = { age: age, kind: kind, name: name };

    pets[petNumber] = petAddedObj;

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) throw writeErr;
      console.log(petAddedObj);
    });
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', function(destroyErr, data) {
    if (destroyErr) throw destroyErr;

    let pets = JSON.parse(data);
    let petNumber = process.argv[3];

    if (!petNumber) {
      console.error(`Usage: ${node} ${file} destroy INDEX`);
      process.exit(1);
    }

    let petDestroy = pets[petNumber];

    pets.splice(petNumber, 1);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) throw writeErr;
      console.log(petDestroy);
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
