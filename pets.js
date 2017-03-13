'use strict';

const fs = require('fs');
const path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    let pets = JSON.parse(data);

    console.log(pets);


    // var guests = JSON.parse(data);
    //
    // console.log(guests);
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
