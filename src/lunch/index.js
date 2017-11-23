const fs = require('fs');
const files = fs.readdirSync(__dirname + '/restaurants');


let fn = [];
files.forEach(file => {
  let lib = require('./restaurants/' + file);
  if (lib.hasOwnProperty('name') && lib.hasOwnProperty('website') &&
    lib.hasOwnProperty('latlng') && lib.hasOwnProperty('get')) fn.push(lib);
});

// Remove Restaurants with the same name
fn = fn.filter((lib, index, self) => self.findIndex(l => l.name === lib.name) === index);

export default fn;
