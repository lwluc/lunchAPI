import lunch from '../lunch';
import { logger, ERROR } from './index';

export function reflect(promise) {
  return promise.then(value => { return {value, status: 'resolved' }; },
                      error => { return {error, status: 'rejected' }; });
}

export function loadFood(promise) {
  return new Promise(async (resolve, reject) => {
    let lunch = [];
    await Promise.all(promise.map(reflect)).then(results => {
      results.filter(obj => {
        if (obj.status === 'resolved') lunch.push(obj.value);
        else lunch.push([{food: 'Ups, die Küche scheint heute kalt zu bleiben!', price: ' '}]);
      });
    });
    if (lunch.length === 0) reject('Could not load any lunch');
    resolve(lunch);
  });
}

export function loadAll() {
  return new Promise(async (resolve, reject) => {
    let promise = [];
    let names = [];
    lunch.forEach(lib => {
      promise.push(lib.get());
      names.push(lib.name);
    });
  
    if (promise.length === 0 || names.length === 0) return reject(404);
  
    let result = [];
    try {
      const food = await loadFood(promise);
      
      names.forEach((restaurant, index) => {
        result.push({restaurant, lunch: food[index]});
      });
    } catch (err) {
      logger.error(`${ERROR.couldNotLoadLAllLunch}`, err);
      return reject(404);
    }
    resolve(result);
  });
}