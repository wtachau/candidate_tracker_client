
getCandidateImage = (candidate) ->
  # fetch candidate tweet info
  $.get "http://candidatetracker.elasticbeanstalk.com/api/recentTweets?candidate=#{candidate}", (responseData) ->
    { id, user } = JSON.parse responseData

    ($ "script.twitter-script").remove()

    randomId = "#{Math.floor((Math.random() * 1000000))}"

    block = document.createElement 'blockquote'
    block.setAttribute 'lang', 'en'
    block.setAttribute 'data-cards', 'hidden'
    block.setAttribute 'data-conversation', 'none'
    block.setAttribute 'class', "tweet-#{randomId}"
    $(block).addClass 'twitter-tweet'

    anchor = document.createElement 'a'
    anchor.setAttribute 'href', "https://twitter.com/#{user}/status/#{id}"

    script = document.createElement 'script'
    script.setAttribute 'async', true
    script.setAttribute 'src', 'http://platform.twitter.com/widgets.js'
    script.setAttribute 'charset', 'utf-8'
    $(script).addClass 'twitter-script'

    $(script).appendTo ($ '.tweet-row')
    $(anchor).appendTo $(block)
    $(block).insertBefore ($ ".tweet-container.#{candidate} .noflicker2")

    numberOfIframes = 0

    replaceFirstTweet = () ->
      first = ($ ".tweet-container.#{candidate} iframe")[0]
      # Move the first iframe up, then remove it
      $(first).animate { 'margin-top': '-225px' }, 1000, "swing", () ->
        # remove all but last tweet iframe (not sure why sometimes there are > 2)
        numIframes = ($ ".tweet-container.#{candidate} iframe").length
        ($ ".tweet-container.#{candidate} iframe").each (index) ->
          if index < numIframes - 1
            $(@).remove()

    # Wait for the Twitter response by scanning for a new iframe getting added
    checkCandidateIframeExist = setInterval((->

      # If there are any new iframes
      if ($ ".tweet-container.#{candidate} iframe").length > numberOfIframes
        numberOfIframes += 1

        # If a second iframe has been added
        if ($ ".tweet-container.#{candidate} iframe").length > 1
          numberOfIframes -= 1
          replaceFirstTweet()
        
        # And stop looking for iframes all the damn time
        clearInterval checkCandidateIframeExist

    ), 100)

    # Generate random time interval and schedule next tweet
    min = 10
    max = 12
    randomTiming = Math.random() * ((max - min) * 1000) + (min * 1000)
    setTimeout getCandidateImage, randomTiming, candidate

getCandidateImage "bernie"
getCandidateImage "clinton"
getCandidateImage "trump"
