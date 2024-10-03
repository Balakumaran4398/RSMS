import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-chart',
  templateUrl: './inventory-chart.component.html',
  styleUrls: ['./inventory-chart.component.scss'],
})
export class InventoryChartComponent {
  chartOptions = {

    // exportEnabled: true,
    title: {
      text: "INVENTORY DETAILS",
      fontSize: 20, 
			fontWeight:600
    },

    data: [{
      type: "pie",
      // indexLabel: "{name}: {y}%",
      dataPoints: [
        { name: "Overhead", y: 36.1, color: "#77edd0" },      
        { name: "Problem Solving", y: 3.7, color: "#20c931" },  
        { name: "Debugging", y: 16.4, color: "#33a5d6" },       
        // { name: "Writing Code", y: 30.7, color: "#FFC300" },  
        // { name: "Firefighting", y: 20.1, color: "#C70039" } 
      ]
    }]
  }
  
}
