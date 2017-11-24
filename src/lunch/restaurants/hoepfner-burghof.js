import { getBody, nothingFound, removeEmtpyElementsAndSpaces } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'Hoepfner Burghof';
export const website = 'http://www.hoepfner-burghof.de/';
export const latlng = { lat: 49.012555, lng: 8.426759 };

export async function get() {
  let body;
  try {
    body = await getBody('http://www.hoepfner-burghof.de/restaurant_wochenkarte--mittags-.php');
  } catch (err) {
    console.log(name, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let food = [];
    let price = [];

    $('table[border="0"]').find('tr').each(function(i, elem) {
      food[i] = $(this).find('td[style="width: 900px; height: 20px;"]').find('span').text();
      price[i] = $(this).find('td[style="width: 80px; height: 25px; text-align: right;"]').find('span').text();
    });

    if (food.length === 0 || price.length === 0) return reject(nothingFound);

    food = food.map((el, index) => { return {food: el, price: price[index]}; });
    let lunch = removeEmtpyElementsAndSpaces(food);
    resolve(lunch);
  });
}
