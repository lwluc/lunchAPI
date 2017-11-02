const request = require('request');
const cheerio = require('cheerio');

const nothingFound = 'lunch.length === 0';

const getBody = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error || response.statusCode !== 200) reject(error);
      resolve(body);
    });
  });
};

async function getLunchMahlzeit() {
  let body;
  try {
    body = await getBody('http://mahlzeit-ka.de');
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let lunch = []; 
    lunch.push($('[id="mittag_container"]').find('[class="col-md-4"]').find('p').text());
    
    if (lunch.length === 0) reject(nothingFound);
    const res = arrayToLines(lunch);
    resolve(res);
  });
}

async function getDinnerLounge(url) {
  let body;
  try {
    body = await getBody(url);
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(body);

  return new Promise((resolve, reject) => {
    let lunchUnformatted = [];
    $('[class="bodytext"]').each(function(i, elem) {
      lunchUnformatted[i] = $(this).text();
    });
    if (lunchUnformatted.length === 0) reject(nothingFound);

    let lunchWithPrice = lunchUnformatted[0].split('Euro');
    lunchWithPrice.splice(-1,1);

    let lunch = [];
    lunchWithPrice.forEach(el => {
      lunch.push(el.substring(0, el.indexOf(' -')));
    });

    const res = arrayToLines(lunch);
    resolve(res);
  });
}

function arrayToLines(array) {
  let result = '';
  array.forEach(el => {
    result += '· ' + el + '\n';
  });

  return result.substring(0, result.length - 1);
}

async function log() {
  const mahlzeit = await getLunchMahlzeit();
  console.log('Mahlzeit \n', mahlzeit, '\n\n');

  const aposto = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/aposto/');
  console.log('Apost \n', aposto, '\n\n');

  const lehenrs = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/lehners-wirtshaus/');
  console.log('Lehners \n', lehenrs, '\n\n');

  const multiKulti = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/multi-kulti/');
  console.log('Multi Kulti \n', multiKulti, '\n\n');

  const salmen = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/salmen/');
  console.log('Salmen \n', salmen, '\n\n');

  const ludwigs = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/ludwigs/');
  if (ludwigs) ludwigs.shift();
  console.log('Ludwigs \n', ludwigs, '\n\n');

  const brauhaus = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/badisch-brauhaus/');
  console.log('Brauhaus \n', brauhaus, '\n\n');

  const gutenberg = await getDinnerLounge('http://www.ka-city.de/dinner-lounge/mittagstisch/gutenberg/');
  console.log('Gutenberg \n', gutenberg, '\n\n');
}

// log();
