const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'puppet.js'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'Pixel Demo Board.html'), html.replace('<script src="puppet.js"></script>', '<script>' + js + '</script>'));
console.log('Built Pixel Demo Board.html');
