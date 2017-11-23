import { getBody, nothingFound, arrayToLines } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'Mensa Moltke';
export const website = 'http://www.sw-ka.de/de/essen/?mensa=2';
export const latlng = { lat: 49.014500, lng: 8.391060 };

export async function get() {
  let body;
  try {
    body = await getBody('http://www.sw-ka.de/de/essen/?mensa=2');
  } catch (err) {
    console.log(name, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let lunch = [];
    let price = [];

    $('div[id="c2"]').find('div[id="fragment-c2-1"]').find('table[cellspacing="0"]').find('td[class="mensadata"]').find('tr').each(function(i, elem) {
      let food = $(this).find('td[valign="top"]').find('span[class="bg"]');
      lunch[i] = food.find('b').text() + ' ' +  food.find('span').text();
      price[i] = $(this).find('td[style="text-align: right;vertical-align:bottom;"]').find('span[class="bgp price_1"]').text();
    });

    if (lunch.length === 0) return reject(nothingFound);

    let lunchWithPrice = [];
    lunch.forEach((el, index) => {
      lunchWithPrice.push(`${el} ${price[index]}`);
    });
    
    if (lunchWithPrice.length === 0) return reject(nothingFound);

    const res = arrayToLines(lunchWithPrice);
    resolve(res);
  });
}
