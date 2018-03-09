//$ heroku config | grep MONGODB_URI
//MONGODB_URI: mongodb://heroku_81wwvkvb:b7toem6p1aaeih7umf9pmssr9s@ds231205.mlab.com:31205/heroku_81wwvkvb

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
// Require all models (one in this case)
var db = require("./models");

// Scraping tools
// =============================================================
// Axios is a promised-based http library, similar to jQuery's Ajax method
//  It works on the client and on the server
// Cheerio parses markup and provides an API for traversing/manipulating the resulting data structure.
var axios = require("axios");
var cheerio = require("cheerio");

// Set up the Express App
// =============================================================
var app = express();
var port = process.env.PORT || 3002;

// Serve static content for the app from the "public" directory in the application directory.
// =============================================================
app.use(express.static("public"));

// Configure our app for morgan and body parser
// =============================================================
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars as the default templating engine.
// =============================================================
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongo environment variable for Heroku or local
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/updateIreland";
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Routes
// =============================================================
// Serve index.handlebars to the root route.
// =============================================================
app.get("/", function(req, res) {
  return res.render("index");
});

// =============================================================
// This route scrapes all the requested data from 4 Irish News
// sources, create and object for each article and inserts the
// object into the updateIreland DB - Articles collection
// =============================================================
app.get("/scrape", function(req, res) {
  //delete the collection before searching to prevent duplicate articles
  db.Article.remove({}, function(err) {
    console.log("Articles collection removed");
  });
  // =============================================================
  // axios call to The Irish Independent
  // =============================================================
  axios
    .get("https://www.independent.ie/irish-news/news/")
    .then(function(response) {
      // use cheerio and save the HTML to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      //iterate through the HTML finding the .w29 class to get the data we want for each article
      $(".w29").each(function(i, element) {
        //empty object for pushing the article data
        var result = {};
        //save the article headline
        result.headline = $(this)
          .find("h2")
          .children("span")
          .text();
        //save the summary
        result.summary = $(this)
          .find("p")
          .text();
        //save the url for the article
        result.link = $(this)
          .children("a")
          .attr("href");
        //the source property allows to sort the data once retrieved from the DB
        result.source = "independent";

        //insert the newly created article object into the Mongo DB
        db.Article
          .create(result)
          .then(function(dbArticle) {
            console.log("Independent Scrape Complete!");
          })
          .catch(function(err) {
            console.log("independent Error!");
          });
      }); //end w29.each
    });

  // =============================================================
  // axios call to The Irish Times
  // =============================================================
  axios.get("https://www.irishtimes.com/news/ireland").then(function(response) {
    // use cheerio and save the HTML to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    //iterate through the HTML finding the .span4 class to get the data we want for each article
    $(".span4").each(function(i, element) {
      //empty object for pushing the article data
      var result = {};
      //save the article headline
      result.headline = $(this)
        .find(".h2")
        .text()
        .trim();
      //save the summary
      result.summary = $(this)
        .find("p")
        .children("a")
        .text()
        .trim();
      //complete the partially provided link to the article
      let concatLink =
        "https://www.irishtimes.com" +
        $(this)
          .children("a")
          .attr("href")
          .trim();
      //save the link to the object
      result.link = concatLink;
      //the source property allows to sort the data once retrieved from the DB
      result.source = "times";
      //insert the newly created article object into the Mongo DB
      db.Article
        .create(result)
        .then(function(dbArticle) {
          console.log("Times Scrape Complete!");
        })
        .catch(function(err) {
          console.log("times Error!");
        });
    }); //end span4.each
  }); //end IrishTimes axios

  // =============================================================
  // axios call to Midwest Irish Radio
  // =============================================================
  axios
    .get("http://www.midwestradio.ie/index.php/news-latest")
    .then(function(response) {
      
      // use cheerio and save the HTML to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      //iterate through the HTML finding the ".allmode-title" class to get the data we want for each article
      $(".allmode-title").each(function(i, element) {
        //empty object for pushing the article data
        var result = {};
        //save the article headline
        result.headline = $(this)
          .children("a")
          .text()
          .trim();
        //complete the partially provided link to the article
        let concatLink =
          "http://www.midwestradio.ie" +
          $(this)
            .children("a")
            .attr("href");
        //save the link to the object
        result.link = concatLink;
        //the source property allows to sort the data once retrieved from the DB
        result.source = "midwest";
        //insert the newly created article object into the Mongo DB
        db.Article
          .create(result)
          .then(function(dbArticle) {
            console.log("Midwest Scrape Complete!");
          })
          .catch(function(err) {
            console.log("Midwest Error!");
            // If an error occurred, send it to the clients
          });
      }); //end list-title.each
    }); //end midwest axios

  // =============================================================
  // axios call to RTE
  // =============================================================
  axios.get("https://www.rte.ie/news/ireland/").then(function(response) {
    // use cheerio and save the HTML to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    //iterate through the HTML finding the .pillar-news class to get the data we want for each article
    $(".pillar-news").each(function(i, element) {
      //empty object for pushing the article data
      var result = {};
      //save the article headline
      result.headline = $(this)
        .find(".underline")
        .text()
        .trim();
      //complete the partially provided link to the article
      let concatLink =
        "https://www.rte.ie" +
        $(this)
          .children("a")
          .attr("href");
      //save the link to the object
      result.link = concatLink;
      //the source property allows to sort the data once retrieved from the DB
      result.source = "rte";

      // ensure that all articles pushed into the DB have a link
      if (
        $(this)
          .children("a")
          .attr("href") != undefined
      ) {
        //insert the newly created article object into the Mongo DB
        db.Article
          .create(result)
          .then(function(dbArticle) {
            res.send("RTE Scrape Complete");
          })
          .catch(function(err) {
            console.log("RTE Error!");
          });
      }
    }); //end pillar-news.each
  });
});

// =============================================================
// API route that pull all the articles from the article collection
// =============================================================

app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      // if the request was successful, send back the Article data
      return res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      return res.json(err);
    });
});

//start the express server
app.listen(port, function() {
  console.log("App running on port " + port + "!");
});
