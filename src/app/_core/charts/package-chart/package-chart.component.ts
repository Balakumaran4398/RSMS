import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BaseService } from '../../service/base.service';
import { CanvasJS } from '@canvasjs/angular-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-chart',
  templateUrl: './package-chart.component.html',
  styleUrls: ['./package-chart.component.scss']
})
export class PackageChartComponent implements OnInit {
  role: string;
  username: string;
  chart: any;
  chartOptions: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();
  }

  ngOnInit(): void {
    this.userservice.getDashboardProductDetails(this.role, this.username).subscribe(
      (data: any) => {
        console.log('API Data:', data);
        if (data) {
          this.updateChartData(data);
        }
      },
      (error) => {
        console.error('Error fetching API data:', error);
      }
    );
  }

  //   updateChartData(apiData: any): void {
  //     const dataPoints = [
  // // -----------------------------------------------Normal------------------------------
  //       { name: "Base Package", y: apiData["Base Package"] || 0, color: "#396ba8", click: () => this.navigateToPage('BASE PACKAGE') },
  //       { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#bfa628", click: () => this.navigateToPage('ADDON PACKAGE') },
  //       { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#3bada6", click: () => this.navigateToPage('PAYCHANNEL') },
  //       { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#147a2a", click: () => this.navigateToPage('FTA CHANNEL') },
  //     ];

  //     this.chartOptions = {
  //       animationEnabled: true,
  //       theme: 'light2',
  //       legend: {
  //         verticalAlign: 'center',
  //         horizontalAlign: 'right',
  //         fontFamily: 'Arial',
  //         markerType: 'square',
  //         fontSize: 14,
  //         itemWrap: true,
  //         itemTextFormatter: (e: any) => `${e.dataPoint.name}  :   ${e.dataPoint.y}`,
  //       },
  //       title: {
  //         text: "PACKAGE DETAILS",
  //         fontSize: 18,
  //         fontWeight: 600
  //       },
  //       data: [{
  //         type: 'pie',
  //         dataPoints: dataPoints,
  //         showInLegend: true,
  //       }]
  //     };

  //     this.renderChart();
  //   }
  //   navigateToPage(status: string): void {
  //     let packageId: string;
  //     switch (status) {
  //       case 'BASE PACKAGE':
  //         packageId = '7';
  //         break;
  //       case 'ADDON PACKAGE':
  //         packageId = '8';
  //         break;
  //       case 'PAYCHANNEL':
  //         packageId = '9';
  //         break;
  //       case 'FTA CHANNEL':
  //         packageId = '10';
  //         break;

  //       default:
  //         packageId = '';
  //     }
  //     this.router.navigate(['admin/packageReport/' + packageId]);
  //   }
  //   renderChart(): void {
  //     if (document.getElementById('packagechartContainer')) {
  //       this.chart = new CanvasJS.Chart('packagechartContainer', this.chartOptions);
  //       this.chart.render();
  //     } else {
  //       console.error('Chart container not found!');
  //     }
  //   }

  updateChartData(apiData: any): void {
    const dataPoints = [
      // -----------------------------------------------Normal------------------------------

      // { name: "Base Package", y: apiData["Base Package"] || 0, color: "#396ba8", click: () => this.navigateToPage('BASE PACKAGE') },
      // { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#bfa628", click: () => this.navigateToPage('ADDON PACKAGE') },
      // { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#3bada6", click: () => this.navigateToPage('PAYCHANNEL') },
      // { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#147a2a", click: () => this.navigateToPage('FTA CHANNEL') },

      { name: "Base Package", y: apiData["Base Package"] || 0, color: "#d16f36", click: () => this.navigateToPage('BASE PACKAGE') },
      { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#1d8ebf", click: () => this.navigateToPage('ADDON PACKAGE') },
      { name: "Pay Channel", y: apiData["Pay Channels"] || 0, color: "#73c940", click: () => this.navigateToPage('PAY CHANNEL') },
      { name: "FTA Channel", y: apiData["FTA Channels"] || 0, color: "#bc52cc", click: () => this.navigateToPage('FTA CHANNEL') },
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
        itemWrap: false,
        itemTextFormatter: (e: any) => `${e.dataPoint.name}  :   ${e.dataPoint.y}`,
      },

      data: [{
        animationEnabled: true,
        type: "doughnut",
        dataPoints: dataPoints,
        showInLegend: true,
        click: (e: any) => {
          const clickedName = e.dataPoint.name;
          this.navigateToPage(clickedName.toUpperCase());
        }
      }]
    };
    this.renderChart();
  }
  navigateToPage(status: string): void {
    let packageId: string;
    switch (status) {
      case 'BASE PACKAGE':
        packageId = '7';
        break;
      case 'ADDON PACKAGE':
        packageId = '8';
        break;
      case 'PAY CHANNEL':
        packageId = '9';
        break;
      case 'FTA CHANNEL':
        packageId = '10';
        break;

      default:
        packageId = '';
    }
    this.router.navigate(['admin/packageReport/' + packageId]);
  }
  renderChart(): void {
    if (document.getElementById('packagechartContainer')) {
      this.chart = new CanvasJS.Chart('packagechartContainer', this.chartOptions);
      this.chart.render();
    } else {
      console.error('Chart container not found!');
    }
  }
}




