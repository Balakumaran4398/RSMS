import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { SwalService } from '../../service/swal.service';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  chartOptions: any;
  role: string;
  username: string;
  date: any;
  chart: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.loadChartData(this.date);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const selectedDate = new Date(input.value);
      const today = new Date();
      // if (selectedDate <= today) {
      this.date = input.value;
      this.loadChartData(this.date);
      // } else {
      // this.swal.warning_1();
      // }
    }
  }

  loadChartData(date: string): void {

    this.userservice.getDashboardSubscribtionBarChartDetails(this.role, this.username, date).subscribe((data: any) => {
      this.updateChartData(data);
    });
  }

  updateChartData(data: any): void {
    const dataPoints = [];
    for (const date in data) {
      if (data.hasOwnProperty(date)) {
        let color;
        const count = data[date];
        if (count > 0) {
          color = "#3bada6";
        } else {
          color = "#d1ae2e";
        }

        dataPoints.push({
          x: new Date(date),
          y: count,
          label: date,
          color: color,
          indexLabel: count.toString(),
          indexLabelFontColor: "#5A5757",
          indexLabelFontSize: 14,
          indexLabelPlacement: "outside",
          indexLabelAlign: "left"
        });
      }
    }
    const chart = new CanvasJS.Chart("barchartContainer", {
      title: {
        text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
        fontSize: 18,
        fontWeight: 600
      },
      animationEnabled: true,
      axisY: {
        title: "Count",
        titleFontSize: 16,
        titleFontColor: "#5A5757",
        labelFontColor: "#5A5757",
        gridThickness: 0
      },
      axisX: {
        title: "Dates",
        labelFontSize: 14,
        labelFontColor: "#001716",
        labelAlign: "center",
        interval: 1,

      },
      data: [{
        type: "column",
        dataPoints: dataPoints,
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "inside",
        width: 10,
        indexLabelAlign: "center",
        color: (e: any) => e.dataPoint.color,
        // color: (dataPoints: any) => {
        //   if (dataPoints.y > 0) {
        //     return "#3bada6";
        //   }
        //   return "#d1ae2e";
        // }
      }]
    });

    chart.render();
  }
}
