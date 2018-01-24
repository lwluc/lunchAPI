import express from 'express';
import lunch from './lunch';
import showdown from 'showdown';
import { logger, ERROR, loadFood, loadAll } from './utils';
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400; }
}));

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, '/../access.log'), {flags: 'a'})
}));

app.get('/', (req, res) => {
  const converter = new showdown.Converter();
  const style = fs.readFileSync(__dirname + '/utils/readme-style.css');
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
    logger.error(`${ERROR.couldNotLoadLunch}`, err);
    return res.sendStatus(404);
  }

  res.send(result);
});

app.get(['/getAll', '/getall'], async (req, res) => {
  const result = await loadAll().catch(err => { // eslint-disable-line no-unused-vars
    return res.status(404).send({NothingFound: 'Ups, die Küche scheint heute kalt zu bleiben!'});
  });
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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.get('/menu', async (req, res) => {
  const result = await loadAll().catch(err => { // eslint-disable-line no-unused-vars
    return res.status(404).send({NothingFound: 'Ups, die Küche scheint heute kalt zu bleiben!'});
  });

  res.render('menu', {lunch: result});
});

app.listen(3000, () => {
  logger.info('LunchAPI app listening on port 3000!');
});