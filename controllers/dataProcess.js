const axios = require('axios');
const math  = require('mathjs');

// end point to calculate simple moving average
// parametes required : vs coin and period
// return json
// format : {"SMA": [SMA_VALUE]}
module.exports.calculateSMA = async function(req, res) {
    var vs = req.param("vs");
    var period = req.param("period");
    var SMA = 0;
    var url =  getURL(vs,period);
    try {
        const response = await axios.get(url);
        SMA = computeSMA(response.data, vs);
    } catch (err) {
        console.error(err);
    }
    res.json({
        "SMA": SMA
    });
}

// end point to calculate exponential moving average
// parametes required : vs coin and period
// return json
// format : {"EMA": [EMA_VALUE]}
module.exports.calculateEMA = async function(req, res) {
    var vs = req.param("vs");
    var period = req.param("period");
    var EMA = 0;
    var url =  getURL(vs,period);
    try {
        const response = await axios.get(url);
        EMA = computeEMA(response.data, vs);
    } catch (err) {
        console.error(err);
    }
    res.json({
        "EMA": EMA
    });
}

// end point to calculate weighted moving average
// parametes required : vs coin and period
// return json
// format : {"WMA": [WMA_VALUE]}
module.exports.calculateWMA = async function(req, res) {
    var vs = req.param("vs");
    var period = req.param("period");
    var WMA = 0;
    var url =  getURL(vs,period);
    try {
        const response = await axios.get(url); 
        WMA =  computeWMA(response.data, vs);
    } catch (err) {
        console.error(err);
    }
    res.json({
        "WMA": WMA
    });

}

// end point to calculate simple, exponential and weighted moving average
// parametes required : vs coin and period
// return json
// format : {"SMA":[SMA_VALUE],"EMA":[EMA_VALUE],"WMA":[WMA_VALUE]}
module.exports.calculateAll = async function(req, res) {
    var vs = req.param("vs");
    var period = req.param("period");
    var SMA=0, EMA=0, WMA=0;
    var url =  getURL(vs,period);
    try {
        const response = await axios.get(url);
        SMA = computeSMA(response.data, vs);
        WMA =  computeWMA(response.data, vs);
        EMA = computeEMA(response.data, vs);
    } catch (err) {
        console.error(err);
    }
    res.json({
        "SMA": SMA,
        "EMA": EMA,
        "WMA": WMA
    });

}

// end point to calculate sharpee ratio
// parametes required : vs coin, period and risk free rate
// return json
// format : {"SR":[SR_VALUE]}
module.exports.calculateSharpeeRatio = async function(req, res) {
    var vs = req.param("vs");
    var period = req.param("period");
    var rfr = req.param("rfr");
    var url =  getURL(vs,period);
    var SR=0;
    try {
        const response = await axios.get(url);
        SR = computeSR(response.data, vs, rfr);
    } catch (err) {
        console.error(err);
    }
    res.json({
        "SR": SR
    });
}


//helping function to calculate WMA
//formula: Sum of weight*price divide by sum of weights
function computeWMA(data, vs){
    var length = 0, sum = 0;
    var weight = 0;
    if(isWaveCurrency(vs)){
        length = data['data'].length;
        for(var i=length-1, j=1; i>=0; i--, j++){
            sum +=  data['data'][i]['data']['weightedAveragePrice'] * j ;
            weight += j;
        }
    }else{
        length = data['prices'].length;
        for(var i=length-1, j=1; i>=0; i--, j++){
            sum +=  data.prices[i][1] * j;
            weight += j;
        }
    }
    return  sum/weight;
}

//helping function to calculate SMA
//formula: Sum of prices / total number of prices 
function computeSMA(data, vs){
    var length = 0, sum = 0;
    if(isWaveCurrency(vs)){
        length = data['data'].length;
        for(var i=0; i < length; i++){
            sum += data['data'][i]['data']['weightedAveragePrice'];
        }
    }else{
        length = data['prices'].length;
        for(var i=0; i<length; i++){
            sum +=  data.prices[i][1];
        }
    }
    return sum/length;
}


//helping function to calculate EMA
//first calculate soothing factor - formula: 2 / (length +1)
//formula of EMA: (soothingFactor * currentPrice) + ((1-soothingFactor) * last EMA)
function computeEMA(data, vs){
    var length = 0,  EMA=0;
    if(isWaveCurrency(vs)){
        length = data['data'].length;
        var soothingFactor = 2 / ( length+1);
        EMA = data['data'][length-1]['data']['weightedAveragePrice'];
        for(var i=length-2; i>=0; i--){
            EMA = (soothingFactor * data['data'][i]['data']['weightedAveragePrice']) + ( (1 - soothingFactor) * EMA ) ;
        }
    }else{
        length = data['prices'].length;
        var soothingFactor = 2 / (length+1);
        EMA = data.prices[length-1][1];
        for(var i=length-2; i>=0; i--){
            EMA = (soothingFactor * data.prices[i][1]) + ( (1 - soothingFactor) * EMA ) ;
        }
    }
    return EMA;
}


//helping function to calculate SR
//formula : (roi - rfr)/sd
function computeSR(data, vs, rfr){
    var length = 0;
    var sr=0;
    var arr = [];
    if(isWaveCurrency(vs)){
        length = data['data'].length;
        for(var i=1; i<length; i++){
            arr[i-1] = ((data['data'][i]['data']['weightedAveragePrice']  / data['data'][i-1]['data']['weightedAveragePrice'] ) -1 ) * 100 ;
        }
    }else{
        length = data['prices'].length;
        for(var i=1; i<length; i++){
            arr[i-1] = ((data.prices[i][1] / data.prices[i-1][1]) -1 ) * 100 ;
        }  
    }
    var roi =  math.mean(arr); 
    var sd = math.std(arr);
    sr = (roi - rfr)/sd;
    return sr;
}

//reading the data from two apis coingecko and wavescap
function getURL(vs, period){
    var url;
    if(!isWaveCurrency(vs)){
        var days = getDays(period);
        url = `https://api.coingecko.com/api/v3/coins/waves/market_chart?vs_currency=${vs}&days=${days}&interval=daily`
    }else {
        url = `https://wavescap.com/api/chart/pair/WAVES-${vs}-${period}.json`
    }
    return url;

}


//converting the period in days
function getDays(period){
    var days = 1;
    const first = parseInt(period.charAt(0));
    const last = period.charAt(period.length - 1);
    if(last == "d")
        days = first;
    else if(last == "w")
        days = first*7;
    else if (last == "m")
        days = first * 30;
    else if (last == "y")
        days = first * 365;
    return days;
}

//util fucntion
function isWaveCurrency(vs){
    if(vs == "usd" || vs == "eur" || vs== "jpy" || vs == "ltc"
    ||  vs == "btc" ||  vs == "eth")
        return false;
    return true;
}

