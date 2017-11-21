var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require('request');
var inquirer = require("inquirer");

var commands = process.argv[2];
var input = process.argv.slice(3).join();

// prompt the user to provide information they want to get
// inquirer.prompt([
//     {
//         type: "input",
//         name: "",
//         message:""
//     }
// ]).then(function(response){

// })

// process.argv.forEach(function (item) {
//     console.log(item);
// })



switch (commands) {
    case "my-tweets":
        getTweets();
        break;

    case "spotify-this-song":
        getSong();
        break;

    case "movie-this":
        getMovie();
        break;

    case "do-what-it-says":
        readFile();
        break;

    default:
        console.log("Invalid commands!");
        break;
}

function getTweets() {
    // get tokens from the keys file
    var client = new Twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret       
    });
    
    // get latest tweets from my twitter
    var params = { screen_name: 'RenParanoidBot'};
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.forEach(function(tweet){
                console.log(tweet.text);
                console.log("---------");
            });          
        }
    });
}