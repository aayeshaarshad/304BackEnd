const Twit = require('twit');
const Sentiment = require('sentiment');
var fs = require('fs');
const config = require('config');


// var tweetJson = {
//     tweets: []
//  };


var positiveSum=0;
var negativeSum=0;
var nuteralSum=0;
var totalTweets = 0;
 
const sentiment = new Sentiment();
const T = new Twit({


    access_token : "146746630-jFXwDixtdTa5c42FsBfA83Mqq7Ry9B2qK5gnSLJ6",
    access_token_secret : "ZsnJmDV11iNqBxTo12MNKj5LGvb4HyYavq5neZj8RRzer",
    consumer_key : "bY1HGLRjxC1c0pmYsdZtIHHlk",
    consumer_secret : "FBezrcaDRp13JrcQEysyWfai5JMas96dsbDxVj5zABSzS3Fr8r"

    // consumer_key:  config.consumer_key,
    // consumer_secret: config.consumer_secret,
    // access_token: req.config.access_token,
    // access_token_secret: req.config.access_token_secret,
    });


var stream = T.stream('statuses/filter', 
{ track: ['waves.tech', 'SignatureChain', 'wavesprotocol', 'neutrino_proto', 'Waves', 'USDN', 'sasha35625' ] })

stream.on('tweet', async tweet => {
    const { lang, text, } = tweet;

    if (lang === 'en') {
        totalTweets += 1;
        var  score  = sentiment.analyze(text).score;
        if (score >  0) { // Treat greater than zero as 1
            positiveSum += 1;
        } else if (score < 0) { // Treat less than zero as -1
            negativeSum += 1;
        }else{
            nuteralSum += 1;
        }
    }

    // tweetJson.tweets.push({"text": text, "score":score});
    // fs.writeFile('data/tweets.json', JSON.stringify(tweetJson), function(err) {
    //     if (err) throw err;
    //     console.log('wrote');
    // });


});



module.exports.calculate = function(req, res) {

//     var json = JSON.parse(fs.readFileSync('data/tweets.json', 'utf8'));
//     var positiveSum=0;
//     var negativeSum=0;
//     var nuteralSum=0;
//     var totalTweets = json.tweets.length;

//    for(var i=0; i<totalTweets; i++){
//         if(json.tweets[i].score == 0){

//         }
//    }


    res.json({
        positive: positiveSum/totalTweets*100,
        negative: negativeSum/totalTweets*100,
        neutral:  nuteralSum/totalTweets*100,
        totalTweetRead: totalTweets 
    });
};