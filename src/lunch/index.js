const fs = require('fs');
const files = fs.readdirSync(__dirname + '/restaurants');


let fn = [];
files.forEach(file => {
  let lib = require('./restaurants/' + file);
  if (lib.hasOwnProperty('name') && lib.hasOwnProperty('website') &&
    lib.hasOwnProperty('get')) fn.push(lib);
});

export default fn;
