data = { }

# For today's date (used to calculate x axis scale)
Date.prototype.getDOY = () ->
  onejan = new Date(this.getFullYear(), 0, 1)
  return Math.ceil((this - onejan) / 86400000)
today = new Date()
daysSinceStart = today.getDOY() - 15

# handle resize
window.addEventListener "resize", () ->
  sizeAndPositionGraph()
  render()

# Parse the date / time
parseDate = d3.time.format('%j').parse
# Something about getting the right date from the data
bisectDate = d3.bisector((d) -> return d.date).right
# Thickness of line
scale = +0.0001 * .35

# Initial values
[svg, x, y, width, height] = [0, 0, 0, 0, 0]

sizeAndPositionGraph = () ->
  # Set the dimensions of the canvas / graph
  margin = top: 25, right: 0, bottom: 25, left: 0
  width = window.innerWidth
  height = window.innerHeight

  # Removes any previous svg canvas
  d3.selectAll('.graph').remove()

  # Adds the svg canvas
  svg = d3.select('body').append('svg')
          .attr('class', 'graph')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  # Set the ranges
  x = d3.time.scale().range [0, width]
  y = d3.scale.linear().range [height, 0]

render = () ->  

  buffer = +0.1
  flattened = ($.map data, (v, i) -> v)
  x.domain d3.extent flattened, (d) -> d.date
  y.domain [ d3.min(flattened, (d) -> +d.average - +d.total * +scale) - buffer * 3, 
    d3.max(flattened, (d) -> +d.average + +d.total * +scale) + buffer]

  # Define the axes
  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks daysSinceStart
  # yAxis = d3.svg.axis().scale(y).orient('left').ticks 5

  svg.selectAll('.line').remove()

  # Scale the range of the data
  $.each data, (key, value) ->
    area = d3.svg.area()
      .interpolate("basis")
      .x (d) -> x d.date
      .y0 (d) -> y (+d.average - +d.total * +scale)
      .y1 (d) -> y (+d.average + +d.total * +scale)

    svg.append('g')
      .attr("class", "line line-#{key}")
      .append("path")
      .attr("class", "area")
      .attr "d", (d) -> area value

    mousemove = () ->
      xCoord = d3.mouse(this)[0]
      displayInformation xCoord

    displayInformation = (xCoord) ->
      x0 = x.invert(xCoord)

      i = bisectDate(value, x0, 1)
      d0 = value[i - 1]
      d1 = value[i]
      d = if x0 - d0.date > d1.date - x0 then d1.date else d0.date

      dataForCandidate = (candidateData) ->
        candidateData.filter((day) ->
          day.date.getTime() == d.getTime())[0]

      trumpData = dataForCandidate data.trump
      clintonData = dataForCandidate data.clinton
      bernieData = dataForCandidate data.bernie

      boxWidth = 150
      infoBox = ($ "#infowindow")[0]
      newPos = xCoord - 100
      # make sure it doesn't go off the page
      if newPos < 0 then newPos = 0
      if newPos + boxWidth > window.innerWidth then newPos = window.innerWidth - boxWidth
      infoBox.style.left = newPos
      # fill in text
      $(infoBox).find(".bernie .results").text "#{(bernieData.average * 100).toFixed 2} %"
      $(infoBox).find(".clinton .results").text "#{(clintonData.average * 100).toFixed 2} %"
      $(infoBox).find(".trump .results").text "#{(trumpData.average * 100).toFixed 2} %"
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      $(infoBox).find(".date").text "#{(months[d.getMonth()]) + " " + d.getDate()}" 

      infoBox.style.top = 100
      infoBox.style.width = boxWidth

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        # .on("mouseover", () -> console.log("mouseover"))
        # .on("mouseout", () -> console.log("mouseout"))
        .on("mousemove", mousemove)

    displayInformation(window.innerWidth / 2)

  # Add the X Axis
  svg.selectAll(".x.axis").remove()
  svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call xAxis

count = 0



#
# FETCH THE DATA
#
getPastTweets = ->

  firstKey = (dict) ->
    Object.keys(dict)[0]
  $.get 'http://candidatetracker.elasticbeanstalk.com/api/pastTweets', (responseData) ->
    newData =  {
      trump: [ ],
      clinton: [ ],
      bernie: [ ]
    }
    pastData = JSON.parse responseData
    if pastData["dayRecords"]
      # sort by date, just in case
      pastData.dayRecords.sort (a, b) ->
        (firstKey a) - (firstKey b)
      
      for dayRecord in pastData.dayRecords
        day = firstKey dayRecord
        candidates = dayRecord[day]
        date = parseDate "#{day}"

        bernieObject = candidates.bernie
        bernieObject.date = date
        
        clintonObject = candidates.clinton
        clintonObject.date = date

        trumpObject = candidates.trump
        trumpObject.date = date

        # Only add to graph if total tweets for trump (who usually gets the most) is above 100
        # i.e. once data has stabled out a bit
        if candidates.trump.total > 30
          newData.bernie.push bernieObject
          newData.trump.push trumpObject
          newData.clinton.push clintonObject

      data = newData
      render()

sizeAndPositionGraph()
getPastTweets()




