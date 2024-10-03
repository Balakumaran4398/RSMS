import { Component } from '@angular/core';

@Component({
  selector: 'app-lcopiechart',
  templateUrl: './lcopiechart.component.html',
  styleUrls: ['./lcopiechart.component.scss']
})
export class LcopiechartComponent {
  chartOptions = {
    title: {
      text: "PACKAGE WISE RECHARGE AMOUNT",
      fontSize: 20,
      fontWeight: 600
    },
    subtitle: {
      text: "This chart shows package-wise total recharged amount of the current year",
      fontSize: 18,
      fontColor: "#FFC300" 
    },
    data: [{
      type: "pie",
      dataPoints: [
        { name: "Overhead", y: 36.1, color: "#77edd0" },
        { name: "Problem Solving", y: 3.7, color: "#20c931" },
        { name: "Debugging", y: 16.4, color: "#33a5d6" }
      ]
    }]
  };
}
