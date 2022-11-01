require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Globalish variables
const urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// mount body parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl", function (req, res) {
  // Handle the data in the request
  let inputUrl = req.body.url;
  const response = addUrlToUrls(inputUrl);
  res.json(response);
});


app.get("/api/shorturl/:inputID", (req, res) => {
  let inputID = req.params.inputID;
  let urlFound = shortUrlExists(inputID);
  if (urlFound) {
    res.redirect(urlFound);
  } else {
    res.json("This is not the endpoint you are looking for");
    return;
  }
});

const addUrlToUrls = (url) => {
  if (!validUrl(url)) return { error: 'invalid url' };
  const urlAndShort = { original_url: url, short_url: urls.length };
  urls.push(urlAndShort);
  return urlAndShort;
}


const validUrl = (url) => {
  try {
    let urlObject = new URL(url);
    if (url.substring(0, 3) === "ftp") return false;
    return true;
  } catch (error) {
    return false;
  }
}

const shortUrlExists = (shortUrl) => {
  let findResult = false;
  urls.forEach(eUrl => {
    if (eUrl.short_url == shortUrl) {
      findResult = eUrl.original_url;
      return;
    }
  });
  return findResult;
}