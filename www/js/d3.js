var count, data, daysSinceStart, getPastTweets, height, parseDate, ref, render, sizeAndPositionGraph, svg, today, width, x, y;

data = {};

Date.prototype.getDOY = function() {
  var onejan;
  onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((this - onejan) / 86400000);
};

today = new Date();

daysSinceStart = today.getDOY() - 15;

window.addEventListener("resize", function() {
  sizeAndPositionGraph();
  return render();
});

parseDate = d3.time.format('%j').parse;

ref = [0, 0, 0, 0, 0], svg = ref[0], x = ref[1], y = ref[2], width = ref[3], height = ref[4];

sizeAndPositionGraph = function() {
  var margin;
  margin = {
    top: 25,
    right: 0,
    bottom: 25,
    left: 0
  };
  width = window.innerWidth - margin.left - margin.right;
  height = window.innerHeight - margin.top - margin.bottom;
  d3.selectAll('.graph').remove();
  svg = d3.select('body').append('svg').attr('class', 'graph').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  x = d3.time.scale().range([0, width]);
  return y = d3.scale.linear().range([height, 0]);
};

render = function() {
  var buffer, flattened, scale, xAxis;
  scale = +0.0001 * .35;
  buffer = +0.1;
  flattened = $.map(data, function(v, i) {
    return v;
  });
  x.domain(d3.extent(flattened, function(d) {
    return d.date;
  }));
  y.domain([
    d3.min(flattened, function(d) {
      return +d.average - +d.total * +scale;
    }) - buffer, d3.max(flattened, function(d) {
      return +d.average + +d.total * +scale;
    }) + buffer
  ]);
  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(daysSinceStart);
  svg.selectAll('.line').remove();
  $.each(data, function(key, value) {
    var area;
    area = d3.svg.area().interpolate("basis").x(function(d) {
      return x(d.date);
    }).y0(function(d) {
      return y(+d.average - +d.total * +scale);
    }).y1(function(d) {
      return y(+d.average + +d.total * +scale);
    });
    return svg.append('g').attr("class", "line line-" + key).append("path").attr("class", "area").attr("d", function(d) {
      return area(value);
    });
  });
  svg.selectAll(".x.axis").remove();
  return svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
};

count = 0;

getPastTweets = function() {
  var firstKey;
  firstKey = function(dict) {
    return Object.keys(dict)[0];
  };
  return $.get('http://candidatetracker.elasticbeanstalk.com/api/pastTweets', function(responseData) {
    var bernieObject, candidates, clintonObject, date, day, dayRecord, j, len, newData, pastData, ref1, trumpObject;
    newData = {
      trump: [],
      clinton: [],
      bernie: []
    };
    pastData = JSON.parse(responseData);
    if (pastData["dayRecords"]) {
      pastData.dayRecords.sort(function(a, b) {
        return (firstKey(a)) - (firstKey(b));
      });
      ref1 = pastData.dayRecords;
      for (j = 0, len = ref1.length; j < len; j++) {
        dayRecord = ref1[j];
        day = firstKey(dayRecord);
        candidates = dayRecord[day];
        date = parseDate("" + day);
        bernieObject = candidates.bernie;
        bernieObject.date = date;
        clintonObject = candidates.clinton;
        clintonObject.date = date;
        trumpObject = candidates.trump;
        trumpObject.date = date;
        if (candidates.trump.total > 100) {
          newData.bernie.push(bernieObject);
          newData.trump.push(trumpObject);
          newData.clinton.push(clintonObject);
        }
      }
      data = newData;
      return render();
    }
  });
};

sizeAndPositionGraph();

getPastTweets();
