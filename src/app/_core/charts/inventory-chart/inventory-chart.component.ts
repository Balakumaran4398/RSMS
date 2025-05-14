


import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { CanvasJS } from '@canvasjs/angular-charts';
import { Router } from '@angular/router';

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
  dataPoints: { name: string; y: number; color: string, click?: () => void; }[] = [];

  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
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
    this.dataPoints = [
      { name: "New box in MSO Hand", y: apiData["New box in MSO Hand"], color: "#77edd0",click: () => this.navigateToPage('BOX IN MSO HAND') },
      { name: "New box in LCO End", y: apiData["New box in LCO End"], color: "#33a5d6",click: () => this.navigateToPage('BOX IN LCO HAND') },
      { name: "New in Customer End", y: apiData["New in Customer End"], color: "#3bada6",click: () => this.navigateToPage('BOX IN CUSTOMER HAND') }
    ];

    this.chartOptions = {
      animationEnabled: true,
      theme: 'light2',
      legend: {
        verticalAlign: 'center',
        horizontalAlign: 'right',
        fontFamily: 'Arial',
        markerType: 'square',
        fontSize: 14,
        itemWrap: true,
        itemTextFormatter: (e: any) => `${e.dataPoint.name}: ${e.dataPoint.y}`,
      },
      title: {
        text: "INVENTORY DETAILS",
        fontSize: 18,
        fontWeight: 600
      },
      data: [{
        type: "pie",
        dataPoints: this.dataPoints,
        showInLegend: true,
      }]
    };
    this.renderChart();
  }

  
  renderChart(): void {
    this.chart = new CanvasJS.Chart("inventarychartContainer", this.chartOptions);
    this.chart.render();
  }


  navigateToPage(status: string): void {
    let packageId: string;
    switch (status) {
      case 'BOX IN MSO HAND':
        packageId = '11';
        break;
      case 'BOX IN LCO HAND':
        packageId = '12';
        break;
      case 'BOX IN CUSTOMER HAND':
        packageId = '13';
        break;

      default:
        packageId = '';
    }
    this.router.navigate(['admin/inventoryReport/' + packageId]);
  }
}
