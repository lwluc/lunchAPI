import { getBody, nothingFound } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'MRI-Casino';
export const website = 'http://www.casinocatering.de/';
export const latlng = { lat: 49.013265, lng: 8.426129 };

export async function get() {
  let body;
  try {
    body = await getBody('http://casinocatering.de/');
  } catch (err) {
    console.log(name, err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('sup').replaceWith(' ');
    $('sub').replaceWith(' ');
    const firstLine = replaceTadAndSetLineBreaks($('.views-row.views-row-1.views-row-odd.views-row-first').text()).replace(' ', '');
    const secondLine = replaceTadAndSetLineBreaks($('.views-row.views-row-2.views-row-even').text());
    const thirdLine = $('.views-row.views-row-3.views-row-odd.views-row-last').text().trim().replace(/(?:\r\n|\r|\n)/g, ' ').replace(/ +(?= )/g,',').replace(':, ',': ');

    if (firstLine.length === 0 && secondLine.length === 0 && thirdLine.length === 0) return reject(nothingFound);

    let priceM1 = 'Preise: Menü 1: 4,70 €, Menü 1 mit Salat oder Suppe oder Dessert: 6,30 €';
    let priceM2 = 'Menü 2: 5,20 €, Menü 2 mit Salat oder Suppe oder Dessert: 6,80 €';
    let priceOthers = 'Suppe/Dessert/Salat/Sättigungsbeilage: 1,60';

    
    let food = [{food: firstLine, price: priceM1}, 
      {food: secondLine, price: priceM2},
      {food: thirdLine, price: priceOthers}];

    resolve(food);
  });
}

const replaceTadAndSetLineBreaks = (data) => {
  /* eslint no-regex-spaces: 0 */
  return data.replace(/\n/g, '#').replace(/\s\s+/g, ' ').replace(/##/g, '\n').replace(/#/g, '').replace(/  +/g, ' ').trim();
};