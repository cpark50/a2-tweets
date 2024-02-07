function parseTweets(runkeeper_tweets) {
    // Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    // Filter to just the written tweets
	const tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
    // console.log(tweet_array);
    filteredTweets = tweet_array.filter((tweet) => tweet.written == true && !tweet.writtenText.includes("TomTom"));
    console.log(filteredTweets);
    addEventHandlerForSearch(filteredTweets)
}

function addEventHandlerForSearch(writtenTweets) {
    
    var input = document.getElementById('textFilter');
    input.addEventListener('input', function(){
        var filter = input.value.toLowerCase();
        const regex = new RegExp(`\\b{filter}`,"i");
        var filteredTweets = writtenTweets.filter((tweet) => tweet.writtenText.toLowerCase().includes(filter));
        displayFilteredTweets(filteredTweets);
    })


}
function displayFilteredTweets(filteredTweets) {
    var total = document.getElementById('searchCount');
    var resultsTable = document.getElementById('tweetTable');
    resultsTable.innerHTML = '';
    var rowNumber = 1;
    filteredTweets.forEach(tweet => {
        var tweetElement = document.createElement('div');
        tweetElement.innerHTML = `<tr>
        <td>${rowNumber}</td>
        <td>${tweet.activityType}</td>
        <td>${tweet.writtenText}</td>
        <td><a href="${this.linkToApp}">Link</a></td>
    </tr>`;
        rowNumber++;
        resultsTable.appendChild(tweetElement);
    });
    total.innerText = rowNumber;
   

}
function showText() {
    document.getElementById('searchText').innerHTML = document.getElementById('textFilter').value;
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function(event) {
    addEventHandlerForSearch();
    loadSavedRunkeeperTweets().then(parseTweets);

});

