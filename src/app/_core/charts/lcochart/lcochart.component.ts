import { Component } from '@angular/core';

@Component({
  selector: 'app-lcochart',
  templateUrl: './lcochart.component.html',
  styleUrls: ['./lcochart.component.scss']
})
export class LcochartComponent {
  chartOptions = {
    animationEnabled: true,
    title: {
      text: "PACKAGE WISE RECHARGE COUNT",
      fontSize: 20,
      fontWeight: 600
    },
    axisX: {
      labelAngle: 180,
      title: "Month",
      grid: {
        display: false
      }
    },
    axisY: {
      title: "Recharge Count",
      grid: {
        display: false
      }
    },

    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        }
        else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [{
      type: "column",
      name: "Proven Oil Reserves (bn)",
      legendText: "Proven Oil Reserves",
      showInLegend: true,
      dataPoints: [
        { label: "Saudi", y: 262, color: "#2fd6c8" },
        { label: "Venezuela", y: 211, color: "#155918" },
        { label: "Canada", y: 175, color: "#035724" },
      ]
    }, {
      type: "column",
      name: "Oil Production (million/day)",
      legendText: "Oil Production",
      axisYType: "secondary",
      showInLegend: true,
      dataPoints: [
        { label: "Saudi", y: 11.15, color: "#2fd6c8" },
        { label: "Venezuela", y: 2.5, color: "#155918" },
        { label: "Canada", y: 3.6, color: "#035724" },
      ]
    }, {
      type: "column",
      name: "Oil Production (million/day)",
      legendText: "Oil Production",
      axisYType: "secondary",
      showInLegend: true,
      dataPoints: [
        { label: "Saudi", y: 11.15, color: "#2fd6c8" },
        { label: "Venezuela", y: 2.5, color: "#155918" },
        { label: "Canada", y: 3.6, color: "#035724" },
      ]
    }
    ]
  }
}
