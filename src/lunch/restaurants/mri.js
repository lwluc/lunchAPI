import { getBody, nothingFound, arrayToLines } from '../utils';
import * as  cheerio from 'cheerio';

export const name = 'MRI-Casino';

export async function get() {
  let body;
  try {
    body = await getBody('http://casinocatering.de/');
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    $('sup').replaceWith(' ');
    $('sub').replaceWith(' ');
    const firstLine = replaceTadAndSetLineBreaks($('.views-row.views-row-1.views-row-odd.views-row-first').text()).replace(' ', '');
    const secondLine = replaceTadAndSetLineBreaks($('.views-row.views-row-2.views-row-even').text());
    const thirdLine = $('.views-row.views-row-3.views-row-odd.views-row-last').text().trim().replace(/(?:\r\n|\r|\n)/g, ' ').replace(/ +(?= )/g,',').replace(':, ',': ');

    if (firstLine.length === 0 && secondLine.length === 0 && thirdLine.length === 0) reject(nothingFound);

    const prices = 'Preise: Vegetarisch: 4,70 €, Noramle: 5,20 €, Suppe: 2 €';
    
    const lunch = [firstLine, secondLine, thirdLine, prices];
    const res = arrayToLines(lunch);
    resolve(res);
  });
}

const replaceTadAndSetLineBreaks = (data) => {
  return data.replace(/\n/g, '#').replace(/\s\s+/g, ' ').replace(/##/g, '\n').replace(/#/g, '');
};