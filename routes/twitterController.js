const express = require('express'); //import express
const router  = express.Router(); 
const twitter_controller = require('../controllers/twitterController');

//get the twitter sentiments
router.get('/getTwitterSentiments', twitter_controller.calculate); 

module.exports = router; // export to use in server.js
