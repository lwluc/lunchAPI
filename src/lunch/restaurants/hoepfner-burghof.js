import { getBody, nothingFound, removeEmptyElementsAndSpaces, emptyFood } from '../utils';
import * as  cheerio from 'cheerio';
import { logger, ERROR } from '../../utils/index';

export const name = 'Hoepfner Burghof';
export const website = 'http://www.hoepfner-burghof.de/';
export const latlng = { lat: 49.012555, lng: 8.426759 };

export async function get() {
  const body = await getBody('http://www.hoepfner-burghof.de/restaurant_wochenkarte--mittags-.php')
                      .catch(err => logger.error(`${ERROR.couldNotLoadBody} ${name}`, err));

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let food = [];
    let price = [];

    // eslint-disable-next-line no-unused-vars
    $('table[border="0"]').find('tr').each(function(i, elem) {
      food[i] = $(this).find('td[style="width: 900px; height: 20px;"]').find('span').text();
      price[i] = $(this).find('td[style="width: 80px; height: 25px; text-align: right;"]').find('span').text();
    });

    if (emptyFood(food) || price.length === 0) return reject(nothingFound);

    food = food.map((el, index) => { return {food: el, price: price[index]}; });
    let lunch = removeEmptyElementsAndSpaces(food);
    resolve(lunch);
  });
}
