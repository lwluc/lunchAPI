import { getBody, nothingFound, arrayToLinesMensaSpecial } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'Mensa';
export const website = 'http://mensa.akk.uni-karlsruhe.de/';

export async function get() {
  let body;
  try {
    body = await getBody('http://mensa.akk.uni-karlsruhe.de/?DATUM=heute&uni=1&schnell=1');
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let lunch = [];
    $('[valign="top"]').find('td').each(function(i, elem) {
      lunch[i] = $(this).text();
    });

    lunch.forEach((el, index) => {
      if (el.length <= 2) lunch.splice(index, 1);
    });
    
    if (lunch.length === 0) reject(nothingFound);
    const res = arrayToLinesMensaSpecial(lunch);
    resolve(res);
  });
}
