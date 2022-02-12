//using twit and sentiment api to read tweets and perform sentiment analysis

const Twit = require('twit');
const Sentiment = require('sentiment');



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
    });


var stream = T.stream('statuses/filter', 
{ track: ['waves.tech', 'SignatureChain', 'wavesprotocol', 'neutrino_proto', 'Waves', 'USDN', 'sasha35625' ] })


//reading tweet stream
stream.on('tweet', async tweet => {
    const { lang, text, } = tweet;

   //processing the tweet, and getting the sentiment score
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
});


//returning json with format: {"positive":[POSITIVE_PERCENT],"negative":[NEGATIVE_PERCENT],"neutral":[NEUTRAL_PERCENT],"totalTweetRead":[TOTAL_TWEETS_READ]}
module.exports.calculate = function(req, res) {
    res.json({
        positive: positiveSum/totalTweets*100,
        negative: negativeSum/totalTweets*100,
        neutral:  nuteralSum/totalTweets*100,
        totalTweetRead: totalTweets 
    });
};
