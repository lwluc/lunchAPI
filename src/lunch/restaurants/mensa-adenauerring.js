import { getBody, nothingFound, removeEmtpyElementsAndSpaces } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'Mensa Adenauerring';
export const website = 'http://mensa.akk.uni-karlsruhe.de/';
export const latlng = { lat: 49.011719, lng: 8.416952 };

export async function get() {
  let body;
  try {
    body = await getBody('http://mensa.akk.uni-karlsruhe.de/?DATUM=heute&uni=1&schnell=1');
  } catch (err) {
    console.log(name, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let food = [];
    let price = [];
    $('[valign="top"]').each(function(i, elem) {
      food[i] = $(this).find('td').first().text();
      price[i] = $(this).find('td').last().text();
    });
    
    food.forEach((el, index) => {
      if (el.length <= 2) food.splice(index, 1);
    });

    if (food.length === 0 || price.length === 0) return reject(nothingFound);

    food = food.map((el, index) => { return {food: el, price: price[index]}; });
    let lunch = removeEmtpyElementsAndSpaces(food);
    resolve(lunch);
  });
}
