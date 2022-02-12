const express = require('express'); //import express
const router  = express.Router(); 
const nutrino_controller = require('../controllers/nutrino');

router.get('/getRate/:coin', nutrino_controller.getRate); 
router.get('/getRate', nutrino_controller.getRates); 
router.get('/getProfit/:coin/:amount/:period', nutrino_controller.getProfit); 

module.exports = router; // export to use in server.js