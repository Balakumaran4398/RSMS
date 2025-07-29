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
  
  getBubbleStyle(index: number): { [key: string]: string } {
    const bubble = this.bubbleData[index];
    const count = bubble.count;

    // 1. Scale the size based on count (adjust min/max as needed)
    const minSize = 40; // in px
    const maxSize = 100; // in px
    const normalizedCount = Math.max(0, Math.min(count, 100)); // clamp between 0-100
    const size = minSize + ((maxSize - minSize) * normalizedCount) / 100; // scale linearly

    // 2. Define positions such that all bubbles "touch" (approximate based on index)
    const spacing = 1; // spacing between bubbles

    // Dynamic positions based on scaled size
    const positions = [
      { top: 0, left: size + spacing },               // bubble 0 - right of bubble 3
      { top: size + spacing, left: size + spacing },  // bubble 1 - below bubble 0
      { top: size + spacing, left: 0 },               // bubble 2 - below bubble 3
      { top: 0, left: 0 }                             // bubble 3 - top-left
    ];

    const position = positions[index];

    return {
      width: `${size}px`,
      height: `${size}px`,
      top: `${position.top}px`,
      left: `${position.left}px`,
      position: 'absolute'
    };
  }
}

