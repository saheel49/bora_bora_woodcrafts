const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'images', 'about.png');
const buf = fs.readFileSync(file);
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(width, height);
