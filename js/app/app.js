
$(function(){
    $(".navbar-nav > li > a").css({"color":"#777"});
    to_line_chart();
})

function to_line_chart(){
       $.getJSON("json/line.json", function(data){
            ECharts.Draw.RenderChart(data,'line',"main_chart",'折线图',["天空"]);
      });  
}

function to_pie_chart(){
       $.getJSON("json/pie.json", function(data){
             ECharts.Draw.RenderChart(data,'pie',"main_chart",'饼状图',["天空","海洋"]);
      });  
}

function to_bar_chart(){
       $.getJSON("json/line.json", function(data){
             ECharts.Draw.RenderChart(data,'bar',"main_chart",'柱状图',["天空"]);
      });  
}

function to_gauge_chart(){
       $.getJSON("json/pie.json", function(data){
             ECharts.Draw.RenderChart(data,'gauge',"main_chart",'仪表盘图',["天空"]);
      });  
}

function to_radar_chart() {
     $.getJSON("json/radar.json", function(data){
             ECharts.Draw.RenderChart(data,'radar',"main_chart",'雷达图',["预算分配（Allocated Budget）"]);
      });  
}

function to_china_chart(){
    ECharts.Draw.RenderMap(null,'map',"main_chart",'中国地图',["中国地图"]);
}

