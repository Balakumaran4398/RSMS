import { Component, OnInit } from '@angular/core';
declare var AmCharts: any;

@Component({
  selector: 'app-operatordashboard',
  templateUrl: './operatordashboard.component.html',
  styleUrls: ['./operatordashboard.component.scss']
})
export class OperatordashboardComponent implements OnInit {

  constructor() {
    document.addEventListener("DOMContentLoaded", function () {
      let style = document.createElement("style");
      style.innerHTML = `
          @media (min-width: 992px) {
              .col-lg-1-7 {
                  flex: 0 0 14.28%;
                  max-width: 14.28%;
              }
          }
      `;
      document.head.appendChild(style);
    });

  }

  ngOnInit(): void {
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



    AmCharts.makeChart("chartpie", {
      "type": "pie",
      // "theme": "light",
      "dataProvider": [
        { "category": "BASE", "value": 4025, "color": "#027523" },
        { "category": "Addon", "value": 1882, "color": "#048077" },
        { "category": "Alacarte", "value": 1192, "color": "#022738" }
      ],
      "valueField": "value",
      "titleField": "category",
      "colorField": "color",
      "balloon": { "fixedPosition": false },

      "innerRadius": "40%",

      "labelText": "[[percents]]%",
      "color": "white",
      "labelRadius": -40,

      "legend": {
        "position": "bottom",
        "align": "center",
        "valueWidth": 80
      }
    });
  }
}
