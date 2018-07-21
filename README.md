# liri-node-app

These are the packages that need to be installed to acces my Liri-App.

npm install twitter
npm install --save node-spotify-api
npm i request
npm install dotenv
npm i columnify
npm i figlet

These are the commands you need to run in the terminal to pull information.

help -- Shows help information for each command.

This command displays the last 20 tweets of the fake Denzel Washington Twitter Account I created.
$ node liri.js my-tweets

This command displays movie information for a specified movie when the user inputs a movie that is one word.
$ node liri.js movie-this Miracle

This command displays movie information for a specific movie when the movie title is two words or longer.
$ node liri.js movie-this Social Network

This command displays movie information for Mr. Nobody when no movie title has been inputted by the user.
$ node liri.js movie-this

This command displays the top 10 songs on Spotify for a specific song title for the user.
$ node liri.js spotify-this-song What Ifs

This command displays the top 10 songs on Spotify for the song, I want it that way for the user.
$ node liri.js do-what-it-says

This command displays song information for The Sign by Ace of Base when no song is specified by the user.
$ node liri.js spotify-this-song

WARNING: The Rotton tomatoes score isnt displayed for every movie.
