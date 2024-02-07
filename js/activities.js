function parseTweets(runkeeper_tweets) {
	// Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Create a map to count the number of tweets containing each type of activity
	const activityCount = new Map();
	tweet_array.forEach(tweet => {
		const activityType = tweet.activityType;
		if (activityCount.has(activityType)) {
			activityCount.set(activityType, activityCount.get(activityType) + 1);
		} else {
			activityCount.set(activityType, 1);
		}
	});

	let top3activities = tweet_array.filter((a) => a.source == "completed_event" && (a.activityType == "running" || a.activityType == "walking" || a.activityType == "biking"));
	

	let activityData = Array.from(activityCount, ([activityType, count]) => ({ activityType, count }));
	activityData = activityData.sort((a, b) => b.count - a.count);
	console.log(activityData);
	document.getElementById('numberActivities').innerText = activityData.length - 1;
	document.getElementById('firstMost').innerText = activityData[0].activityType;
	document.getElementById('secondMost').innerText = activityData[1].activityType;
	document.getElementById('thirdMost').innerText = activityData[2].activityType;
	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "the weekends";

	// Visualization specification for activity count graph
	const activity_vegalite = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": activityData
		},
		"mark": "bar",
		"encoding": {
			"x": { "field": "activityType", "type": "ordinal", "sort": "-y" },
			"y": { "field": "count", "type": "quantitative" }
		}
	};
	vegaEmbed('#activityVis', activity_vegalite, { actions: false });

	
	const distance_vegalite = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance of Activities by day of the week.",
		"data": {
			"values": top3activities
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
			},
			"y": {
				"field": "distance",
				"type": "quantitative"
			},
			"color": { "field": "activityType", "type": "nominal" },

		}
	};
	vegaEmbed('#distanceVis', distance_vegalite, { actions: false });

	const meanDistance_vegalite = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance of Activities by day of the week.",
		"data": {
			"values": top3activities
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"aggregate": "mean"
			},
			"color": { "field": "activityType", "type": "nominal" },

		}
	};
	vegaEmbed('#distanceVisAggregated', meanDistance_vegalite, { actions: false });

}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
	var meanBtn = document.getElementById("aggregate");
	var showAll = document.getElementById("distanceVis");
	var showAgg = document.getElementById("distanceVisAggregated");
	var viewMean = false;
	

	meanBtn.addEventListener("click", function () {
		viewMean = !viewMean;
		if (!viewMean) {
			meanBtn.innerText = "Show all activities";
			showAll.style.display = "block";
			showAgg.style.display = "none";
		}
		else {
			meanBtn.innerText = "Show mean";
			showAgg.style.display = "block";
			showAll.style.display = "none";
		}
	})

});
