const axios = require('axios');
const math  = require('mathjs');
global.apyCoins = new Array();


const neutrinoURL = `https://dev.pywaves.org/neutrino/json`;

getCoins();




module.exports.getRate = async function(req, res) {
    var coin = req.param("coin");
    var currentRate =0;
    try {
        const response = await axios.get(neutrinoURL);
        var dataJson = response.data;
        currentRate = dataJson[coin+"-apy"]['last'];
    } catch (err) {
        console.error(err);
    }
    res.json({
        "currentRate": currentRate
    });
}

module.exports.getRates = async function(req, res) {
    var ratesJson = {rates : [] };
    try {
        const response = await axios.get(neutrinoURL);
        var dataJson = response.data;
        for(var i=0; i< apyCoins.length; i++) {
            var name = apyCoins[i];
            ratesJson.rates.push({"name":name , "currentRate": dataJson[name+"-apy"]['last']});
        }
    } catch (err) {
        console.error(err);
    }
    res.json(ratesJson);
}

module.exports.getProfit = async function(req, res) {
    var coin = req.param("coin");
    var amount = parseInt(req.param("amount"));
    var period = parseInt(req.param("period"));
    var profit =0;
    try {
        const response = await axios.get(neutrinoURL);
        var dataJson = response.data;
        var currentRate = dataJson[coin+"-apy"]['last'];
        profit = ((currentRate/100) * amount * (period/365)) + amount ; 
    } catch (err) {
        console.error(err);
    }
    res.json({
        "profit": profit
    });
}


async function getCoins(){
    try {
        const response = await axios.get(neutrinoURL);
        var dataJson = response.data;
        for(var data in dataJson) {
            var name = data.split("-");
            if(name.length == 2 && name[1].toLowerCase() == "apy" ){
                apyCoins.push(name[0].toLowerCase());
            }
        }
    } catch (err) {
        console.error(err);
    }
}
