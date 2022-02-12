const express = require('express'); //import express
const router  = express.Router(); 
const waves_controller = require('../controllers/waves');

router.get('/getCurrencies', waves_controller.getCurrencies); 
router.get('/getMarkets', waves_controller.getMarkets); 



module.exports = router; // export to use in server.js