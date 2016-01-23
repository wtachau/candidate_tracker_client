var getCandidateImage;

getCandidateImage = function(candidate) {
  return $.get("http://candidatetracker.elasticbeanstalk.com/api/recentTweets?candidate=" + candidate, function(responseData) {
    var anchor, block, checkCandidateIframeExist, id, max, min, numberOfIframes, randomId, randomTiming, ref, replaceFirstTweet, script, user;
    ref = JSON.parse(responseData), id = ref.id, user = ref.user;
    ($("script.twitter-script")).remove();
    randomId = "" + (Math.floor(Math.random() * 1000000));
    block = document.createElement('blockquote');
    block.setAttribute('lang', 'en');
    block.setAttribute('data-cards', 'hidden');
    block.setAttribute('data-conversation', 'none');
    block.setAttribute('class', "tweet-" + randomId);
    $(block).addClass('twitter-tweet');
    anchor = document.createElement('a');
    anchor.setAttribute('href', "https://twitter.com/" + user + "/status/" + id);
    script = document.createElement('script');
    script.setAttribute('async', true);
    script.setAttribute('src', 'http://platform.twitter.com/widgets.js');
    script.setAttribute('charset', 'utf-8');
    $(script).addClass('twitter-script');
    $(script).appendTo($('.tweet-row'));
    $(anchor).appendTo($(block));
    $(block).insertBefore($(".tweet-container." + candidate + " .noflicker2"));
    numberOfIframes = 0;
    replaceFirstTweet = function() {
      var first;
      first = ($(".tweet-container." + candidate + " iframe"))[0];
      return $(first).animate({
        'margin-top': '-220px'
      }, 1000, "swing", function() {
        var numIframes;
        numIframes = ($(".tweet-container." + candidate + " iframe")).length;
        return ($(".tweet-container." + candidate + " iframe")).each(function(index) {
          if (index < numIframes - 1) {
            return $(this).remove();
          }
        });
      });
    };
    checkCandidateIframeExist = setInterval((function() {
      if (($(".tweet-container." + candidate + " iframe")).length > numberOfIframes) {
        numberOfIframes += 1;
        if (($(".tweet-container." + candidate + " iframe")).length > 1) {
          numberOfIframes -= 1;
          replaceFirstTweet();
        }
        return clearInterval(checkCandidateIframeExist);
      }
    }), 100);
    min = 10;
    max = 12;
    randomTiming = Math.random() * ((max - min) * 1000) + (min * 1000);
    return setTimeout(getCandidateImage, randomTiming, candidate);
  });
};

getCandidateImage("bernie");

getCandidateImage("clinton");

getCandidateImage("trump");
