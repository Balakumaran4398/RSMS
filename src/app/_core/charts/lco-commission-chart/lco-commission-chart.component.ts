// import { Component } from '@angular/core';
// import { BaseService } from '../../service/base.service';
// import { StorageService } from '../../service/storage.service';

// @Component({
//   selector: 'app-lco-commission-chart',
//   templateUrl: './lco-commission-chart.component.html',
//   styleUrls: ['./lco-commission-chart.component.scss']
// })
// export class LcoCommissionChartComponent {
//   chart: any;
//   isButtonVisible = false;
//   role: any;
//   username: any;

//   constructor(private userservice: BaseService, private storageservice: StorageService) {
//     this.role = storageservice.getUserRole();
//     this.username = storageservice.getUsername();
//     userservice.getMembershipcountForPiechart(this.role, this.username).subscribe((data: any) => {
//       console.log(data);
//     })
//   }
//   visitorsChartDrilldownHandler = (e: any) => {
//     this.chart.options = this.visitorsDrilldownedChartOptions;
//     this.chart.options.data = this.options[e.dataPoint.name];
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
//     // title: {
//     //   text: 'New vs Returning Visitors'
//     // },

//     data: [{
//       type: 'pie',
//       startAngle: 90,
//       cursor: 'pointer',
//       explodeOnClick: false,
//       showInLegend: true,
//       legendMarkerType: 'square',
//       click: this.visitorsChartDrilldownHandler,
//       indexLabelPlacement: 'inside',
//       indexLabelFontColor: 'white',
//       dataPoints: [
//         { y: 551160, name: 'New Visitors', color: '#058dc7', indexLabel: '62.56%' },
//         { y: 329840, name: 'Returning Visitors', color: '#50b432', indexLabel: '37.44%' }
//       ]
//     }]
//   };
//   options: any = {
//     'New vs Returning Visitors': this.chartOptions.data,
//     'New Visitors': [{
//       color: '#058dc7',
//       name: 'New Visitors',
//       type: 'column',
//       dataPoints: [
//         { label: 'Jan', y: 42600 },
//         { label: 'Feb', y: 44960 },
//         { label: 'Mar', y: 46160 },
//         { label: 'Apr', y: 48240 },
//         { label: 'May', y: 48200 },
//         { label: 'Jun', y: 49600 },
//         { label: 'Jul', y: 51560 },
//         { label: 'Aug', y: 49280 },
//         { label: 'Sep', y: 46800 },
//         { label: 'Oct', y: 57720 },
//         { label: 'Nov', y: 59840 },
//         { label: 'Dec', y: 54400 }
//       ]
//     }],
//     'Returning Visitors': [{
//       color: '#50b432',
//       name: 'Returning Visitors',
//       type: 'column',
//       dataPoints: [
//         { label: 'Jan', y: 21800 },
//         { label: 'Feb', y: 25040 },
//         { label: 'Mar', y: 23840 },
//         { label: 'Apr', y: 24760 },
//         { label: 'May', y: 25800 },
//         { label: 'Jun', y: 26400 },
//         { label: 'Jul', y: 27440 },
//         { label: 'Aug', y: 29720 },
//         { label: 'Sep', y: 29200 },
//         { label: 'Oct', y: 31280 },
//         { label: 'Nov', y: 33160 },
//         { label: 'Dec', y: 31400 }
//       ]
//     }]
//   };

//   handleClick(event: Event) {
//     this.chart.options = this.chartOptions;
//     this.chart.options.data = this.options['New vs Returning Visitors'];
//     this.chart.render();
//     this.isButtonVisible = false;
//   }

//   getChartInstance(chart: object) {
//     this.chart = chart;
//     this.chart.options = this.chartOptions;
//     this.chart.render();
//   }
// }
import { Component } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';


@Component({
  selector: 'app-lco-commission-chart',
  templateUrl: './lco-commission-chart.component.html',
  styleUrls: ['./lco-commission-chart.component.scss']
})
export class LcoCommissionChartComponent {
  chart: any;
  isButtonVisible = false;
  role: string;
  username: string;

  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

    // Fetching data from API and updating chart data
    this.userservice.getMembershipcountForPiechart(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      // Convert the API data to the format needed for the chart
      const dataPoints = Object.keys(data).map(key => ({
        y: data[key],
        name: key
      }));
      this.updateChartData(dataPoints);
    });
  }


  chartOptions = {
    animationEnabled: true,
    theme: 'light2',
    data: [{
      type: 'pie',
      startAngle: 90,
      cursor: 'pointer',
      explodeOnClick: false,
      showInLegend: true,
      legendMarkerType: 'square',
      indexLabelPlacement: 'inside',
      indexLabelFontColor: 'white',
      dataPoints: []
    }]
  };

  getChartInstance(chart: any) {
    this.chart = chart;
    this.chart.render();
  }

  updateChartData(dataPoints: any) {
    this.chartOptions.data[0].dataPoints = dataPoints;
    console.log(this.chartOptions.data);
    if (this.chart) {
      this.chart.render();
    }
  }
}
