const express = require('express'); //import express
const router  = express.Router(); 
const dataProcess_controller = require('../controllers/dataProcess');

router.get('/Simple/:vs/:period', dataProcess_controller.calculateSMA); 
router.get('/Exponential/:vs/:period', dataProcess_controller.calculateEMA); 
router.get('/Weighted/:vs/:period', dataProcess_controller.calculateWMA); 
router.get('/All/:vs/:period', dataProcess_controller.calculateAll); 
router.get('/SharpeeRatio/:vs/:period/:rfr', dataProcess_controller.calculateSharpeeRatio);

module.exports = router; // export to use in server.js