The Lunchbot
============

*This API serves the lunch of some restaurants / canteens placed in Oststadt in Karlsruhe.*

## Feel free to add your favorite places!
Take a look at [mensa-moltke.js](src/lunch/restaurants/mensa-moltke.js) or [zwiebel.js](src/lunch/restaurants/zwiebel.js) and write your own script crawling the lunch of your favorite place.  
There are only four things your file should export:
1. A `name`, preferable the one of the restaurant (it has to be unique!)
2. A `website` URL of the restaurant 
3. The `latitude and longitude` as object like this: `{ lat: 49.004956, lng: 8.425534 }`  
4. A `get()` function returning the lunch as string

Done!


## The API
**<a href="http://ka-lunch.de/api/getAll" target="blank">/getAll</a>**  
Serves a JSON object with all restaurants and their dishes.

**<a href="http://ka-lunch.de/api/get?restaurants=Mensa,MRI-Casino" target="blank">/get?restaurants=Mensa,MRI-Casino,...</a>**  
Serves a JSON object containing all restaurants and their dishes which are set in the PATH-Param.

**<a href="http://ka-lunch.de/api/restaurants" target="blank">/restaurants</a>**  
Serves a list of supported restaurants as Objects with properties name and website.

**<a href="http://ka-lunch.de/api/menu" target="blank">/menu</a>**  
Serve all from /getAll but as html


## Why do we need this?
We use this API to load the daily lunch for our Slack-Lunchbot.  
[Try it out!](https://ka-lunch.de/)

## Authors
Luc Weinbrecht @[lwluc](https://github.com/lwluc) 
Timo Schneider @[tschneid](https://github.com/tschneid)
