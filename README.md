The Lunchbot
============

*This API serves the lunch of some restaurants / canteens placed in Oststadt in Karlsruhe.*

## Feel free to add your favorite place!
Take a look at [mensa.js](src/lunch/restaurants/mensa.js) and write your own script crawling the lunch of your favorite place.  
There are only two things your file should export:
1. A name, preferable the one of the restaurant
2. A `get()` function return the lunch as string

Done!  
(Of course you could use the functions offered in [utils.js](src/lunch/utils.js)).

## The API
**[/getAll](https://oststadt-lunch.de/API/getAll)**  
Serves a JSON object with all restaurants and their dishes.

**[/get?restaurants=Mensa,MRI-Casino,...](https://oststadt-lunch.de/API//get?restaurants=Mensa,MRI-Casino)**  
Serves a JSON object containing all restaurants and their dishes which are set in the PATH-Param.

**[/restaurants](https://oststadt-lunch.de/API/restaurants)**  
Serves a list of supported restaurants as Array.