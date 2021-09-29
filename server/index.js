const express = require('express');
const axios = require("axios");
const cors = require('cors');
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

const url = "https://www.columbiacommunityconnection.com/the-dalles?format=rss";

function parseHTML (html, selector) {
  const $ = cheerio.load(html)
  let posts=[]
  $(selector)
   .map(function () {
     let post={
       title:$(this).find('title').text(),
       html:$(this).html()
     }
    posts.push(post);
   } 
  )
  return posts
 }

async function scrapeData() {
  try {
    const { data } = await axios.get(url);
    return parseHTML(data, 'item')
  } catch (err) {
    console.error(err);
  }
}


app.get("/api", async (req, res) => {
let data = await scrapeData(); 
  res.send(data);
});

if(process.env.NODE_ENV=='production'){
  app.use(express.static('client/build'));
  const path=require('path');
  app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});