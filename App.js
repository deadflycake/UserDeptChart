Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        this.getData();
    },
    getData: function() {
        var myFilter = Ext.create('Rally.data.QueryFilter', {
            property: 'Disabled',
            operator: '=',
            value: 'false'
        });
        console.log(myFilter.toString());
        
        
        // TODO: wsapi data store; on load, aggregate data
        var store = Ext.create('Rally.data.WsapiDataStore', {
            model: 'User',
            listeners: {
                load: function(store, data, success) {
                    //process data
                    console.log(data);
                    this.aggregateData(data);
                }, 
                scope:this
            },
            filters: [myFilter],
            
            autoLoad:true,
            fetch: ['Department'],
            limit: Infinity
        });

    },
    aggregateData: function(userRecords) {
        // TODO: bucket stories by schedule state; render chart
        
        var deptGroupData = _.countBy(userRecords, function(record) {
            return record.get("Department");
        });
        
        console.log(deptGroupData);
        
        this.renderChart(deptGroupData);
    },
    renderChart: function(myData) {
        var myChartConfig = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'License Usage by Department'
            },
            subtitle: {
                text: 'Count by User Department'
            },
            xAxis: {
                categories: [
                    'Department'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Active User Count'
                }
            },
            tooltip: {
                headerFormat: '<table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: false,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
        };
        
        var series = [];
        Ext.Object.each(myData, function(key, value) {
            series.push({
                name:key,
                data:[value]
            });
        });
        
        var myChartData = {
            series: series
        };

        var myChart = Ext.create('Rally.ui.chart.Chart', {
            chartConfig: myChartConfig,
            chartData: myChartData
        });
        
        this.add(myChart);
    }
});
