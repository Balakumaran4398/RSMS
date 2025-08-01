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
  // bubbleData: { label: string; count: number; color: string }[] = [];
  // colorPalette = ['#00bfff', '#00cc66', '#00ced1', '#ff66cc'];
  dataPoints: { name: string; y: number; color: string, click?: () => void; }[] = [];

  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();
  }

  ngOnInit(): void {
    // this.userservice.getDashboardMonthwiseFirstTimeActivationDetails(this.role, this.username)
    //   .subscribe((apiData: any[]) => {
    //     if (Array.isArray(apiData)) {
    //       this.bubbleData = apiData.map((item, index) => ({
    //         label: item.Month,
    //         count: item.count,
    //         color: this.colorPalette[index % this.colorPalette.length]
    //       }));
    //     }
    //   });
    this.userservice.getDashboardMonthwiseFirstTimeActivationDetails(this.role, this.username)
      .subscribe((data: any[]) => {
        console.log(data);
        this.updateChartData(data);
      });


  }

  updateChartData(apiData: any): void {

    this.dataPoints = apiData.map((item: any, index: number) => ({
      name: item.Month,
      y: item.count,
      color: this.getColorByIndex(index)
    }));
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
      // title: {
      //   text: "Customer Growth",
      //   fontSize: 18,
      //   fontWeight: 600
      // },
      data: [{
        type: "pie",
        dataPoints: this.dataPoints,
        showInLegend: true,
      }]
    };
    this.renderChart();
  }


  renderChart(): void {
    this.chart = new CanvasJS.Chart("bubbleChartContainer", this.chartOptions);
    this.chart.render();
  }




  getColorByIndex(index: any): string {
    // const colorPalette = ['#e26cadff', '#33a5d6',  '#73d6b0ff', '#85e6f3ff'];
    const colorPalette = ['#33a5d6', '#3bada6', '#306c94ff', '#cccccc'];
    return colorPalette[index % colorPalette.length]; // loop if more months
  }


  // getBubbleStyle(index: number): { [key: string]: string } {
  //   const bubble = this.bubbleData[index];
  //   const count = bubble.count;

  //   const minSize = 40;
  //   const maxSize = 100;
  //   const normalizedCount = Math.max(0, Math.min(count, 100));
  //   const size = minSize + ((maxSize - minSize) * normalizedCount) / 100;

  //   const spacing = 1; // spacing between bubbles

  //   const positions = [
  //     { top: 0, left: size + spacing },
  //     { top: size + spacing, left: size + spacing },
  //     { top: size + spacing, left: 0 },
  //     { top: 0, left: 0 }
  //   ];

  //   const position = positions[index];

  //   return {
  //     width: `${size}px`,
  //     height: `${size}px`,
  //     top: `${position.top}px`,
  //     left: `${position.left}px`,
  //     position: 'absolute'
  //   };
  // }

  // getBubbleSize(count: number): string {
  //   const size = Math.max(50, Math.min(count * 2, 100)); // Ensures size is between 50px and 100px
  //   return `${size}px`;
  // }

  // getBubbleTop(index: number): string {
  //   const positions = ['5px', '0px', '60px', '80px'];
  //   return positions[index] || '0px';
  // }

  // getBubbleLeft(index: number): string {
  //   const positions = ['20px', '80px', '15px', '90px'];
  //   return positions[index] || '0px';
  // }


}

