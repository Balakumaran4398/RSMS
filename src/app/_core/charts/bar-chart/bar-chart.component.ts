import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { SwalService } from '../../service/swal.service';
import { CanvasJS } from '@canvasjs/angular-charts';


import { Route, Router } from '@angular/router';


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
  value: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, private router: Router) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.loadChartData(this.date);
  }

  openMsoDialog() {
    console.log(event);
    this.router.navigate(['admin/expiry']);
  }
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const selectedDate = new Date(input.value);
      const today = new Date();
      this.date = input.value;
      this.loadChartData(this.date);
    }
  }

  loadChartData(date: string): void {

    this.userservice.getDashboardSubscribtionBarChartDetails(this.role, this.username, date).subscribe((data: any) => {
      this.updateChartData(data);
      console.log(data);

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
      animationEnabled: true,
      axisY: {
        title: "Count",
        titleFontSize: 16,
        titleFontColor: "#5A5757",
        labelFontColor: "#5A5757",
        gridThickness: 0,
      },
      axisX: {
        title: "Date",
        labelFontSize: 14,
        labelFontColor: "#001716",
        labelAlign: "center",
        interval: 1,
      },
      data: [{
        type: "column",
        dataPoints: dataPoints,
        dataPointWidth: 10,
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "inside",
        indexLabelAlign: "center",
        indexTextAlign: "center",
      }]
    });
    chart.render();
  }
}
