import { Component } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { FONT_WEIGHT } from 'ag-charts-community/dist/types/src/chart/themes/constants';


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

    this.userservice.getMembershipcountForPiechart(this.role, this.username).subscribe((data: any) => {
      console.log(data);
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
    legend: {
      verticalAlign: 'center',
      horizontalAlign: 'right',
      fontFamily: 'Arial',
      markerType: 'square',
      fontSize: 14,
      itemWrap: true,
      // itemTextFormatter: (e: any) => `${e.dataPoint.name}: ${e.dataPoint.y}`,
      itemTextFormatter: (e: any) => `${e.dataPoint.name}`,
    },
    data: [{
      type: 'pie',
      startAngle: 90,
      cursor: 'pointer',
      explodeOnClick: false,
      showInLegend: true,
      legendMarkerType: 'square',
      indexLabelPlacement: 'inside',
      indexLabelFontColor: 'block',
      indexLabelFontSize: 16,
      indexLabelFontWeight: "bold",
      dataPoints: [],
      indexLabelFormatter: (e: any) => `${e.dataPoint.y}%`,
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
