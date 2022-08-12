require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Mount body-parser middleware for POST req
app.use(bodyParser.urlencoded({extended : false}));

// Shortened urls persistence (in-memory)
let short_urls = [];

// Strip http(s):// from url
const parseHostName = (url)=>{
  const re = /^https?:\/\/\w+/
  if (!re.test(url)) return "";
  return urlParser.parse(url,true).hostname;
}

// ENDPOINTS //

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// url shortener
// TODO : debug  && add try catch logic
app.post('/api/shorturl',
  (req, res, next)=>{
    let url = parseHostName(req.body.url);
    let invalidUrl = {"error": "invalid url"};
    let invalidHost = {"error": "Invalid Hostname"};

    if (!url) return res.json(invalidUrl);
    dns.lookup(url, (err)=>{
      if (err) return res.json(invalidHost);
      next();
    });
  }, (req, res)=>{
    short_urls.push({
      "original_url": req.body.url,
      "short_url": short_urls.length
    });
    let result = short_urls[short_urls.length - 1];
    res.json(result);
  }
);




app.get('/api/shorturl/:number', (req, res)=>{
  let shortU = req.params.number;
  let notFound = {"error": "No short URL found for the given input"}
  if (!short_urls[shortU]) return res.json(notFound);
  res.redirect(short_urls[shortU].original_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
