import { Component } from '@angular/core';

@Component({
  selector: 'app-package-chart',
  templateUrl: './package-chart.component.html',
  styleUrls: ['./package-chart.component.scss']
})
export class PackageChartComponent {
  public options: any= {
    title: {
      text: 'Package Details',
      fontSize: 18,
      fontWeight: '500'
    },
    data: [
      { label: 'Download Sales', value: 300 },
      { label: 'In-Store Sales', value: 500 },
      { label: 'Mail-Order Sales', value: 100 }
    ],
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label'
      } 
    ]
  };  
 constructor(){
 
 }
}
