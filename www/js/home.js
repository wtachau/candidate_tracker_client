var ctx, data, doPoll, myLineChart, myNewChart, options, updateChart;

data = {
  labels: ["first"],
  datasets: [
    {
      label: 'My First dataset',
      fillColor: 'rgba(220,220,220,0.2)',
      strokeColor: 'rgba(220,220,220,1)',
      pointColor: 'rgba(220,220,220,1)',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: [.2]
    }, {
      label: 'My Second dataset',
      fillColor: 'rgba(151,187,205,0.2)',
      strokeColor: 'rgba(151,187,205,1)',
      pointColor: 'rgba(151,187,205,1)',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(151,187,205,1)',
      data: [.4]
    }, {
      label: 'My First dataset',
      fillColor: 'rgba(220,220,220,0.2)',
      strokeColor: 'rgba(220,220,220,1)',
      pointColor: 'rgba(220,220,220,1)',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: [.6]
    }
  ]
};

options = {};

ctx = $("#myChart").get(0).getContext("2d");

myLineChart = myNewChart = new Chart(ctx, {
  type: "line",
  data: data
});

updateChart = function(trump, clinton, bernie, label) {
  var newIndex;
  newIndex = myLineChart.data.labels.length;
  myLineChart.data.datasets[0].data[newIndex] = clinton;
  myLineChart.data.datasets[1].data[newIndex] = trump;
  myLineChart.data.datasets[2].data[newIndex] = bernie;
  myLineChart.data.labels[newIndex] = label;
  return myLineChart.update();
};

doPoll = function() {
  $.get('http://candidatetracker.elasticbeanstalk.com/api/liveTweets ', function(data) {
    var bernieAverage, clintonAverage, trumpAverage;
    clintonAverage = parseFloat(data.clinton.average);
    trumpAverage = parseFloat(data.trump.average);
    bernieAverage = parseFloat(data.bernie.average);
    return updateChart(clintonAverage, trumpAverage, bernieAverage, "test");
  });
  return setTimeout(doPoll, 5000);
};
