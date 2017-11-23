import { getBody, nothingFound, arrayToLines } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'Die Zwiebel';
export const website = 'http://www.diezwiebel.net/';
export const latlng = { lat: 49.008187, lng: 8.419894 };

export async function get() {
  let body;
  try {
    body = await getBody('http://www.diezwiebel.net/tageskarte.html');
  } catch (err) {
    console.log(name, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let lunchTitle = [];
    let lunchText = [];
    let lunchPrice = [];
    $('article').each(function(i, elm) {
      lunchTitle[i] = $(this).find('h5').text();
      lunchText[i] = $(this).find('[class="text"]').text();
      lunchPrice[i] = $(this).find('[class="price"]').text();
    });
  
    if (lunchTitle.length === 0 || lunchText.length === 0) return reject();
  
    let lunch = [];
    lunchText.forEach((el, index) => {
      lunch.push(lunchTitle[index] + ' ' + el.replace(/\t/g, '').replace(/\r?\n|\r/g, '') 
        + ' ' + lunchPrice[index].replace(/Euro/g, '€'));
    });

    if (lunch.length === 0) return reject(nothingFound);
    const res = arrayToLines(lunch);
    resolve(res);
  });
}