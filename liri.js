// This require dotenv will set any environment variables with this specific package.
require("dotenv").config();
// This variavle grabs all of the keys from keys.js
var keys = require("./keys.js");
// This variable controls the data retrieval that will power this app and get the twitter, spotify, and OMDB API's.
var request = require("request");
// This variable grabs the spotify API.
var Spotify = require('node-spotify-api');
// This variable grabs the twitter API.
var Twitter = require('twitter');
// This variable outputs the data into columns.
var createcolumns = require('columnify');
// This variable grabs the figlet package to create drawings from the text.
var figlet = require('figlet');
// This variable is the core node package for reading and writing all of the files.
var corenode = require("fs");

// This variable provides access to all of the keys in the keys.js file.
var keys = require("./keys.js");

// This variable prints out any command line arguments to the application console.
var input = process.argv;

// This variable holds all of the possible liri commands you can enter into this application.
var liriCommand = input[2];

// This variable holds the movie name when the liriCommand is movie-this.
var movieName = "";

// This variable holds the song name when the liriCommand is spotify-this-song.
var songName = "";

// This variable contains text that tells the user that the information that they requested in the liriapp was added to the log file.
var addedToLogFile = "Results added to log.txt file.";

// If the Liri Command is movie-this, the liri app will output the information about the movie.
if (liriCommand === "movie-this") {
    getMovieInfo();
}

// If the Liri Command is my-tweets, then the liri app will show the last 20 tweets from denzelwashingtons twitter.
else if (liriCommand === "my-tweets") {
    // This section logs the Liri Command to the log.txt file.
    logData("liri command: my-tweets");
    getLatestTweets();
}
// If the Liri Command is spotify-this-song, the liri app will show the information for the song the user specifys.
else if (liriCommand === "spotify-this-song") {
    getSongInfo(songName);
}
// If the Liri Command is do-what-it-says, then the liri app takes the text inside of the random.txt dile and then uses it to run the spotify-this-song "I want it that way.".
else if (liriCommand === "do-what-it-says") {
    // This section logs the Liri Command to the log.txt file.
    logData("liri command: do-what-it-says");
    doWhatItSays();
}
// If the Liri Command is help, this displays the command line help page to help the user.
else if (liriCommand === "help") {
    showHelp();
}
// If the user decides to enter a command that cannot be done, this section notify's the user that the command that they inputted can not be found.
else {
    console.log("Command not found. Run 'node liri.js help' to see a list of available commands.");
}
// When ran, this function gets the movie info for the specified movie that the user requested.
function getMovieInfo() {
    // If the movie that the user requested is longer than one word, the user needs to join the words together onto one line so that the move name is all in one string rather than having seperate lines for each word.
    for (var i = 3; i < input.length; i++) {

        if (i > 2 && i < input.length) {
            movieName = movieName + " " + input[i];
        }
        // As an example if the user enters "node liri.js movie this Butterfly Effect", movieName should be "Butterfly Effect" when the value is logged into the users terminal in the liri app.
    }
    // If no mive name is specified in the liri app command line, then the information for the movie Mr.Nobody will be revealed.
    if (!movieName) {
        // If the user doesn't specify a movie, set the movieName = to Mr.nobody in the liri app command line.
        movieName = "Mr Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
    // This section uses the figlet npm package to convert the movieName text into art/drawing.
    figlet(movieName, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });

    // This section will then run the request to the OMDB API with the movieName value that the user has requested in the liri app command line.
    request("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy", function (error, response, body) {

        // This section reveals if the request is successful or not to the user in the liri app.
        if (!error && response.statusCode === 200) {
            // This section parses the body of the JSON object that holds all of the movie data and displays the movie into to the user of the liri app command line.
            var movieInfo = JSON.parse(body);
            // The movieInfo is than console logged for the user.

            // This variable holds the Rotten Tomatoes Rating in the liri app.
            var tomatoRating = movieInfo.Ratings[1].Value;

            // This variable outputs the following information about the movieName.
            var movieResult =

                // This is a line break.
                "=======================================================================================================" + "\r\n" +

                // This section outputs the liri command as well as the movieName
                "liri command: movie-this " + movieName + "\r\n" +

                // This is a line break.
                "=======================================================================================================" + "\r\n" +

                // This is the title of the movie that is displayed.
                "Title: " + movieInfo.Title + "\r\n" +

                // This is the year that the movie came out that is displayed.
                "Year movie was released: " + movieInfo.Year + "\r\n" +

                // This is the IMBD rating of the movie that the user selects and is displayed.
                "IMDB movie rating (out of 10): " + movieInfo.imdbRating + "\r\n" +

                // This is the Rotten Tomatoes rating of the movie that the user selects.
                "Rotten Tomatoes rating (out of 100%): " + tomatoRating + "\r\n" +

                // This is the country where the movie was produced that is displayed to the user.
                "Filmed in: " + movieInfo.Country + "\r\n" +

                // This is the language of the movie that is displayed to the user.
                "Language: " + movieInfo.Language + "\r\n" +

                // This is the plot of the movie that is displayed to the user.
                "Movie plot: " + movieInfo.Plot + "\r\n" +

                // This displays the actors in the movie to the user.
                "Actors: " + movieInfo.Actors + "\r\n" +

                // This is another line break.
                "=======================================================================================================";

            // This console.log outputs the movie information to the terminal for the liri app.
            console.log(movieResult);

            // This logData outputs the movie information to the log.txt file in the liri app.
            logData(movieResult);
        }
    });
}

// The get tweets funcion is ran to get the last 20 tweers that are displayed on the fake denzel washington twitter page that I created.
function getLatestTweets() {

    // This uses the figlet npm package to convert text to art/drawings for the user in the liri app.
    figlet('My tweets', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });

    // This is the code displayed to access the Twitter keys information from the fake Denzel Washington Twitter account that I created.
    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    // This variable controls the parameters of the last 20 tweets from the fake Denzel Washington twitter account that I created.
    var parameters = {
        screen_name: 'DenzelW38778171',
        limit: 20
    };
    client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
        if (!error) {

            // This console logs the tweets and shows the last 20 tweets from the timeline.
            console.log("My last 20 tweets");
            logData("My last 20 tweets");
            for (var i = 0; i < tweets.length; i++) {

                // This variable outputs the tweets for the fake Denzel Washington Twitter that I created.
                var myTweetResults =
                    "==========================================================================" + "\r\n" +

                    // This displays a tweet number for each individual tweet, as an example the first tweet on the list of 20 will be displayed at tweet #1 etc. etc.
                    "Tweet #" + (i + 1) + "\r\n" +

                    // This outputs the tweet text from twitter to the terminal from the fake Denzel Washington twitter that I created.
                    "Tweet: " + tweets[i].text + "\r\n" +

                    // This outputs the date and time when the tweet was created from the fake denzel washington twitter I created to the liri app terminal.
                    "Created at: " + tweets[i].created_at + "\r\n" +
                    "==========================================================================";

                // This outputs the results tot he liri app terminal.
                console.log(myTweetResults);

                //output the results to the log.txt file.
                logData(myTweetResults);
            }
        }
    });
}
// This functuon gets the song information to the user and the user would want to run this function to get information about a specific song.
function getSongInfo(songName) {

    // This loop specifies that if a song name is longer than one word, then all of the words in the song name stay on the same line rather than putting each word of a specified song name on a different line.
    for (var i = 3; i < input.length; i++) {
        songName = songName + " " + input[i];
    }
    // This logs the song name to the console as well as a line break is added to keep the log.txt file organized.
    logData("==========================================================================");

    // This logs the Liri Command to the log.txt file.
    logData("liri command: spotify-this-song");

    // This variable pulls and process's the spotify API key.
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });
    // If there is no song name specified by the user in the command line, by default the song information will reveal "The Sign" by Ace of Base.
    if (!songName) {

        // If no song is specified by the user in the command line, set the songName variable to "The Sign.".
        songName = "The Sign";
    }
    // This uses the figlet npm package to convert the songName text to artwork/drawing.
    figlet(songName, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });
    // This variable used the Spotify package to search for a specific song or track and sets the seach results to be limited to 10 songs.
    spotify.search({
        type: 'track',
        query: songName,
        limit: 10
    }, function (err, data) {

        // This section logs an error to the console of there is an error that occurs.
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // If there is ni song specified by the user, then the app will automatically default to the song "The Sign" by Ace of Base.
        if (songName === "The Sign") {

            // This variable outputs the default song information.
            var defaultSong =
            
                // This outputs the artist.
                "Artist: " + data.tracks.items[5].artists[0].name + "\r\n" +

                // This outputs the song's name.
                "Song title: " + data.tracks.items[5].name + "\r\n" +

                // This outputs a preview link of the song from spotify.
                "Preview song: " + data.tracks.items[5].preview_url + "\r\n" +

                // This outputs the album that the song is from.
                "Album: " + data.tracks.items[5].album.name + "\r\n";

            // This outputs default song information to the terminal.
            console.log(defaultSong);
            console.log(addedToLogFile);

            // This outputs the default song information to the log.txt file to be displayed.
            logData(defaultSong);
            logData("==========================================================================");
        }

        // If the name of the song is provided by the user, this will output the first 10 songs with that name to the users terminal in the liri app.
        else {
            console.log("Top 10 songs on Spotify with the name, " + songName);
            logData("Top 10 songs on Spotify with the name, " + songName);

            // This variable loops through the JSON data to display the top songs to the user.
            for (var i = 0; i < data.tracks.items.length; i++) {
                var trackInfo = data.tracks.items[i];

                // This variable creates a song preview link.
                var previewSong = trackInfo.preview_url;

                // If the songs preview is null or not available to the user, this variable tells the user that the song preview is not available within the terminal window.
                if (previewSong === null) {
                    previewSong = "Song preview is not available for this song.";
                }

                // This variable outputs the songs result to the user.
                var songOutcome =

                    // This line break helps keep the log.txt file clean and organized.
                    "==========================================================================" + "\r\n" +

                    // This displays the song number for each song, as an example the song will be displayed as Song #1 etc. etc..
                    "Song #" + (i + 1) + "\r\n" +

                    // This outputs the artist to the terminal.
                    "Artist: " + trackInfo.artists[0].name + "\r\n" +

                    // This outputs the song name to the terminal.
                    "Song title: " + trackInfo.name + "\r\n" +

                    // This outputs a preview link of the song from spotify to the terminal.
                    "Preview song: " + previewSong + "\r\n" +

                    // This outputs the album that the song is from to the terminal.
                    "Album: " + trackInfo.album.name + "\r\n" +

                    // This line break is necissary to keep the log.txt file clean and organized.
                    "==========================================================================";

                // This console.log will display the song info in the terminal.
                console.log(songOutcome);

                // This logData will display the song information in the log.txt file.
                logData(songOutcome);
            }
        }
    });
}
// This doWhatItSays function Liri Command takes the text inside of the random.txt file and then uses it to run the spotify-this-song for "I want it that way."
function doWhatItSays() {

    // This code will read the random.txt file, it is very crucial to include the "utf8" parameter or the code will provide stream data.
    corenode.readFile("random.txt", "utf8", function (error, data) {

        // In this section if the code is experiencing any errors it will log all of the errors present to the console.
        if (error) {
            return console.log(error);
        }
        // The contents of the data will than be printed to the console.


        // This variable will split the data by using a comma to make the date more readable.
        var songdataArray = data.split(",");
        
        // The content will then be re-displayed as an array for the user to later use, the user will then call the getSongInfo function to display the song information for "I want it that way".
        getSongInfo(songdataArray[1]);
    });
}
// This functuon logs ALL data in the terminal/bash window and outputs all of the users data input to the .txt file called log.txt.
function logData(logResults) {

    // The results are than appended into the file and if the file didnt exist then it will get created instantaneously.
    corenode.appendFile("log.txt", logResults + "\r\n", function (err) {

        // If any error was experienced in the previous step, it will be logged to the console with err.
        if (err) {
            console.log(err);
        }
        // If there was no error experiences, "Content Added" will be logged to the node console.
        else {
            console.log("Content Added!");
        }
    });

}
// This function is used to the the command line help, the user will need to Install the columnify npm package I included in the read me to display all opf the content into columns.
function showHelp() {

    // The Figlet npm package I included in the read me is used to convert the text into artwork/drawing.
    figlet('LIRI help', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });
    var helpInfo = "Usage: node liri.js <command> [arguments]";
    var helpColumns = createcolumns([{
        Command: 'my-tweets',
        Description: "Shows the last 20 tweets from Twitter timeline and when they were created."
    }, {

        Command: "movie-this [movie_name]",
        Description: "Shows information about the specified movie. If no movie is specified, Mr. Nobody is displayed by default."
    }, {

        Command: "spotify-this-song [song_name]",
        Description: "Shows top 10 songs on Spotify that have specified name. If no song is specified, The Sign by Ace of Base is displayed by default."
    }, {

        Command: 'do-what-it-says',
        Description: "Shows the top 10 songs on Spotify for the song, 'I want it that way.'"
    }]);
    console.log("==================================================================================================");
    console.log(helpInfo);
    console.log("==================================================================================================");
    console.log(helpColumns);
}