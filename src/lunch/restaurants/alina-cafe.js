import { getBody, nothingFound, removeEmtpyElementsAndSpaces } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'Alina Café';
export const website = 'http://www.alinacafe.de/';
export const latlng = { lat: 49.005733, lng: 8.429576 };

export async function get() {
  let body;
  try {
    body = await getBody('http://www.alinacafe.de/lecker/wochenkarte/');
  } catch (err) {
    console.log(name, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let food = [];

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
    let price = food.map(el => el = ' ');

    food = food.map((el, index) => { return {food: el, price: price[index]}; });
    let lunch = removeEmtpyElementsAndSpaces(food);
    resolve(lunch);
  });
}
