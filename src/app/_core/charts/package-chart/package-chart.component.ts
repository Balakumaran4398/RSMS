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

  updateChartData(apiData: any): void {
    const dataPoints = [

      // { name: "Base Package", y: apiData["Base Package"] || 0, color: "#2971cf", click: () => this.navigateToPage('BASE PACKAGE') },
      // { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#48c150", click: () => this.navigateToPage('ADDON PACKAGE') },
      // { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#f4a261", click: () => this.navigateToPage('PAYCHANNEL') },
      // { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#C6C6C6", click: () => this.navigateToPage('FTA CHANNEL') },


      // { name: "Base Package", y: apiData["Base Package"] || 0, color: "#bdbfbf", click: () => this.navigateToPage('BASE PACKAGE') },
      // { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#de811d", click: () => this.navigateToPage('ADDON PACKAGE') },
      // { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#2971cf", click: () => this.navigateToPage('PAYCHANNEL') },
      // { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#3cb051", click: () => this.navigateToPage('FTA CHANNEL') },
      

      // { name: "Base Package", y: apiData["Base Package"] || 0, color: "#CBBD93", click: () => this.navigateToPage('BASE PACKAGE') },
      // { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#FAE8B4", click: () => this.navigateToPage('ADDON PACKAGE') },
      // { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#80775C", click: () => this.navigateToPage('PAYCHANNEL') },
      // { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#574A24", click: () => this.navigateToPage('FTA CHANNEL') },


      // { name: "Base Package", y: apiData["Base Package"] || 0, color: "#000000", click: () => this.navigateToPage('BASE PACKAGE') },
      // { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#D1D0D0", click: () => this.navigateToPage('ADDON PACKAGE') },
      // { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#988686", click: () => this.navigateToPage('PAYCHANNEL') },
      // { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#5C4E4E", click: () => this.navigateToPage('FTA CHANNEL') },

// -----------------------------------------------Normal------------------------------

      { name: "Base Package", y: apiData["Base Package"] || 0, color: "#396ba8", click: () => this.navigateToPage('BASE PACKAGE') },
      { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#bfa628", click: () => this.navigateToPage('ADDON PACKAGE') },
      { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#3bada6", click: () => this.navigateToPage('PAYCHANNEL') },
      { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#147a2a", click: () => this.navigateToPage('FTA CHANNEL') },
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
        itemTextFormatter: (e: any) => `${e.dataPoint.name}  :   ${e.dataPoint.y}`,
        // itemTextFormatter: (e: any) => {
        //   // Format the legend text with alignment and color
        //   const name = `<span style="color: blue; margin-right:10px">${e.dataPoint.name}</span>`;
        //   const colon = `<span style="margin-right:10px">    :     </span>`;
        //   const value = `<span style="color: green;  float: right;">${e.dataPoint.y}</span>`;

        //   return `${name} ${colon} ${value}`;
        // },
      },
      title: {
        text: "PACKAGE DETAILS",
        fontSize: 18,
        fontWeight: 600
      },
      data: [{
        type: 'pie',
        dataPoints: dataPoints,
        showInLegend: true,
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
  renderChart(): void {
    if (document.getElementById('packagechartContainer')) {
      this.chart = new CanvasJS.Chart('packagechartContainer', this.chartOptions);
      this.chart.render();
    } else {
      console.error('Chart container not found!');
    }
  }
}




