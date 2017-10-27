//$ heroku config | grep MONGODB_URI
//MONGODB_URI: mongodb://heroku_81wwvkvb:b7toem6p1aaeih7umf9pmssr9s@ds231205.mlab.com:31205/heroku_81wwvkvb

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Require all models
var db = require("./models");

// Scraping tools
// =============================================================
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Set up the Express App
// =============================================================
var app = express();
var port = process.env.PORT || 3002;

// Serve static content for the app from the "public" directory in the application directory.
// =============================================================
app.use(express.static("public"));

// Parse application/x-www-form-urlencoded
// =============================================================
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
// scrape sites and render to index via handlebars
// =============================================================
app.get("/", function(req, res) {
  //render the response using handlebars
  return res.render("index");
});


app.get("/scrape", function(req, res) {
  //delete the collections before searching
  db.Article.remove({}, function(err) {
    console.log("Articles collection removed");
  });

  axios
    .get("https://www.independent.ie/irish-news/news/")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // console.log(response);
      $(".w29").each(function(i, element) {
        var result = {};
        //change element to this?
        result.headline = $(this)
          .find("h2")
          .children("span")
          .text();
        result.summary = $(this)
          .find("p")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.source = "independent";

        db.Article
          .create(result)
          .then(function(dbArticle) {
            return res.json(dbArticle);
          })
          .catch(function(err) {
            console.log("independent Error!");
            // If an error occurred, send it to the clients
            return res.json(err);
          });
      }); //end w29.each
    })
    .catch(function(err) {
      console.log("Unable to scrape The Independent.");
    }); //end IrishInd axios

  axios
    .get("https://www.irishtimes.com/news/ireland")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // console.log(response);
      $(".span4").each(function(i, element) {
        var result = {};

        result.headline = $(this)
          .find(".h2")
          .text()
          .trim();
        // console.log("result.headline: "+result.headline);

        result.summary = $(this)
          .find("p")
          .children("a")
          .text()
          .trim();
        // console.log("result.summary: "+result.summary);

        let concatLink =
          "https://www.irishtimes.com" +
          $(this)
            .children("a")
            .attr("href")
            .trim();
        // console.log("concatLink: "+concatLink);
        result.link = concatLink;
        result.source = "times";

        db.Article
          .create(result)
          .then(function(dbArticle) {
            return res.json(dbArticle);
          })
          .catch(function(err) {
            console.log("times Error!");
            // If an error occurred, send it to the clients
            return res.json(err);
          });
      }); //end w29.each
    })
    .catch(function(err) {
      console.log("Unable to scrape The Irish Times.");
    }); //end IrishTimes axios
  axios
    .get("http://www.midwestradio.ie/index.php/news")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // console.log(response);
      $(".list-title").each(function(i, element) {
        var result = {};

        result.headline = $(this)
          .children("a")
          .text()
          .trim();
        // console.log("result.headline: "+result.headline);

        let concatLink =
          "http://www.midwestradio.ie" +
          $(this)
            .children("a")
            .attr("href");
        // console.log("concatLink: "+concatLink);
        result.link = concatLink;
        result.source = "midwest";

        db.Article
          .create(result)
          .then(function(dbArticle) {
            return res.json(dbArticle);
          })
          .catch(function(err) {
            console.log("midwest Error!");
            // If an error occurred, send it to the clients
            return res.json(err);
          });
      }); //end w29.each
    }) .catch(function(err){
      console.log("Unable to scrape Midwest Radio.")
  }) //end midwest axios

  axios.get("https://www.rte.ie/news/ireland/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // console.log(response);
    $(".pillar-news").each(function(i, element) {
      var result = {};

      result.headline = $(this)
        .find(".underline")
        .text()
        .trim();
      // console.log("result.headline: " + result.headline);

      let concatLink =
        "https://www.rte.ie" +
        $(this)
          .children("a")
          .attr("href");
      // console.log("concatLink: " + concatLink);
      result.link = concatLink;
      result.source = "rte";

      if (
        $(this)
          .children("a")
          .attr("href") != undefined
      ) {
        db.Article
          .create(result)
          .then(function(dbArticle) {
            return res.json(dbArticle);
          })
          .catch(function(err) {
            console.log("rte Error!");
            // If an error occurred, send it to the clients
            return res.json(err);
          });
      }
    }); //end w29.each
  }).catch(function(err){
    console.log("Unable to scrape RTE.")
}) //end rte axios
});

app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbIrishTimes) {
      // If all Notes are successfully found, send them back to the client
      return res.json(dbIrishTimes);
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
