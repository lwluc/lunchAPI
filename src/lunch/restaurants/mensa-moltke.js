import { getBody, nothingFound, removeEmtpyElementsAndSpaces } from '../utils';
import * as  cheerio from 'cheerio';
import { logger, ERROR } from '../../utils/index';

export const name = 'Mensa Moltke';
export const website = 'http://www.sw-ka.de/de/essen/?mensa=2';
export const latlng = { lat: 49.014500, lng: 8.391060 };

export async function get() {
  let body;
  try {
    body = await getBody('http://www.sw-ka.de/de/essen/?mensa=2');
  } catch (err) {
    logger.error(`${ERROR.couldNotLoadBody} ${name}`, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let food = [];
    let price = [];

    $('div[id="c2"]').find('div[id="fragment-c2-1"]').find('table[cellspacing="0"]').find('td[class="mensadata"]').find('tr').each(function(i, elem) {
      let f = $(this).find('td[valign="top"]').find('span[class="bg"]');
      food[i] = f.find('b').text() + ' ' +  f.find('span').text();
      price[i] = $(this).find('td[style="text-align: right;vertical-align:bottom;"]').find('span[class="bgp price_1"]').text();
    });

    if (food.length === 0 || price.length === 0) return reject(nothingFound);

    let res = [];
    food = food.forEach((el, index) => {
      if (el ==='zu jedem Gericht ein Salat und eine Banane') {
        food.splice(index, 1);
        price.splice(index, 1);
      }
      res.push({food: el, price: price[index]});
    });

    let lunch = removeEmtpyElementsAndSpaces(res);
    resolve(lunch);
  });
}
