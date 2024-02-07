function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	// console.log(tweet_array[0]);
	let minTime = Math.min.apply(null, tweet_array.map(function (o) { return o.milliseconds; }));
	let maxTime = Math.max.apply(null, tweet_array.map(function (o) { return o.milliseconds; }));
	let startDate = new Date(minTime).toLocaleDateString();
	let endDate = new Date(maxTime).toLocaleDateString();
	// console.log(minTime);
	// console.log(startDate);
	document.getElementById('firstDate').innerText = startDate;
	document.getElementById('lastDate').innerText = endDate;

	const count = {};
	var written = 0;
	for (let i = 0; i < tweet_array.length; i++) {
		let elem = tweet_array[i].source;
		if (count[elem]) {
			count[elem] += 1;
		} else {
			count[elem] = 1;
		}
		if (elem == "completed_event" && tweet_array[i].written) {
			written += 1;
		}
	}

	// console.log(written);
	// console.log(count);
	var total = tweet_array.length;
	document.getElementById('numberTweets').innerText = total;

	document.getElementsByClassName('completedEvents')[0].innerHTML = count.completed_event;
	document.getElementsByClassName('completedEvents')[1].innerHTML = count.completed_event;
	document.getElementsByClassName('completedEventsPct')[0].innerHTML = Number((count.completed_event/total)*100).toFixed(2)+ '%';

	document.getElementsByClassName('liveEvents')[0].innerHTML = count.live_event;
	document.getElementsByClassName('liveEventsPct')[0].innerHTML = Number((count.live_event/total)*100).toFixed(2) + '%';

	document.getElementsByClassName('achievements')[0].innerHTML = count.achievement;
	document.getElementsByClassName('achievementsPct')[0].innerHTML = Number((count.achievement/total)*100).toFixed(2)+'%';

	document.getElementsByClassName('miscellaneous')[0].innerHTML = count.miscellaneous;
	document.getElementsByClassName('miscellaneousPct')[0].innerHTML = Number((count.miscellaneous/total)*100).toFixed(2)+'%';

	document.getElementsByClassName('written')[0].innerHTML = written;
	document.getElementsByClassName('writtenPct')[0].innerHTML = Number((written/count.completed_event)*100).toFixed(2)+'%'




	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});