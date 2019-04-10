var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var axios = require("axios");
var cheerio = require("cheerio");

// Express
var express = require("express");
var app = express();

app.use(express.static("public"));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
        extended: false
    })
);

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handelbars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/news_scraper";

mongoose.connect(MONGODB_URI);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Mongoose!");
});

var PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


app.get("/", function(req, res) {
  res.redirect("/articles");
});

app.get("/scrape", function(req, res) {
  axios
    .get("https://www.reuters.com/news/archive/newsOne")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $("story-content").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .cath(function(err) {
            console.log(err);
          });
      });

      res.send("Scrape Complete");
    });
});