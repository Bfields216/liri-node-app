require("dotenv").config();

var axios = require("axios");
var keys = require("./keys");
var fs = require('fs');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var userCommand = process.argv[2];

if (userCommand === "concert-this") {
    var artist = process.argv[3];
    concertthis();
} else if (userCommand === "spotify-this") {
    var songTitle = process.argv[3];
    spotifyThis();
} else if (userCommand === "movie-this") {
    var movie = process.argv[3];
    moviethis();
} else if (userCommand === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        var command = dataArr[0];

        if (command === "concert-this") {
            artist = dataArr[1];
            console.log(dataArr[1])
            concertthis();
        } else if (command === "spotify-this-song") {
            songTitle = dataArr[1];
            spotifyThis();
        } else if (command === "movie-this") {
            movie = dataArr[1];
            moviethis();
        }
    })
}




function moviethis() {
    if (!movie) {
        axios.get("https://www.omdbapi.com/?t=Mr.Nobody&apikey=trilogy").then(
            function (response) {
                console.log((response.data.Title).toUpperCase())
                console.log(response.data.Year);
                console.log("IMDB: " + response.data.imdbRating);
                console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
                console.log("Made in " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log(response.data.Actors);

            })

    } else {
        axios.get("https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy").then(
            function (reponse) {
                console.log((response.data.Title).toUpperCase())
                console.log(response.data.Year);
                console.log("IMDB: " + response.data.imdbRating);
                console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
                console.log("Produced in " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log(response.data.Actors);
            }
        )

    }

}


function concertthis() {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (response) {
            console.log("--------")
            console.log(artist.toUpperCase() + " has shows at these arena: ")
            console.log("--------")
            for (i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city + "," + response.data[i].venue.Country)
                console.log(response.data[i].datetime);
                console.log("=========");
            }
        }
    )
}

function spotifyThis() {
    spotify.search({ type: 'track', query: songTitle }, function (error, data) {
        if (error) {
            return console.log('Error occured: ' + error);
        }
        for (i = 0; i < data.tracks.items.length; i++) {
            fs.appendFile("sample.txt", JSON.stringify(
                console.log("*" + (data.tracks.items[i].name).toUpperCase() + "*"),
                console.log("ARTIST: " + data.tracks.items[i].artists[0].name),
                console.log("ALBUM: " + data.tracks.items[i].album.name),
                console.log(data.tracks.items[i].external_urls.spotify),
                console.log("")), function (error) {
                });
        };
    });
}
