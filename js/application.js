$(document).ready(function() {
  var Charts = function(opts) {
    this.url = opts.url;
    this.titleText = opts.titleText;
    this.subtitleText = opts.subtitleText;
    this.domID = opts.domID;
    this.series = [];
    this.rawData = []
  }

  Charts.prototype.getRawData = function() {
    var callBackFunction = function(response) {
      for (i = 0; i < response.data.length; i++) {
        this.rawData.unshift(
          {
            x: new Date(response.data[i][0]),
            y: response.data[i][1]
          }
        )
      }
    }
    $.ajax({
      context: this,
      async: false,
      type: 'GET',
      url: this.url,
      success: callBackFunction
    })
  }

  Charts.prototype.addToSeries = function(label,rawData) {
    this.series.push (
      {
        name: label,
        data: rawData
      }
    )
  }

  Charts.prototype.movingAverages = function(rate) {
    var data = [];
    var sum
    for (i = (rate - 1); i < this.rawData.length; i++) {
      sum = 0
      for (j = (i - rate + 1); j <= i; j++) {
        sum += this.rawData[j].y;
      }
      data.push(
        {
          x: this.rawData[i].x,
          y: (sum/rate)
        }
      )
    }
    this.addToSeries(rate + ' weeks averages', data)
  }

  Charts.prototype.generateGraph = function() {
    var highchartConfig = {
      title: {text: this.titleText},
      subtitle: {text: this.subtitleText},
      xAxis: {type: 'datetime'},
      series: this.series
    }
    $('#' + this.domID + '').highcharts(highchartConfig)
  }

  var gasolineChart = new Charts({
    url: 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB%27',
    titleText: 'Retail Gasoline Prices',
    subtitleText: 'Bureau of Transportation Statistics (Multimodal)',
    domID: 'gasolineChart'
  })

  gasolineChart.getRawData();
  gasolineChart.movingAverages(1);
  gasolineChart.movingAverages(4);
  gasolineChart.movingAverages(13);
  gasolineChart.movingAverages(52);
  gasolineChart.generateGraph();
})
