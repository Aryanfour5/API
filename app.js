const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
 
//TODO
main().catch(err => console.log(err));
 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}  
// mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});
 
const articleSchema=new mongoose.Schema({
    title: String,
    content:String
});
 
const Article= mongoose.model("Article",articleSchema);
 
app.get("/articles", async(req,res)=>{
    try{
    const foundArticles= await Article.find();
        // console.log(foundArticles);
        res.send(foundArticles);
    }catch(err){
        // console.log(err);
        res.send(err);
    }
});
 

// POST route to create a new article
app.post("/articles", async (req, res) => {
    const { title, content } = req.body;
  
    try {
      const newArticle = new Article({
        title,
        content,
      });
      await newArticle.save();
      res.status(201).json(newArticle); // Respond with the created article
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // PUT route to update an existing article
  app.put("/articles/:articleId", async (req, res) => {
    const { articleId } = req.params;
    const { title, content } = req.body;
  
    try {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { title, content },
        { new: true } // Return the updated document
      );
      if (!updatedArticle) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(updatedArticle);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // DELETE route to delete an article
  app.delete("/articles/:articleId", async (req, res) => {
    const { articleId } = req.params;
  
    try {
      const deletedArticle = await Article.findByIdAndRemove(articleId);
      if (!deletedArticle) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
 
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});