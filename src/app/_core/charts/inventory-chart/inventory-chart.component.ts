


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
  inventoryData: any;
  lco_end: any;
  box_in_msohand: any;
  customer_end: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();
  }

  ngOnInit(): void {
    // this.userservice.getDashboardBoxPieChart(this.role, this.username).subscribe((data: any) => {
    //   console.log(data);
    //   this.updateChartData(data);
    // });

    this.userservice.getDashboardBoxPieChart(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lco_end = data["New box in LCO End"];
      this.customer_end = data["New in Customer End"];
      this.box_in_msohand = data["New box in MSO Hand"];

      this.inventoryData = [
        {
          title: 'Total Box in Inventory',
          count: this.customer_end,
          change: 10.00,
          description: 'Total Box in Inventory this month',
          color: '#ff44ec',
          click: () => this.navigateToPage('BOX IN CUSTOMER HAND')
        },
        {
          title: 'Box In MSO Hand',
          count: this.box_in_msohand,
          change: 10.00,
          description: 'Total Box in MSO Hand this month',
          color: '#00cfd3',
          click: () => this.navigateToPage('BOX IN MSO HAND')
        },
        {
          title: 'Box In LCO End',
          count: this.lco_end,
          change: 10.00,
          description: 'Total Box in LCO End this month',
          color: '#00d47e',
          click: () => this.navigateToPage('BOX IN LCO HAND')
        },
        {
          title: 'Box in Customer End',
          count: this.customer_end,
          change: 10.00,
          description: 'Total Box in Customer End this month',
          color: '#0095ff',
          click: () => this.navigateToPage('BOX IN CUSTOMER HAND')
        }
      ];
      // this.updateChartData(data);
    });
  }



  updateChartData(apiData: any): void {
    this.dataPoints = [
      { name: "New box in MSO Hand", y: apiData["New box in MSO Hand"], color: "#77edd0", click: () => this.navigateToPage('BOX IN MSO HAND') },
      { name: "New box in LCO End", y: apiData["New box in LCO End"], color: "#33a5d6", click: () => this.navigateToPage('BOX IN LCO HAND') },
      { name: "New in Customer End", y: apiData["New in Customer End"], color: "#3bada6", click: () => this.navigateToPage('BOX IN CUSTOMER HAND') }
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
