import { getBody, nothingFound, removeEmtpyElementsAndSpaces } from '../utils';
import * as  cheerio from 'cheerio';
import { logger, ERROR } from '../../utils/index';

export const name = 'Alina Café';
export const website = 'http://www.alinacafe.de/';
export const latlng = { lat: 49.005733, lng: 8.429576 };

export async function get() {
  const body = await getBody('http://www.alinacafe.de/lecker/wochenkarte/')
                      .catch(err => logger.error(`${ERROR.couldNotLoadBody} ${name}`, err));

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let food = [];

    // eslint-disable-next-line no-unused-vars
    $('div[class="entry-summary tafel"]').find('p').each(function(i, elem) {
      food[i] = $(this).text();
    });

    if (food.length === 0) reject(nothingFound);

    const today = new Date();
    const weekDay = today.getDay();

    food = food.filter(el => {
      switch (weekDay) {
        case 1: if (el.includes('Montag')) return el.replace('Montag: ', ''); break;
        case 2: if (el.includes('Dienstag')) return el.replace('Dienstag: ', ''); break;
        case 3: if (el.includes('Mittwoch')) return el.replace('Mittwoch: ', ''); break;
        case 4: if (el.includes('Donnerstag')) return el.replace('Donnerstag: ', ''); break;
        case 5: if (el.includes('Freitag')) return el.replace('Freitag: ', ''); break;
        default: return el;
      }
    });

    // If no price is give the price should be a space, otherwise it will be filter out
    let price = food.map(el => el = ' '); // eslint-disable-line no-unused-vars

    food = food.map((el, index) => { return {food: el, price: price[index]}; });
    let lunch = removeEmtpyElementsAndSpaces(food);
    resolve(lunch);
  });
}
