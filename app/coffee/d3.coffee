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

# Initial values
[svg, x, y, width, height] = [0, 0, 0, 0, 0]

sizeAndPositionGraph = () ->

  # Set the dimensions of the canvas / graph
  margin = top: 25, right: 0, bottom: 25, left: 50
  width = window.innerWidth - margin.left - margin.right
  height = window.innerHeight - margin.top - margin.bottom

  # Removes any previous svg canvas
  d3.selectAll('.graph').remove()

  # Adds the svg canvas
  svg = d3.select('body').append('svg')
          .attr('class', 'graph')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  # Set the ranges
  x = d3.time.scale().range [0, width]
  y = d3.scale.linear().range [height, 0]

render = () ->  
  # Thickness of line
  scale = +0.0001 * .1

  buffer = +0.1
  flattened = ($.map data, (v, i) -> v)
  x.domain d3.extent flattened, (d) -> d.date
  y.domain [ d3.min(flattened, (d) -> +d.average - +d.total * +scale) - buffer, 
    d3.max(flattened, (d) -> +d.average + +d.total * +scale) + buffer]

  # Define the axes
  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks daysSinceStart
  yAxis = d3.svg.axis().scale(y).orient('left').ticks 5

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

  # Add the X Axis
  svg.selectAll(".x.axis").remove()
  svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call xAxis
  # Add the Y Axis
  svg.selectAll(".y.axis").remove()
  svg.append('g').attr('class', 'y axis').call yAxis

count = 0

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

        newData.bernie.push bernieObject
        newData.trump.push trumpObject
        newData.clinton.push clintonObject

      data = newData
      render()

sizeAndPositionGraph()
getPastTweets()




