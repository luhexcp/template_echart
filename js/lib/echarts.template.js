var ECharts = {
    // Load the Echarts  configuration file 
    ChartConfig: function(container, option) {
        var chart_path = "js/lib/echarts.min";
        var map_path = "js/lib/china";
        require.config({ //introduce the configuration of commonly used chart types 
            paths: {
                echarts: chart_path,
                'echarts/chart/bar': chart_path,
                'echarts/chart/pie': chart_path,
                'echarts/chart/line': chart_path,
                'echarts/chart/k': chart_path,
                'echarts/chart/scatter': chart_path,
                'echarts/chart/radar': chart_path,
                'echarts/chart/chord': chart_path,
                'echarts/chart/force': chart_path,
                'echarts/chart/map': map_path
            }
        });
        this.option = {
            chart: {},
            option: option,
            container: container
        };
        return this.option;
    },
    // data formatting 
    ChartDataFormate: {
        FormateNOValueData: function(data) {
            var categories = [];
            var datas = [];
            for (var i = 0; i < data.length; i++) {
                categories.push(data[i].name || "");
                datas.push({
                    name: data[i].name,
                    value: data[i].value || 0
                });
            }
            return {
                category: categories,
                data: datas
            };
        },
        FormateValueData: function(data, type, is_stack, is_showpoint, is_nomarkpoint) {
            var chart_type = 'line';
            if (type) chart_type = type || 'line';
            var xAxis = [];
            var value = [];
            var series = [];
            var name = [];
            xAxis = data.xaxis;
            value = data.value;
            name = data.name;
            for (var i = 0; i < value.length; i++) {
                var temp = data[value[i]];
                switch (type) {
                case 'bar':
                    var series_temp = {
                        name: name[i],
                        data: temp,
                        type: chart_type
                    };
                    if (is_stack) series_temp = $.extend({},
                    {
                        stack: 'stack'
                    },
                    series_temp);
                    break;
                case 'map':
                    var series_temp = {
                        name: name[i],
                        type: chart_type,
                        mapType: 'china',
                        selectedMode: 'single',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: temp
                    };
                    break;
                case 'line':
                    var series_temp = {
                        name: name[i],
                        data: temp,
                        markPoint: { // control the average
                            name: name[i],
                            data: [{
                                type: 'max',
                                name: 'MAX'
                            },
                            {
                                type: 'min',
                                name: 'MIN'
                            }]
                        },
                        markLine: {
                            data: [{
                                type: 'average',
                                name: 'AVE'
                            }]
                        },
                        type: chart_type
                    };
                    if (is_stack) {
                        series_temp = $.extend({},
                        {
                            stack: 'stack'
                        },
                        series_temp);
                    }
                    if (is_showpoint) {
                        series_temp = $.extend({},
                        {
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    }
                                }
                            },
                            //  description: itemStyle: the display of points 
                        },
                        series_temp);
                    }
                    if (is_nomarkpoint) {
                        series_temp = $.extend({},
                        {
                            markPoint: {},
                            markLine: {},
                        },
                        series_temp);
                    }
                    break;
                case 'radar':

                    if (i == 0) {
                        var max = [];
                        max = data.max;
                        var tmp_xAxis = [];
                        // console.log(xAxis);
                        for (var k = 0; k < xAxis.length; k++) {
                            var obj = new Object;
                            obj.name = xAxis[k];
                            obj.max = max[k];
                            tmp_xAxis.push(obj);
                        }
                        xAxis = tmp_xAxis;
                    }
                    tmp_arr = new Array();

                    var series_temp = $.extend({},
                    {
                        name: name[i],
                        type: chart_type,
                        data: Array({
                            value: temp
                        }),
                    });
                    break;

                default:
                    var series_temp = {
                        name: value[i],
                        data: temp,
                        type: chart_type
                    };
                }
                series.push(series_temp);
            }
            return {
                category: data.name,
                xAxis: xAxis,
                series: series
            };
        }
    },
    // init 
    ChartOptionTemplates: {
        CommonOption: {
            tooltip: {
                trigger: 'axis' //trigger by axis  
            },
            toolbox: {
                show: true,
                // is show tooltip
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    } 
                }
            }
        },
        CommonLineOption: { 
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    },
                    magicType: ['line', 'bar'] 
                }
            }
        },
        CommonNoAxisOption: { //tooltip no axis
            tooltip: {

            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    } 
                }
            }
        },
        CreatePie: function(data, name) {
            var pie_datas = ECharts.ChartDataFormate.FormateNOValueData(data);
            var option = {
                title: {
                    text: name + '\n',
                    x: 'center',
                    y: 'top',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)',
                    show: true
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    bottom: '5%',
                    data: pie_datas.category
                },
                series: [{
                    name: name || "",
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: pie_datas.data
                }]
            };
            return $.extend({},
            ECharts.ChartOptionTemplates.CommonOption, option);
        },
        CreateGauge: function(data, name) {
            var gauge_datas = ECharts.ChartDataFormate.FormateNOValueData(data);
            var option = {
                title: {
                    text: name + '\n',
                    x: 'center',
                    y: 'top',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c}%',
                    show: true
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    bottom: '5%',
                    data: gauge_datas.category
                },
                series: [{
                    name: name || "",
                    type: 'gauge',
                    // detail: {formatter:'{value}%'},
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: gauge_datas.data
                }]
            };
            return $.extend({},
            ECharts.ChartOptionTemplates.CommonOption, option);
        },
        CreateLines: function(data, name, y_name, is_stack, is_showpoint, is_nomarkpoint) {
            var stackline_datas = ECharts.ChartDataFormate.FormateValueData(data, 'line', is_stack, is_showpoint, is_nomarkpoint);
            var option = {
                title: {
                    text: name + '\n',
                    x: 'center',
                    y: 'top',
                },
                grid: {
                    bottom: '20%',
                    top: '10%'
                },
                legend: {
                    data: stackline_datas.category,
                    bottom: '5%',
                },
                xAxis: [{
                    type: 'category',
                    // X-axis is a category, and the Y-axis is the value 
                    data: stackline_datas.xAxis,
                    boundaryGap: false 
                }],
                yAxis: [{
                    name: y_name || '',
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // }
                }],
                splitLine: {
                    show: false
                },
                series: stackline_datas.series
            };
            return $.extend({},
            ECharts.ChartOptionTemplates.CommonLineOption, option);
        },
        CreateBars: function(data, name, y_name, is_stack = false) {
            var bars_dates = ECharts.ChartDataFormate.FormateValueData(data, 'bar', is_stack);
            var option = {
                title: {
                    text: name + '\n',
                    x: 'center',
                    y: 'top',
                },
                grid: {
                    bottom: '30%',
                    top: '10%'
                },
                legend: {
                    data: bars_dates.category,
                    bottom: '5%',
                },

                xAxis: [{
                    type: 'category',
                    data: bars_dates.xAxis,
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        rotate: 0,
                        margion: 8
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: y_name || '',
                    // splitArea: {
                    //     show: true
                    // }
                }],
                series: bars_dates.series
            };
            return $.extend({},
            ECharts.ChartOptionTemplates.CommonLineOption, option);
        },

        CreateRadar: function(data, name) {
            var radar_dates = ECharts.ChartDataFormate.FormateValueData(data, 'radar');
            var option = {
                title: {
                    text: name + '\n',
                    x: 'center',
                    y: 'top',
                },
                grid: {
                    bottom: '30%',
                    top: '10%'
                },
                legend: {
                    data: radar_dates.category,
                    bottom: '5%',
                },
                radar: {
                    indicator: radar_dates.xAxis
                },

                series: radar_dates.series
            };
            console.log(option);
            return $.extend({},
            ECharts.ChartOptionTemplates.CommonNoAxisOption, option);

        },

        CreateMaps: function(data, name, is_stack = false) {

            var option = {
                title: {
                    text: name + '\n',
                    x: 'center',
                    y: 'top',
                },
                series: [{
                    type: 'map',
                    map: 'china'
                }]
            };
            return $.extend({},
            ECharts.ChartOptionTemplates.CommonLineOption, option);
        },
    },

    // filter show data
    Filters: {
        FilterLegend: function(option, selected) {
            var name = option.legend.data;
            if (name != null && name instanceof Array) {
                var hideLegend = new Object();
                for (var i = 0; i < name.length; i++) {
                    if ($.inArray(name[i], selected) == -1) {
                        hideLegend[name[i]] = false;
                    }
                }
                option.legend.selected = hideLegend;
            }
            return option;
        }
    },

    // render chart
    Charts: {
        RenderChart: function(option) {
            require(['echarts', 'echarts/chart/line', 'echarts/chart/bar', 'echarts/chart/pie', 'echarts/chart/k', 'echarts/chart/scatter', 'echarts/chart/radar', 'echarts/chart/chord', 'echarts/chart/force', ],
            function(ec) {
                echarts = ec;
                if (option.chart && option.chart.dispose) option.chart.dispose();
                option.chart = echarts.init(option.container);
                window.onresize = option.chart.resize;
                option.chart.setOption(option.option, true);
            });
        },
        RenderMap: function(option) {
            require(['echarts', 'echarts/chart/map'],
            function(ec) {
                echarts = ec;
                option.chart = echarts.init(option.container);
                window.onresize = option.chart.resize;
                option.chart.setOption(option.option, true);
            });
        }
    },

    Draw: {
        RenderChart: function(data, type, id, title = null, selected = null, is_stack = false) {
            switch (type) {
            case 'line':
                var option = ECharts.ChartOptionTemplates.CreateLines(data, title);
                break;
            case 'pie':
                var option = ECharts.ChartOptionTemplates.CreatePie(data, title);
                break;
            case 'bar':
                var option = ECharts.ChartOptionTemplates.CreateBars(data, title, is_stack);
                break;
            case 'gauge':
                var option = ECharts.ChartOptionTemplates.CreateGauge(data, title);
                break;
            case 'radar':
                var option = ECharts.ChartOptionTemplates.CreateRadar(data, title);
                break;
            default:
                break;
            }
            var container = $("#" + id)[0];
            opt = ECharts.ChartConfig(container, option);
            option = ECharts.Filters.FilterLegend(option, selected);
            ECharts.Charts.RenderChart(opt);
        },
        RenderMap: function(data, type, id, title = null, selected = null, is_stack = false) {
            var option = ECharts.ChartOptionTemplates.CreateMaps(data, title, is_stack);
            var container = $("#" + id)[0];
            opt = ECharts.ChartConfig(container, option);
            ECharts.Charts.RenderMap(opt);
        }
    }

}