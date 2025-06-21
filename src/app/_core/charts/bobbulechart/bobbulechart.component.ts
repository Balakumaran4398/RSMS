import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { CanvasJS } from '@canvasjs/angular-charts';


@Component({
  selector: 'app-bobbulechart',
  templateUrl: './bobbulechart.component.html',
  styleUrls: ['./bobbulechart.component.scss'],
})
export class BobbulechartComponent implements OnInit {
  role: string;
  username: string;
  chart: any;
  chartOptions: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();
  }
  ngOnInit(): void {
    this.userservice.getDashboardMonthwiseFirstTimeActivationDetails(this.role, this.username).subscribe(
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
  // updateChartData(apiData: any): void {
  //   const dataPoints = [
  // { name: "Base Package", y: apiData["Base Package"] || 0, color: "#d16f36", click: () => this.navigateToPage('BASE PACKAGE') },
  //     { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#1d8ebf", click: () => this.navigateToPage('ADDON PACKAGE') },
  //     { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#73c940", click: () => this.navigateToPage('PAYCHANNEL') },
  //     { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#bc52cc", click: () => this.navigateToPage('FTA CHANNEL') },
  //   ];

  //   this.chartOptions = {
  //     animationEnabled: true,
  //     theme: 'light2',
  //     legend: {
  //       verticalAlign: 'bottom',
  //       horizontalAlign: 'center',
  //       fontFamily: 'Arial',
  //       markerType: 'square',
  //       fontSize: 14,
  //       itemWrap: false,
  //       itemTextFormatter: (e: any) => `${e.dataPoint.name}  :   ${e.dataPoint.y}`,
  //     },

  //     data: [{
  //       animationEnabled: true,
  //       type: "doughnut",
  //       dataPoints: dataPoints,
  //       showInLegend: true,

  //     }]
  //   };
  //       this.renderChart();
  // }

  navigateToPage(status: string): void {
    let packageId: string;
    switch (status) {
      case 'BASE PACKAGE':
        packageId = '7';
        break;
      case 'ADDON PACKAGE':
        packageId = '8';
        break;
      case 'PAYCHANNEL':
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


  updateChartData(apiData: any): void {
    const dataPoints = [
      { x: 10, y: apiData["Base Package"] || 0, z: 15, name: "Base Package", color: "#d16f36" },
      { x: 20, y: apiData["Addon Package"] || 0, z: 20, name: "Addon Package", color: "#1d8ebf" },
      { x: 30, y: apiData["Pay Channels"] || 0, z: 25, name: "Pay Channels", color: "#73c940" },
      { x: 40, y: apiData["FTA Channels"] || 0, z: 30, name: "FTA Channels", color: "#bc52cc" },
    ];

    this.chartOptions = {
      animationEnabled: true,
      theme: 'light2',
      legend: {
        verticalAlign: 'bottom',
        horizontalAlign: 'center',
        fontFamily: 'Arial',
        markerType: 'square',
        fontSize: 14,
        itemWrap: false,
        itemTextFormatter: (e: any) => `${e.dataPoint.name}  :   ${e.dataPoint.y}`,
      },

      axisX: {
        title: "Category Index"
      },
      axisY: {
        title: "Channel Count"
      },

      data: [{
        type: "bubble",
        toolTipContent: "<b>{name}</b><br/>X: {x}<br/>Y: {y}<br/>Z: {z}",
        showInLegend: false,
        dataPoints: dataPoints
      }]
    };

    this.renderChart();
  }

  renderChart(): void {
    if (document.getElementById('bubbleChartContainer')) {
      this.chart = new CanvasJS.Chart('bubbleChartContainer', this.chartOptions);
      this.chart.render();
    } else {
      console.error('Chart container not found!');
    }
  }
}

