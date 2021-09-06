const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = new mongoose.model("Article", articleSchema);

app
  .route("/articles")
  // Requests targeting all articles in DB
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });
// Requests targeting all articles in DB

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send(err);
        }
      }
    );
  })
  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("successfully updated individual article.");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("successfully updated individual article.");
        }
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function(err, result) {
        if(!err) {
          if (result.deletedCount === 1) {
            res.send("Succesfully deleted article");
          } else {
            res.send("Article not found!");  
          }
        } else {
          res.send(err);
        }
      }
    );
  });
// app.get("/articles", );

// app.post("/articles" , );

// app.delete("/articles" , );
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
