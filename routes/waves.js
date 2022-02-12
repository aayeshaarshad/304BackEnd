const express = require('express'); //import express
const router  = express.Router(); 
const waves_controller = require('../controllers/waves');


//getting all currencies whom we are going to process or provide moving average and sharpee ratio
router.get('/getCurrencies', waves_controller.getCurrencies); 

//get wave market prices
router.get('/getMarkets', waves_controller.getMarkets); 



module.exports = router; // export to use in server.js
