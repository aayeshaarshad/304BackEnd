const axios = require('axios');
global.coinIDNameMap = new Map();
initializeCoins();


async function initializeCoins (){
    const response =  await axios.get(`https://wavescap.com/api/assets.json`);
    const data = response.data;
    for(var i=0; i<data.length; i++){
        coinIDNameMap.set(data[i]['id'], data[i]['name']);
    }
}


module.exports.getMarkets = async function(req, res) {
    try {
        const response = await axios.get(
           `https://wavescap.com/api/markets/WAVES.json`
        );
        let marketPrice = await parseMarketResponse(response.data);
        res.json(marketPrice);

    } catch (err) {
        console.error(err);
        res.json({
           "error":"data not available"
        });
    }
    
}


module.exports.getCurrencies = async function(req, res) {
    res.json({"coins":[
        {"price_asset_id":"usd","name":"USD"},
        {"price_asset_id":"eur","name":"Euro"},
        {"price_asset_id":"jpy","name":"JPY"},
        {"price_asset_id":"btc","name":"Bitcoin"},
        {"price_asset_id":"ltc","name":"Litecoin"},
        {"price_asset_id":"etc","name":"Ethereum"},
        {"price_asset_id":"6XtHjpXbs9RRJP2Sr9GUyVqzACcby9TkThHXnjVC5CDJ","name":"USD Coin"},
        {"price_asset_id":"DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p","name":"USD Neutrino"},
        {"price_asset_id":"34N9YcEETLWn93qYQ64EsP1x89tSruJU44RrEMSXXEPJ","name":"USD Tether"},
        {"price_asset_id":"DxFwXxS1r3uZ2QEiSqhe6uoXMJBsz4ShLtHvr4HDzNri","name":"BRL Neutrino"},
        {"price_asset_id":"9LNqjybyCX1oexCub4yY7hdJf6aeP4HeV5LpsjcNHwRR","name":"CNY Neutrino"},
        {"price_asset_id":"8zKqZF6asB6yiK8rv9nMUkJ7wAVBJndSmkC7SXJhRrM3","name":"UAH Neutrino"},
        {"price_asset_id":"DhaaqiG8xz8njeBuMtTM2G6avg9Jdhfrxw5onm5GaXx1","name":"GBP Neutrino"},
        {"price_asset_id":"8inca5fv4xr6KZtRMRPYr7vADfk8fd6G2z1gMoRkbUYS","name":"JPY Neutrino"},
        {"price_asset_id":"DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t","name":"EUR Neutrino"},
        {"price_asset_id":"5NmV5VAhkqormdwvaQjE54yPEkNwSRtcXxhLkJbVQqkN","name":"NGN Neutrino"},
        {"price_asset_id":"DGbqkzM6Ds5NAF2B3GHYfyZRmWKt7xLYRYcwpMm7D6V4","name":"TRY Neutrino"},
        {"price_asset_id":"eWeMD5KNeuRaALCAb4uuJKtAvon2JcTyXQyoBMhuN2X","name":"RUB Neutrino"},
        ]});
}

async function parseMarketResponse(data){
    var marketJson = {marketPrice : [] };
    for(var i=0; i<data.length; i++){
        if( data[i]['amount_asset_id'].toLowerCase() == "waves"){
            let price_asset_id =  data[i]['price_asset_id'];
            let name = "UNKNOWN";
            if(coinIDNameMap.has(price_asset_id)){
                name =  coinIDNameMap.get(price_asset_id);
            }
            let lastPrice = data[i]['data']['lastPrice'];
            let volume = data[i]['data']['volume'];
            marketJson.marketPrice.push({"price_asset_id":price_asset_id, "vs": name, "lastPrice":lastPrice, "volume":volume});
        }
    }
    return marketJson;
}