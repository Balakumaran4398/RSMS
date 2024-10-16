// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-package-chart',
//   templateUrl: './package-chart.component.html',
//   styleUrls: ['./package-chart.component.scss']
// })
// export class PackageChartComponent {
//   chart: any;
//   isButtonVisible = false;

//   visitorsChartDrilldownHandler = (e: any) => {
//     this.chart.options = this.visitorsDrilldownedChartOptions;	
//     // this.chart.options.data = this.options[e.dataPoint.name];
//     this.chart.options.title = { text: e.dataPoint.name };
//     this.chart.render();
//     this.isButtonVisible = true;
//   };

//   visitorsDrilldownedChartOptions = {
//     animationEnabled: true,
//     theme: 'light2',
//     axisY: {
//       gridThickness: 0,
//       lineThickness: 1
//     },
//     data: []
//   };

//   chartOptions = {
//     animationEnabled: true,
//     theme: 'light2',
//     title: {
//       // text: 'Package Details',
//       text: 'PACKAGE DETAILS',
//       fontSize:20,
//       fontWeight:600,
//     },

//     data: [{
//       type: 'pie',
//       startAngle: 90,
//       cursor: 'pointer',
//       explodeOnClick: false,
//       showInLegend: true,
//       legendMarkerType: 'square',
//       // click: this.visitorsChartDrilldownHandler,
//       indexLabelPlacement: 'inside',
//       indexLabelFontColor: 'white',
//       dataPoints: [
//         { y: 1551160, name: 'New Visitors', color: '#3bada6', indexLabel: '62.56%' },
//         { y: 329840, name: 'Returning Visitors', color: '#61a0ed', indexLabel: '37.44%' },
//         { y: 551160, name: 'New Visitors', color: '#28b847', indexLabel: '62.56%' },
//         { y: 329840, name: 'Returning Visitors', color: '#d1ae2e', indexLabel: '37.44%' }
//       ]
//     }]
//   };

//   // options: any = {
//   //   'New vs Returning Visitors': this.chartOptions.data,
//   //   'New Visitors': [{
//   //     color: '#058dc7',
//   //     name: 'New Visitors',
//   //     type: 'column',
//   //     dataPoints: [
//   //       { label: 'Jan', y: 42600 },
//   //       { label: 'Feb', y: 44960 },
//   //       { label: 'Mar', y: 46160 },
//   //       { label: 'Apr', y: 48240 },
//   //       { label: 'May', y: 48200 },
//   //       { label: 'Jun', y: 49600 },
//   //       { label: 'Jul', y: 51560 },
//   //       { label: 'Aug', y: 49280 },
//   //       { label: 'Sep', y: 46800 },
//   //       { label: 'Oct', y: 57720 },
//   //       { label: 'Nov', y: 59840 },
//   //       { label: 'Dec', y: 54400 }
//   //     ]
//   //   }],
//   //   'Returning Visitors': [{
//   //     color: '#50b432',
//   //     name: 'Returning Visitors',
//   //     type: 'column',
//   //     dataPoints: [
//   //       { label: 'Jan', y: 21800 },
//   //       { label: 'Feb', y: 25040 },
//   //       { label: 'Mar', y: 23840 },
//   //       { label: 'Apr', y: 24760 },
//   //       { label: 'May', y: 25800 },
//   //       { label: 'Jun', y: 26400 },
//   //       { label: 'Jul', y: 27440 },
//   //       { label: 'Aug', y: 29720 },
//   //       { label: 'Sep', y: 29200 },
//   //       { label: 'Oct', y: 31280 },
//   //       { label: 'Nov', y: 33160 },
//   //       { label: 'Dec', y: 31400 }
//   //     ]
//   //   }]
//   // };

//   handleClick(event: Event) {
//     this.chart.options = this.chartOptions;
//     // this.chart.options.data = this.options['New vs Returning Visitors'];
//     this.chart.render(); 
//     this.isButtonVisible = false;
//   }

//   getChartInstance(chart: object) {
//     this.chart = chart;
//     this.chart.options = this.chartOptions;
//     this.chart.render();
//   }
// }




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
    // Fetching the data from the API
    this.userservice.getDashboardProductDetails(this.role, this.username).subscribe(
      (data: any) => {
        console.log('API Data:', data); // Log the API response for debugging
        if (data) {
          this.updateChartData(data); // Update chart data with API response
        }
      },
      (error) => {
        console.error('Error fetching API data:', error);
      }
    );
  }

  // Update chart data with the values from the API response
  updateChartData(apiData: any): void {
    // Ensure that the API data contains the keys you expect
    const dataPoints = [
      { name: "Addon Package", y: apiData["Addon Package"] || 0, color: "#bfa628" },
      { name: "Base Package", y: apiData["Base Package"] || 0, color: "#396ba8" },
      { name: "FTA Channels", y: apiData["FTA Channels"] || 0, color: "#147a2a" },
      { name: "Pay Channels", y: apiData["Pay Channels"] || 0, color: "#3bada6" }
    ];

    // Set up the chart options with dataPoints
    this.chartOptions = {
      animationEnabled: true,
      theme: 'light2',
      // title: {
      //   text: 'PACKAGE DETAILS',
      //   fontSize: 20,
      //   fontWeight: 600
      // },
      data: [{
        type: 'pie',
        // startAngle: 90,
        // indexLabel: '{name}: {y}',
        dataPoints: dataPoints,
        showInLegend: true,
        // legendText: '{name}',
        // indexLabelPlacement: 'inside',
        // indexLabelFontColor: 'white'
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




