var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");
var textFile = "log.txt";
var result = [];

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
            console.log("Invalid commands! Please only enter valid commands -" + "\n" +
            "'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'");
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
                var twitterResults = tweet.text + "\n";
                console.log(twitterResults);
                result.push(twitterResults);
                
            });
            
            appendResults();
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
        var artist = "Artist(s): " + JSON.stringify(data.tracks.items[0].artists[0].name);
        
        // * The song's name
        var song = "Song: " + JSON.stringify(data.tracks.items[0].name);
       
        // * A preview link of the song from Spotify
        var link = "Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url);

        // * The album that the song is from
        var album = "Album Name: " + JSON.stringify(data.tracks.items[0].album.name);
        // concatenate results
        var spotifyResults = artist + "\n" + song + "\n" + link + "\n" + album;
        // print results 
        console.log(spotifyResults);
        result.push(spotifyResults);
        appendResults();
    });
}// end of getSong function

function getMovie() {
    var movieName = "Mr. Nobody";

    input.length !== 0 ? movieName = input : movieName;

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // * Title of the movie.
            var title = "Title: " + JSON.parse(body).Title;
           
            // * Year the movie came out.
            var year = "Year: " + JSON.parse(body).Year;
          
            // * IMDB Rating of the movie.
            var imdb = "IMDB Ratings: " + JSON.parse(body).imdbRating;
            
            // * Rotten Tomatoes Rating of the movie.
            var rt = "Rottern Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
            
            // * Country where the movie was produced.
            var country = "Country: " + JSON.parse(body).Country;
            
            // * Language of the movie.
            var language = "Language: " + JSON.parse(body).Language;
           
            // * Plot of the movie.
            var plot = "Plot: " + JSON.parse(body).Plot;
         
            // * Actors in the movie.
            var actors = "Actors: " + JSON.parse(body).Actors;
            // concatenate results
            var movieResults = title + "\n" + year + "\n" + imdb + "\n" + rt + "\n" + country + "\n" + language + "\n" + plot + "\n" + actors;
            // print results
            console.log(movieResults);
            result.push(movieResults);
            appendResults();
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

function appendResults(){
    fs.appendFile(textFile, result, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("");
            console.log("Results have been appended to log.txt file!");
        }
    });
}

runCommands();