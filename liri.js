require("dotenv").config();

var keys = require("./keys");
var spotAPI = require("node-spotify-api");
var twitter = require("twitter");
var request = require("request");
var fs = require('fs');

var spotify = new spotAPI(keys.spotify);
var client = new twitter(keys.twitter);

//console.log(keys);
//console.log(client);

console.log(process.argv[2]);

var whatToDo = process.argv[2];
var searchTerm = "";

if (whatToDo === "my-tweets" || searchTerm === "my-tweets") {
	tweeter();
} else if (whatToDo === "spotify-this-song" || searchTerm === "spotify-this-song") {
	songPlayer();
} else if (whatToDo === "movie-this" || searchTerm === "movie-this") {
	movieStats();
}  else if (whatToDo === "do-what-it-says" || searchTerm === "do-what-it-says") { 
	doIt();
}


function tweeter() {
	//console.log(keys);
	var params = {q: "DummyFicuvug",
					count: 20};

	client.get('search/tweets', params, function(error, tweets, response) {
		
		for (var i = 0; i < tweets.statuses.length; i++) {
			console.log(tweets.statuses[i].user.name + " said: " + tweets.statuses[i].text);
			console.log(tweets.statuses[i].created_at);
			}

		if (error) {
			throw error;
		}
		
	});
}

function songPlayer(songName2) {
	var songName = "" + songName2;

	if (songName === "") {
		songName = "The Sign"
	} else {
		for (var i = 3; i < process.argv.length; i++) {
			songName = songName + process.argv[i] + " ";
		}
	}

	spotify.search({ type: 'track', query: songName, limit: 3}, function(err, data) {
  		console.log(data.tracks.items[0].artists[0].name);
  		console.log(songName);
  		console.log(data.tracks.items[0].external_urls.spotify);
  		console.log(data.tracks.items[0].album.name);

	  	if (err) {
	    	return console.log('Error occurred: ' + err);
		}
	});
} 

function movieStats(title2) {
	var title = "" + title2;
	
	if (process.argv[3] == undefined) {
		title = "Mr.+Nobody";
	}

	if (process.argv[3] !== undefined) {
		for (var i = 3; i < process.argv.length; i++) {
			title += process.argv[i] + "+";
			console.log(title);
		}
	}

	request("http://www.omdbapi.com/?t="+  title +"&apikey=trilogy", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var movieParsed = JSON.parse(body);

			console.log("Movie Name: " + movieParsed.Title);
			console.log("Year: " + movieParsed.Year);
			console.log("the movies rating is: " + movieParsed.imdbRating);
			console.log("Rotten Tomatoes Rating: " + movieParsed.Ratings[2].Value);
			console.log("Country: " + movieParsed.Country);
			console.log("Language: " + movieParsed.Language);
			console.log("Plot: " + movieParsed.Plot);
			console.log("Actors: " + movieParsed.Actors);
		}
	});


}

function doIt() {
	var stuff = fs.readFile("random.txt", "utf-8", function(err, data) {
			console.log(data.split(" "));
			var splitData = data.split(" ");
			console.log(splitData);
			var fileData = "";
			for (var i = 1; i < splitData.length; i++) {
				fileData += splitData[i] + "+";
				console.log(fileData);
			}
			whatToDo = splitData[0];
			console.log(whatToDo);
			searchTerm = fileData;

			if (whatToDo === "my-tweets") {
				tweeter(searchTerm);
			} else if (whatToDo === "spotify-this-song") {
				songPlayer(searchTerm);
			} else if (whatToDo === "movie-this") {
				movieStats(searchTerm);
			}  else if (whatToDo === "do-what-it-says") { 
				doIt();
			}

		});
}




