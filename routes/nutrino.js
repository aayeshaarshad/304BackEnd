const express = require('express'); //import express
const router  = express.Router(); 
const nutrino_controller = require('../controllers/nutrino');


//get staking rate of specific coin
router.get('/getRate/:coin', nutrino_controller.getRate); 

//get rate of all neutrino coins
router.get('/getRate', nutrino_controller.getRates); 

//get the profit - passing argument coin, amount, and time period
router.get('/getProfit/:coin/:amount/:period', nutrino_controller.getProfit); 

module.exports = router; // export to use in server.js
