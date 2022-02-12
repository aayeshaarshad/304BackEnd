

const express = require('express'); //import express
const router  = express.Router(); 
const dataProcess_controller = require('../controllers/dataProcess');


//get the simple Moving average - passing parameters vs currency and time period
router.get('/Simple/:vs/:period', dataProcess_controller.calculateSMA); 

//get the Exponential moiving average - passing parameters vs currency and time period
router.get('/Exponential/:vs/:period', dataProcess_controller.calculateEMA); 

//get the Weighted Moving average - passing parameters vs currency and time period
router.get('/Weighted/:vs/:period', dataProcess_controller.calculateWMA); 

//get the Simple, Exponential, Weighted Moving averages - passing parameters vs currency and time period
router.get('/All/:vs/:period', dataProcess_controller.calculateAll); 

//get the sharpee ratio against vs currency, period and risk free rate
router.get('/SharpeeRatio/:vs/:period/:rfr', dataProcess_controller.calculateSharpeeRatio);

module.exports = router; // export to use in server.js
