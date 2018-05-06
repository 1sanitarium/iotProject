var currentData = [];
var data = [];
var selectedGraph = "temp";

$(function() {
let dateOffset = (24*60*60*1000) * 1; //5 days
let myDate = new Date();
myDate.setTime(myDate.getTime() - dateOffset);


const generateChartData = () => {
    currentData = [];
    data.forEach((d)=>{
        currentData.push({
            timestamp: d.timestamp,
            value: d[selectedGraph]
        })
    });
    currentData = _.sortBy(currentData, o => o.timestamp);
    return _.uniqBy(currentData, 'timestamp');
};



$(".navbar li").click((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    const target = $(evt.currentTarget);
    $(".navbar li").removeClass("active");
    target.addClass("active");
    selectedGraph = target.attr("data-m");
    update();
});

var chart = AmCharts.makeChart( "chartdiv", {
    "type": "serial",
    "theme": "dark",
    "zoomOutButton": {
        "backgroundColor": '#000000',
        "backgroundAlpha": 0.15
    },
    "dataProvider": [],
    "categoryField": "timestamp",
    "categoryAxis": {
        "parseDates": true,
        "minPeriod": "ss",
        "dashLength": 1,
        "gridAlpha": 0.15,
        "axisColor": "#DADADA"
    },
    "graphs": [ {
        "id": "g1",
        "valueField": "value",
        "bullet": "round",
        "bulletBorderColor": "#FFFFFF",
        "bulletBorderThickness": 2,
        "lineThickness": 2,
        "lineColor": "#b5030d",
        "negativeLineColor": "#0352b5",
        "hideBulletsCount": 50
    } ],
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "chartScrollbar": {
        "graph": "g1",
        "scrollbarHeight": 40,
        "color": "#FFFFFF",
        "autoGridCount": true
    }
} );

const update = () =>{
    $.get( "/data/" + myDate.getTime(), function( d ) {
        console.log(d);
        //chart.dataProvider.shift();
        data.push( ...d);
        //chart.dataProvider.splice(0, this.length);
        chart.dataProvider=generateChartData();
        chart.validateData();
        myDate = new Date();
    });
};

setInterval( function() {
    update();

}, 30000 );

update();
});