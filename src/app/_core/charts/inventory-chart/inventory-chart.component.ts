


import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-inventory-chart',
  templateUrl: './inventory-chart.component.html',
  styleUrls: ['./inventory-chart.component.scss']
})
export class InventoryChartComponent implements OnInit {
  role: string;
  username: string;
  chart: any; 
  chartOptions: any;
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();
  }

  ngOnInit(): void {
    this.userservice.getDashboardBoxPieChart(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.updateChartData(data);
    });
  }

  updateChartData(apiData: any): void {
    const dataPoints = [
      { name: "New box in LCO End", y: apiData["New box in LCO End"], color: " #33a5d6" },
      { name: "New box in MSO Hand", y: apiData["New box in MSO Hand"], color: "#77edd0" },
      { name: "New in Customer End", y: apiData["New in Customer End"], color: "#20c931" }
    ];

    this.chartOptions = {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: "INVENTORY DETAILS",
        fontSize: 20,
        fontWeight: 600
      },
      data: [{
        type: "pie",
        dataPoints: dataPoints,
        showInLegend: true,
      }]
    };
    this.renderChart();  
  }

  renderChart(): void {
    this.chart = new CanvasJS.Chart("inventarychartContainer", this.chartOptions);
    this.chart.render();
  }
}
