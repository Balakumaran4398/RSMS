import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BaseService } from '../../service/base.service';
import { CanvasJS } from '@canvasjs/angular-charts';

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

  constructor(private userservice: BaseService, private storageservice: StorageService) {
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
      { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#bfa628" },
      { name: "Base Package", y: apiData["Base Package"] || 0, color: "#396ba8" },
      { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#147a2a" },
      { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#3bada6" }
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
      data: [{
        type: 'pie',
        dataPoints: dataPoints,
        showInLegend: true,
      }]
    };

    this.renderChart();
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




