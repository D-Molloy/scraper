# IrelandUpdate - Irish News Scraper
**IrelandUpdate** is a full-stack site that uses scrapes news articles from Irish news sites.  Inspired by my Irish immigrant parents and their love of keeping up-to-date with the happenings in their homeland.  The site uses axios calls to scrape data from The Irish Independent, Irish Times, RTE, and Midwest Radio.  Then cheerio is used to traverse the HTML documents from the axios calls to find the specified items, and the article data is pushed to the MongoDB.

Key Files:
* server.js - contains the express server and routes for rendering the site using handlebars ("/"), scraping the sites and inserting data into the DB ("/scrape"), and pulling the article data from the database ("/articles").
* scrape.js - contains the event handler for the button click that calls the /scrape route along with the populateDiv function that takes the article data and adds it to the DOM
* style.css - custom stylings and media queries to ensure responsive design
    
Technologies used:
* HTML
* Javascript
* CSS (Materialize framework and a custom stylesheet)
* Node.js
* Express.js
* Handlebars.js
* MongoDB/Mongoose