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
