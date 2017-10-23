// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");

// Set up the Express App
// =============================================================
var app = express();
var port = process.env.PORT || 3000;

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

// //connect to MySql DB
// // =============================================================
// var mysql = require("mysql");
// var connection;

// if (process.env.JAWSDB_URL) {
//   connection = mysql.createConnection(process.env.JAWSDB_URL);
// } else {
//   connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "burgers_db"
//   });
// }

// connection.connect(function(err) {
//   if (err) {
//     console.error("error connecting: " + err.stack);
//     return;
//   }
//   console.log("connected as id " + connection.threadId);
// });

// Serve index.handlebars to the root route.
//get all the burgers and render to index via handlebars
// =============================================================
app.get("/", function(req, res) {

    //render the response using handlebars
    res.render("index");
});



// Retrieve all burgers for the api page
// =============================================================
// app.get("/api/burgers", function(req, res) {
//   connection.query("SELECT * FROM burgers;", function(err, data) {
//     if (err) {
//       return res.status(500).end();
//     }
//     //show all burger data in json format
//     res.json(data);
//   });
// });


// Update-da-burger - this route is called when a burger is updated
// update the devoured boolean of a burger using the id to specify the burger to be updated
// =============================================================
// app.put("/", function(req, res) {
//   connection.query("UPDATE burgers SET devoured = ? WHERE id = ?", [req.body.devoured, req.body.id], function(err, result) {
//     if (err) {
//       // If an error occurred, send a generic server faliure
//       return res.status(500).end();
//     } else if (result.changedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//       console.log("No such burger exists!")
//     } else {
//       res.status(200).end();
//     }
//   });
// });


// Create-da-burger - this route is called when a burger is created
// insert the new burger into the db
// =============================================================
// app.post("/", function(req, res) {
//   connection.query("INSERT INTO burgers (burger_name, devoured) VALUES (?, 0)", [req.body.burger_name], function(err, result) {
//     if (err) {
//       return res.status(500).end();
//     }
//     // Send back the ID of the new todo
//     res.json({ id: result.insertId });
//     console.log("New Burger "+ { id: result.insertId });
//   });
// });


//start the express server
app.listen(port, function() {
  console.log("Listening on PORT " + port);
});
  