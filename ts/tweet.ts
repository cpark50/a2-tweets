class Tweet {
    private text: string;
    time: Date;
    milliseconds: Number;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
        this.milliseconds = this.time.getTime();
    }

    // Identifies whether the source is a live event, an achievement, a completed event, or miscellaneous.
    get source(): string {
        if (this.text.includes('Just completed')) {
            return 'completed_event';
        } else if (this.text.includes('Just posted')) {
            return 'achievement';
        } else if (this.text.includes('right now')) {
            return 'live_event';
        } else {
            return 'miscellaneous';
        }
    }
    get day(): number {

        return this.time.getDay();
    }

    // Identifies whether the tweet is written.
    get written(): boolean {
        if (this.text.includes('TomTom')){
            return false;
        }
        if (this.text.includes(' - ')){
            return true;
        }
        return false;
    }

    // Parses the written text from the tweet.
    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        // Assuming written text starts after the first colon
        return this.text.substring(this.text.indexOf('-')+1, this.text.indexOf('https://'));
    }
    
    get linkToApp(): string {
        var startIndex = this.text.indexOf("http");
        var endIndex = this.text.indexOf("http");
        while (endIndex < this.text.length){
            if (this.text[endIndex] == " "){
                break;
            }
            else {
                endIndex++;
            }
        }
        return this.text.substring(startIndex,endIndex);
    }

    // Parses the activity type from the text of the tweet.
    get activityType(): string {
        if (this.text.includes("walk")){
            return "walking";
        }
        if (this.text.includes("run")){
            return "running";
        }
        if (this.text.includes("row")){
            return "row";
        }
        if (this.text.includes("bike")){
            return "biking";
        }
        if (this.text.includes("elliptical")){
            return "elliptical";
        }
        if (this.text.includes("swim")){
            return "swimming";
        }
        return "others";

    }

    // Parses the distance from the text of the tweet. unify metrics to miles.
    get distance(): number {

        if (this.text.includes(' km ')) {
            const endIndex = this.text.indexOf(' km ') - 1;
            let startIndex = this.text.indexOf(' km ') - 1;
            while(startIndex >= 0){
                if (this.text[startIndex] != " ") {
                    startIndex--;
                }
                else {
                    break;
                }
            }
            return parseFloat(this.text.substring(startIndex,endIndex))*0.621371;
            
        }
        if (this.text.includes(' mi ')) {
            const endIndex = this.text.indexOf(' mi ') - 1;
            let startIndex = this.text.indexOf(' mi ') - 1;
            while(startIndex >= 0){
                if (this.text[startIndex] != " ") {
                    startIndex--;
                }
                else {
                    break;
                }
            }
            return parseFloat(this.text.substring(startIndex,endIndex));
        }

        return NaN;
    }

    // Returns a table row which summarizes the tweet with a clickable link to the RunKeeper activity.
    getHTMLTableRow(rowNumber: number): string {
        return `<tr>
                    <td>${rowNumber}</td>
                    <td>${this.activityType}</td>
                    <td>${this.written ? this.writtenText : 'Not written by the user'}</td>
                    <td><a href="${this.linkToApp}">Link to RunKeeper activity</a></td>
                </tr>`;
    }
}