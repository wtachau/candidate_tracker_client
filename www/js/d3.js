var bisectDate, count, data, daysSinceStart, getPastTweets, height, parseDate, ref, render, scale, sizeAndPositionGraph, svg, today, width, x, y;

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

bisectDate = d3.bisector(function(d) {
  return d.date;
}).right;

scale = +0.0001 * .35;

ref = [0, 0, 0, 0, 0], svg = ref[0], x = ref[1], y = ref[2], width = ref[3], height = ref[4];

sizeAndPositionGraph = function() {
  var margin;
  margin = {
    top: 25,
    right: 0,
    bottom: 25,
    left: 0
  };
  width = window.innerWidth;
  height = window.innerHeight;
  d3.selectAll('.graph').remove();
  svg = d3.select('body').append('svg').attr('class', 'graph').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  x = d3.time.scale().range([0, width]);
  return y = d3.scale.linear().range([height, 0]);
};

render = function() {
  var buffer, flattened, xAxis;
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
    }) - buffer * 3, d3.max(flattened, function(d) {
      return +d.average + +d.total * +scale;
    }) + buffer
  ]);
  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(daysSinceStart);
  svg.selectAll('.line').remove();
  $.each(data, function(key, value) {
    var area, displayInformation, mousemove;
    area = d3.svg.area().interpolate("basis").x(function(d) {
      return x(d.date);
    }).y0(function(d) {
      return y(+d.average - +d.total * +scale);
    }).y1(function(d) {
      return y(+d.average + +d.total * +scale);
    });
    svg.append('g').attr("class", "line line-" + key).append("path").attr("class", "area").attr("d", function(d) {
      return area(value);
    });
    mousemove = function() {
      var xCoord;
      xCoord = d3.mouse(this)[0];
      return displayInformation(xCoord);
    };
    displayInformation = function(xCoord) {
      var bernieData, boxHeight, boxWidth, clintonData, d, d0, d1, dataForCandidate, headerHeight, i, infoBox, months, newPos, trumpData, tweetRowHeight, x0;
      x0 = x.invert(xCoord);
      i = bisectDate(value, x0, 1);
      d0 = value[i - 1];
      d1 = value[i];
      d = x0 - d0.date > d1.date - x0 ? d1.date : d0.date;
      dataForCandidate = function(candidateData) {
        return candidateData.filter(function(day) {
          return day.date.getTime() === d.getTime();
        })[0];
      };
      trumpData = dataForCandidate(data.trump);
      clintonData = dataForCandidate(data.clinton);
      bernieData = dataForCandidate(data.bernie);
      boxWidth = 150;
      boxHeight = 300;
      tweetRowHeight = 225;
      headerHeight = 65;
      infoBox = ($("#infowindow"))[0];
      newPos = xCoord - 100;
      if (newPos < 0) {
        newPos = 0;
      }
      if (newPos + boxWidth > window.innerWidth) {
        newPos = window.innerWidth - boxWidth;
      }
      infoBox.style.left = newPos;
      $(infoBox).find(".bernie .results").text(((bernieData.average * 100).toFixed(2)) + " %");
      $(infoBox).find(".clinton .results").text(((clintonData.average * 100).toFixed(2)) + " %");
      $(infoBox).find(".trump .results").text(((trumpData.average * 100).toFixed(2)) + " %");
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      $(infoBox).find(".date").text("" + (months[d.getMonth()] + " " + d.getDate()));
      infoBox.style.top = (window.innerHeight - tweetRowHeight - headerHeight - boxHeight) / 2 + headerHeight;
      infoBox.style.width = boxWidth;
      return infoBox.style.height = boxHeight;
    };
    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all").on("mousemove", mousemove);
    return displayInformation(window.innerWidth / 2);
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
  return $.get('http://api-cache.candidatetwittertracker.com/', function(responseData) {
    var bernieObject, candidates, clintonObject, cruzObject, date, day, dayRecord, j, len, newData, pastData, ref1, rubioObject, trumpObject;
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
        cruzObject = candidates.cruz;
        cruzObject.date = date;
        rubioObject = candidates.rubio;
        rubioObject.date = date;
        if (candidates.trump.total > 30) {
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
