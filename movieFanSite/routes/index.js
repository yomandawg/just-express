var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = '123456789';
const apiBaseUrl = 'http://localhost:3030';
const nowPlayingUrl = `${apiBaseUrl}/most_popular?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
})

/* GET home page. */
router.get('/', function(req, res, next) {
  request.get(nowPlayingUrl, (err, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    res.render('index', {
      parsedData: parsedData.results
    })
  });
});

router.get('/json', (req, res) => {
  request.get(nowPlayingUrl, (err, response, movieData) => {
    res.json(JSON.parse(movieData));
  });
});

// use the wildcard for id
router.get('/movie/:id', (req, res, next) => {
  // res.json(req.params.id) // `params` stores the wildcard parameter
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  // res.send(thisMovieUrl);
  request.get(thisMovieUrl, (err, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    res.render('single-movie', {
      parsedData
    })
  });
});

router.post('/search', (req, res, next) => {
  // res.send('sanity check');
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  request.get(movieUrl, (err, response, movieData) => {
    let parsedData = JSON.parse(movieData);
    // res.json(parsedData)
    if(cat == 'person') {
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results
    })
  });
});

module.exports = router;
