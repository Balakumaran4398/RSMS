import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { SwalService } from '../../service/swal.service';
import { CanvasJS } from '@canvasjs/angular-charts';
import * as jQuery from 'jquery';
declare var AmCharts: any;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  chartOptions: any;
  role: string;
  username: string;
  date: any;
  chart: any;
  value: any;

  BAChartDataValue = [5, 17, 9, 12, 2];
  BAChartDataLabel = ['TATA', 'Mahendra', 'Toyota', 'Tesla', 'BMW'];
  BAChartJobErrColors = [
    'rgba(26, 176, 169, 1)',
    'rgba(119, 209, 190, 1)',
    'rgba(127, 188, 212, 1)',
    'rgba(28, 120, 212, 1)',
    'rgba(3, 3, 158, 1)',
  ];

  BAChartCountTotal = this.BAChartDataValue.reduce((acc, val) => acc + val, 0);

  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.loadChartData(this.date);


    jQuery('.chart-input').off().on('input change', function () {
      jQuery('.chart-input')
        .off('input change') 
        .on('input change', function (this: HTMLInputElement) {
          var property = jQuery(this).data('property');
          var target = (window as any).chart; 

          if (!target) {
            console.error('Chart object not found');
            return;
          }

          target.startDuration = 0;

          if (property === 'topRadius') {
            target = target.graphs[0];
          }

          target[property] = this.value;
          target.validateNow();
        });
    });

    AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "startDuration": 2,
      "dataProvider": [
        { "country": "Customer Amount", "visits": 4025, "color": "#027523" },
        { "country": "LCO Profit", "visits": 1882, "color": "#048077" },
        { "country": "LCO Amount", "visits": 1192, "color": "#022738" },
        { "country": "LCO Tax", "visits": 2010, "color": "#423f69" },
        { "country": "Refund", "visits": 2882, "color": "#69101d" },
        { "country": "Recharge", "visits": 3882, "color": "#750b1a" },
      ],
      "valueAxes": [{ "position": "left", "axisAlpha": 0, "gridAlpha": 0 }],
      "graphs": [{
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "colorField": "color",
        "fillAlphas": 0.85,
        "lineAlpha": 0.1,
        "type": "column",
        "topRadius": 1,
        "valueField": "visits"
      }],
      "depth3D": 40,
      "angle": 30,
      "chartCursor": { "categoryBalloonEnabled": false, "cursorAlpha": 0, "zoomable": false },
      "categoryField": "country",
      "categoryAxis": { "gridPosition": "start", "axisAlpha": 0, "gridAlpha": 0 }
    });
    
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const selectedDate = new Date(input.value);
      const today = new Date();
      // if (selectedDate <= today) {
      this.date = input.value;
      this.loadChartData(this.date);
      // } else {
      // this.swal.warning_1();
      // }
    }
  }

  loadChartData(date: string): void {

    this.userservice.getDashboardSubscribtionBarChartDetails(this.role, this.username, date).subscribe((data: any) => {
      this.updateChartData(data);
      console.log(data);

    });
  }

  updateChartData(data: any): void {
    const dataPoints = [];
    for (const date in data) {
      if (data.hasOwnProperty(date)) {
        let color;
        const count = data[date];
        if (count > 0) {
          color = "#3bada6";
        } else {
          color = "#d1ae2e";
        }

        dataPoints.push({
          // x: new Date(date),
          y: count,
          label: date,
          color: color,
          indexLabel: count.toString(),
          indexLabelFontColor: "#5A5757",
          indexLabelFontSize: 14,
          indexLabelPlacement: "outside",
          indexLabelAlign: "left"
        });
      }
    }
    const chart = new CanvasJS.Chart("barchartContainer", {
      // title: {
      //   text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
      //   fontSize: 18,
      //   // fontWeight: 600
      // },
      animationEnabled: true,
      axisY: {
        title: "Count",
        titleFontSize: 16,
        titleFontColor: "#5A5757",
        labelFontColor: "#5A5757",
        gridThickness: 0
      },
      axisX: {
        title: "Dates",
        labelFontSize: 14,
        labelFontColor: "#001716",
        labelAlign: "center",
        interval: 1,

      },
      data: [{
        type: "column",
        dataPoints: dataPoints,
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "inside",
        width: 10,
        indexLabelAlign: "center",
        indexTextAlign: "center",
        color: (e: any) => e.dataPoint.color,
        // color: (dataPoints: any) => {
        //   if (dataPoints.y > 0) {
        //     return "#3bada6";
        //   }
        //   return "#d1ae2e";
        // }
      }]
    });

    chart.render();
  }



}
