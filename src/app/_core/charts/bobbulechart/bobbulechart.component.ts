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
  bubbleData: { label: string; count: number; color: string }[] = [];
  colorPalette = ['#00bfff', '#00cc66', '#00ced1', '#ff66cc'];
  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();
  }

  ngOnInit(): void {
    this.userservice.getDashboardMonthwiseFirstTimeActivationDetails(this.role, this.username)
      .subscribe((apiData: any[]) => {
        if (Array.isArray(apiData)) {
          this.bubbleData = apiData.map((item, index) => ({
            label: item.Month,
            count: item.count,
            color: this.colorPalette[index % this.colorPalette.length]
          }));
        }
      });
  }
}

