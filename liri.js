var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");

var commands = process.argv[2];
var input = process.argv.slice(3).join();

function runCommands() {
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
    var params = { screen_name: "RenParanoidBot" };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error) {
            tweets.forEach(function (tweet) {
                console.log(tweet.text);
                console.log("---------");
            });
        }
    });
}// end of getTweets function 

function getSong() {
    var songName = "The Sign Ace of Base";
    // if user enters a song, search the info of user input, otherwise print The Sign by Ace of Base
    input.length !== 0 ? songName = input : songName;

    var spotify = new Spotify({
        id: "87bc248a3efb4703901764e0e71ade24",
        secret: "593730fdee5c48c295a4cf0d4b381509"
    });

    spotify.search({ type: "track", query: songName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        // * Artist(s)
        console.log("Artist(s): " + JSON.stringify(data.tracks.items[0].artists[0].name));
        // * The song's name
        console.log("Song: " + JSON.stringify(data.tracks.items[0].name));

        // * A preview link of the song from Spotify
        console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url));

        // * The album that the song is from
        console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name));
    });
}// end of getSong function

function getMovie() {
    var movieName = "Mr. Nobody";

    input.length !== 0 ? movieName = input : movieName;

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // * Title of the movie.
            console.log("Title: " + JSON.parse(body).Title);
            // * Year the movie came out.
            console.log("Year: " + JSON.parse(body).Year);
            // * IMDB Rating of the movie.
            console.log("IMDB Ratings: " + JSON.parse(body).imdbRating);
            // * Rotten Tomatoes Rating of the movie.
            console.log("Rottern Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            // * Country where the movie was produced.
            console.log("Country: " + JSON.parse(body).Country);
            // * Language of the movie.
            console.log("Language: " + JSON.parse(body).Language);
            // * Plot of the movie.
            console.log("Plot: " + JSON.parse(body).Plot);
            // * Actors in the movie.
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}// end of get movie function 

function readFile() {
    // read from random.txt file 
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        // split it by comma and trim empty space
        var dataArr = data.split(",");
        dataArr = dataArr.map(function (elem) {
            return elem.trim();
        });
        
        commands = dataArr[0];
        input = dataArr[1];    
        // run commands read from random.txt file
        runCommands();
    });
}

runCommands();