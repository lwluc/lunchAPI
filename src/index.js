import express from 'express';
import lunch from './lunch';

const app = express();

function reflect(promise) {
  return promise.then(value => { return {value, status: 'resolved' }; },
                      error => { return {error, status: 'rejected' }; });
}

function loadFood(promise) {
  return new Promise(async (resolve, reject) => {
    let food = [];
    await Promise.all(promise.map(reflect)).then(function(results) {
      results.filter(obj => {
        if (obj.status === 'resolved') food.push(obj.value);
        else food.push('Ups, die Küche scheint heute kalt zu bleiben!');
      });
    });
    resolve(food);
  });
}

app.get('/', (req, res) => {
  res.send('<p>Read <a href="https://gitlab.com/fyre/lunchbot/blob/master/README.md">this</a> how to use the lunchBot API</p>');
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

app.get('/getAll', async (req, res) => {
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
    names.push(lib.name);
  });

  if (names.length === 0) return res.sendStatus(404);

  res.send(names);
});

app.listen(3000, () => {
  console.log('LunchAPI app listening on port 3000!');
});