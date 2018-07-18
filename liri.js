js
require("dotenv").config(keys.js);

// This variable is used to call the twitter API.
var client = new client(keys.twitter);

// This variable is used to access Twitter API keys in the keys.js javascript file.
var twitterKeysFile = require("./keys.js");

// This variable is used to access the Spotify API key.
var spotify = new Spotify(keys.spotify);

// NPM module used to access OMDB API.
var request = require("request");

// This variable reads the random.txt file used to call the spotify song "I want it that way".
var randomtext = require("fs");

// This variable is the output file for all logs.
var logname = './log.txt';

// This variable is used for logging solution.
var logging = require('simple-node-logger').createSimpleFileLogger(logname);

// All log information printed to log.txt.
logging.setLevel('all');

// This variable requests the action.
var requestaction = process.argv[2];

// This variable requests specific information based on action type.
var argument = "";

// This control function determines what action is taken and the specific data used to complete that action.
doSomething(requestaction, argument);

// This function switches the operation used to determine which course of action to take.
function doSomething(action, argument) {

    // This variable controls the third argument and defines specific data relating to the action when requesting song information.
    argument = getThirdArgument();

    switch (action) {

        // This section gets the list of tweets.
        case "my-tweets":
            getMyTweets();
            break;

            // This section gathers the song's information.
        case "spotify-this-song":

            // This section FIRST gathers the song title argument.
            var songTitle = argument;

            // In this section, if no song title is provided it defaults to a specific song.
            if (songTitle === "") {
                lookupSpecificSong();

                // This section gives the user the option to look up a song based on the songs title. 
            } else {

                // This section gathers the information about the song from spotify.
                getSongInfo(songTitle);
            }
            break;

            // This section get the information for the movie.
        case "movie-this":

        // This section FIRST gets the movie title argument that was declared.
            var movieTitle = argument;

            // In this section, if there is no movie title provided for the movie, the movie will default to a specific movie.
            if (movieTitle === "") {
                getMovieInfo("Mr. Nobody");

                // In this section, If you need another option, it looks up a song based on the movie title.
            } else {
                getMovieInfo(movieTitle);
            }
            break;

            // This section gets the text inside the file and uses it to do something commanded.
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

// This function returns the third argument, as an example when requesting information about the song, include the title of the song.
function getThirdArgument() {

    // This variable stores all possible arguments in the array.
    argumentArray = process.argv;

    // This section causes looping through words in the node argument.
    for (var i = 3; i < argumentArray.length; i++) {
        argument += argumentArray[i];
    }
    return argument;
}

// This function shows my last 20 tweets.
function getMyTweets() {

    // This variable passes the Twitter keys to call the Twitter API
    var client = new client(twitterKeysFile.twitterKeys);

    // This variable controls the search parameters of the last 20 tweets on the Denzel Washington fake Twitter account that I made.
    var parameters = {
        q: '@DenzelW38778171',
        count: 20
    };
    // This section shows up to the last 20 tweets and when they were created in the terminal.
    client.get('search/tweets', parameters, function (error, tweets, response) {
        if (!error) {

            // This section loops through the tweets and prints out the tweets text and the creation date of the tweet.
            for (var i = 0; i < tweets.statuses.length; i++) {
                var tweetText = tweets.statuses[i].text;
                logOutput("Tweet Text: " + tweetText);
                var tweetCreationDate = tweets.statuses[i].created_at;
                logOutput("Tweet Creation Date: " + tweetCreationDate);
            }
        } else {
            logOutput(error);
        }
    });
}

// This function calls the spotify API to retrieve song information for the song title.
function getSongInfo(songTitle) {

    // This variable calls the Spotify API to retrieve or fetch a song track.
    spotify.search({
        type: 'track',
        query: songTitle
    }, function (err, data) {
        if (err) {
            logOutput.error(err);
            return;
        }

        // This variable controls the amount of songs that are allowed to be returned.
        var artistsArray = data.tracks.items[0].album.artists;

        // This variable holds the artists names when one or more artists exist for the same song name.
        var artistsNames = [];

        // This variable pushes the artists for the song to the array.
        for (var i = 0; i < artistsArray.length; i++) {
            artistsNames.push(artistsArray[i].name);
        }
        // This variable converts the artists array to a string and makes it look nice.
        var artists = artistsNames.join(", ");

        // This section prints out all of the artists, track names, preview url's, and album names.
        // Prints the artist(s), track name, preview url, and album name.
        logOutput("Artist(s): " + artists);
        logOutput("Song: " + data.tracks.items[0].name);
        logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url);
        logOutput("Album Name: " + data.tracks.items[0].album.name);
    });

}
// This function when no song title is given defaults to a specific song The Sign.
function lookupSpecificSong() {

    // This section calls the Spotify API to retrieve a specific song track The Sign by Ace of Base.
    spotify.lookup({
        type: 'track',
        id: '3DYVWvPh3kGwPasp7yjahc'
    }, function (err, data) {
        if (err) {
            logOutput.error(err);
            return;
        }
        // This section prints the artist, the song name, the preview url, and the album name.
        logOutput("Artist: " + data.artists[0].name);
        logOutput("Song: " + data.name);
        logOutput("Spotify Preview URL: " + data.preview_url);
        logOutput("Album Name: " + data.album.name);
    });
}

// This function passes a query URL to OMDB to get the movie information for the movie title, if there is no movie title provided the movie defaults to Mr.Nobody.
function getMovieInfo(movieTitle) {

    // This variable runs a request to the OMBD API with the specific movie title that you want.
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";

    request(queryUrl, function (error, response, body) {

        // This section displays if the request is successful.
        if (!error && response.statusCode === 200) {

            // This variable parses the body of the site and it recovers the information for the movie.
            var movie = JSON.parse(body);

            // This section prints out the information for the movies.
            logOutput("Movie Title: " + movie.Title);
            logOutput("Release Year: " + movie.Year);
            logOutput("IMDB Rating: " + movie.imdbRating);
            logOutput("Country Produced In: " + movie.Country);
            logOutput("Language: " + movie.Language);
            logOutput("Plot: " + movie.Plot);
            logOutput("Actors: " + movie.Actors);

            // This section sets an array value to debug API response that returns N/A for movie.tomatoRating.
            logOutput("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
            logOutput("Rotten Tomatoes URL: " + movie.tomatoURL);
        }
    });
}
// This function uses the fs node package to take the text inside RANDOM.TXT and does something with it.
function doWhatItSays() {

    randomtext.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            logOutput.error(err);
        } else {

            // This variable creates an array with data.
            var randomArray = data.split(",");

            // This variable sets an action to the first item in the array.
            requestaction = randomArray[0];

            // This variable sets a third argument to the second item in the array.
            argument = randomArray[1];

            // This section calls the main controller to do something based on the action and argument.
            doSomething(requestaction, argument);
        }
    });
}

// This variable logs the data to the terminal and outputs the data to a text file.
function logOutput(logText) {
    logging.info(logText);
    console.log(logText);
}