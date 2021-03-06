const request = require('request');

export const nothingFound = 'lunch.length === 0';

export const getBody = (url) => {
  return new Promise((resolve, reject) => {
    let options = {
      url,
      headers: {
        'User-Agent': 'LunchBot/1.0.0 (https://ka-lunch.de)',
      }
    };
    request(options, (error, response, body) => {
      if (error || (response.statusCode && response.statusCode !== 200)) reject({error, statusCode: response.statusCode});
      resolve(body);
    });
  });
};

export function arrayToLines(array) {
  let result = '';
  array.forEach(el => {
    result += el + '\n';
    result = result.replace(/^\s*[\r\n]/gm, ''); // replace empty lines
    /* eslint no-regex-spaces: 0 */
    result = result.replace(/  +/g, ' '); // replace multiple spaces with a single space
  });

  return result.substring(0, result.length - 1);
}

export function arrayToLinesMensaSpecial(array) {
  let result = '';
  array.forEach((el, index) => {
    result += el + ' ';
    if (index % 2 !== 0) result += '\n';
    result = result.replace(/^\s*[\r\n]/gm, ''); // replace empty lines
    /* eslint no-regex-spaces: 0 */
    result = result.replace(/  +/g, ' '); // replace multiple spaces with a single space
  });

  return result.substring(0, result.length - 1);
}

export function removeEmptyElementsAndSpaces(lunch) {
  lunch = lunch.filter(obj => obj && obj.food && obj.food.replace(/\s/g, '').length > 0 && obj.price);
    // && obj.price && obj.price.replace(/\s/g, '').length > 0);

  return lunch.map(obj => obj = {food: obj.food.replace(/  +/g, ' ').trim(), price: obj.price.replace(/  +/g, ' ').trim() });  
}

export function emptyFood(food) {
  return food.length === 0 || food.every(el => el.length <= 2);
}
