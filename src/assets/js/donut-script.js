Chart.pluginService.register({
    beforeDraw: function (chart) {
        var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
        ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        var text = chart.config.options.elements.center.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
    }
});

var chartData = [{"visitor": 39, "visit": 1}, {"visitor": 18, "visit": 2}]

var visitorData = [],
    sum = 0,
    visitData = [];

for (var i = 0; i < chartData.length; i++) {
    visitorData.push(chartData[i]['visitor'])
    visitData.push(chartData[i]['visit'])
  
    sum += chartData[i]['visitor'];
}

var textInside = sum.toString();

var myChart = new Chart(document.getElementById('mychart'), {
    type: 'doughnut',
    animation:{
        animateScale:true
    },
    data: {
        labels: {display: false},
        datasets: [{
            label: 'Visitor',
            data: visitorData,
            backgroundColor: [
                "#313384",
                "#2CBF8C"
            ]
        }]
    },
    options: {
        elements: {
          center: {
            text: textInside
          }
        },
        responsive: true,
        legend: false,
        datalabels: false,
        labels: false,
        legendCallback: function(chart) {
            var legendHtml = [];
            legendHtml.push('<ul>');
            var item = chart.data.datasets[0];
            for (var i=0; i < item.data.length; i++) {
                legendHtml.push('<li>');
                legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] +'"></span>');
                legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - '+chart.data.labels[i]+' times</span>');
                legendHtml.push('</li>');
            }

            legendHtml.push('</ul>');
            return legendHtml.join("");
        },
        tooltips: {
             enabled: true,
             mode: 'label',
             callbacks: {
                label: function(tooltipItem, data) {
                    var indice = tooltipItem.index;
                    return data.datasets[0].data[indice] + " person visited " + data.labels[indice] + ' times';
                }
             }
         },
    }
});

$('#my-legend-con').html(myChart.generateLegend());

console.log(document.getElementById('my-legend-con'));



//----------------------------------------------- second chart----------------------
Chart.pluginService.register({
    beforeDraw: function (chart) {
        var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
        ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        var text = chart.config.options.elements.center.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
    }
});

var chartData1 = [{"visitor": 390, "visit": 1}, {"visitor": 20, "visit": 2}]

var visitorData = [],
    sum = 0,
    visitData = [];

for (var i = 0; i < chartData1.length; i++) {
    visitorData.push(chartData1[i]['visitor'])
    visitData.push(chartData1[i]['visit'])
  
    sum += chartData1[i]['visitor'];
}

var textInside = sum.toString();

var myChart1 = new Chart(document.getElementById('mychart1'), {
    type: 'doughnut',
    animation:{
        animateScale:true
    },
    data: {
        labels: {display: false},
        datasets: [{
            label: 'Visitor',
            data: visitorData,
            backgroundColor: [
                "#313384",
                "#2CBF8C"
            ]
        }]
    },
    options: {
        elements: {
          center: {
            text: textInside
          }
        },
        responsive: true,
        legend: false,
        datalabels: false,
        labels: false,
        legendCallback: function(chart) {
            var legendHtml = [];
            legendHtml.push('<ul>');
            var item = chart.data.datasets[0];
            for (var i=0; i < item.data.length; i++) {
                legendHtml.push('<li>');
                legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] +'"></span>');
                legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - '+chart.data.labels[i]+' times</span>');
                legendHtml.push('</li>');
            }

            legendHtml.push('</ul>');
            return legendHtml.join("");
        },
        tooltips: {
             enabled: true,
             mode: 'label',
             callbacks: {
                label: function(tooltipItem, data) {
                    var indice = tooltipItem.index;
                    return data.datasets[0].data[indice] + " person visited " + data.labels[indice] + ' times';
                }
             }
         },
    }
});


//----------------------------------------------- third chart----------------------
Chart.pluginService.register({
    beforeDraw: function (chart) {
        var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
        ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        var text = chart.config.options.elements.center.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
    }
});

var chartData2 = [{"visitor": 180, "visit": 1}, {"visitor": 10, "visit": 2}]

var visitorData = [],
    sum = 0,
    visitData = [];

for (var i = 0; i < chartData2.length; i++) {
    visitorData.push(chartData2[i]['visitor'])
    visitData.push(chartData2[i]['visit'])
  
    sum += chartData2[i]['visitor'];
}

var textInside = sum.toString();

var myChart2 = new Chart(document.getElementById('mychart2'), {
    type: 'doughnut',
    animation:{
        animateScale:true
    },
    data: {
        labels: {display: false},
        datasets: [{
            label: 'Visitor',
            data: visitorData,
            backgroundColor: [
                "#313384",
                "#2CBF8C"
            ]
        }]
    },
    options: {
        elements: {
          center: {
            text: textInside
          }
        },
        responsive: true,
        legend: false,
        datalabels: false,
        labels: false,
        legendCallback: function(chart) {
            var legendHtml = [];
            legendHtml.push('<ul>');
            var item = chart.data.datasets[0];
            for (var i=0; i < item.data.length; i++) {
                legendHtml.push('<li>');
                legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] +'"></span>');
                legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - '+chart.data.labels[i]+' times</span>');
                legendHtml.push('</li>');
            }

            legendHtml.push('</ul>');
            return legendHtml.join("");
        },
        tooltips: {
             enabled: true,
             mode: 'label',
             callbacks: {
                label: function(tooltipItem, data) {
                    var indice = tooltipItem.index;
                    return data.datasets[0].data[indice] + " person visited " + data.labels[indice] + ' times';
                }
             }
         },
    }
});