const axios = require('axios');
global.apyCoins = new Array();

//neutrino endpoint url
const neutrinoURL = `https://dev.pywaves.org/neutrino/json`;

//calling method on app start to get neutrino coin
getCoins();



//end point to get rate of specific coin
//return json in format
//  {"currentRate":[CURRENT_RATE]}
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


//get rate of all neutrino coins
//return json
//format {"rates":[{"name":"eth","currentRate":12.16},{"name":"rubn","currentRate":5.65},.... ]}
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


//endpoint to calculate profit 
// required:  amount, coin and period
//return json
// format: {"profit":[PROFIT_AMOUNT]}
module.exports.getProfit = async function(req, res) {
    var coin = req.param("coin");
    var amount = parseInt(req.param("amount"));
    var period = parseInt(req.param("period"));
    var profit =0;
    try {
        const response = await axios.get(neutrinoURL);
        var dataJson = response.data;
        var currentRate = dataJson[coin+"-apy"]['last'];
        
        //formula of profit is rate*amount*time
        //total amount after profit = profit+ initiale price
        profit = ((currentRate/100) * amount * (period/365)) + amount ; 
    } catch (err) {
        console.error(err);
    }
    res.json({
        "profit": profit
    });
}

//getting the neutrino coins
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
