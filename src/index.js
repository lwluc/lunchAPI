import express from 'express';
import lunch from './lunch';
import showdown from 'showdown';
const fs = require('fs');

function reflect(promise) {
  return promise.then(value => { return {value, status: 'resolved' }; },
                      error => { return {error, status: 'rejected' }; });
}

function loadFood(promise) {
  return new Promise(async (resolve, reject) => {
    let food = [];
    await Promise.all(promise.map(reflect)).then(results => {
      results.filter(obj => {
        if (obj.status === 'resolved') food.push(obj.value);
        else food.push('Ups, die Küche scheint heute kalt zu bleiben!');
      });
    });
    resolve(food);
  });
}

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  const converter = new showdown.Converter();
  const style = fs.readFileSync(__dirname + '/readme-style.css');
  fs.readFile(__dirname + '/../README.md', 'utf-8', (err, data) => {
    if (err) throw err;
    const readme = converter.makeHtml(data);
    const html = `
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${style}</style>
      </head>
      <body>
        <article class="markdown-body">${readme}</article>
      </body>
      </html>`;
    res.send(html);
  });
});

app.get('/get', async (req, res) => {
  const params = req.query.restaurants;

  if (!params) return res.sendStatus(400);

  const restaurants = params.split(',');

  let promise = [];
  let names = [];
  for (let pos = 0; pos < restaurants.length; pos++) {
    for (let i = 0; i < lunch.length; i++) {
      if (restaurants[pos] === lunch[i].name) {
        promise.push(lunch[i].get());
        names.push(lunch[i].name);
      }
    }
  }

  if (promise.length === 0 || names.length === 0) return res.sendStatus(404);

  let result = [];
  try {
    const food = await loadFood(promise);

    names.forEach((restaurant, index) => {
      result.push({restaurant, lunch: food[index]});
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }

  res.send(result);
});

app.get(['/getAll', '/getall'], async (req, res) => {
  let promise = [];
  let names = [];
  lunch.forEach(lib => {
    promise.push(lib.get());
    names.push(lib.name);
  });

  if (promise.length === 0 || names.length === 0) return res.sendStatus(404);

  let result = [];
  try {
    const food = await loadFood(promise);
    
    names.forEach((restaurant, index) => {
      result.push({restaurant, lunch: food[index]});
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send({NothingFound: 'Ups, die Küche scheint heute kalt zu bleiben!'});
  }

  res.send(result);
});

app.get('/restaurants', async (req, res) => {
  let names = [];
  lunch.forEach(lib => {
    names.push({name: lib.name, website: lib.website, latlng: lib.latlng});
  });

  if (names.length === 0) return res.sendStatus(404);

  res.send(names);
});

app.listen(3000, () => {
  console.log('LunchAPI app listening on port 3000!');
});