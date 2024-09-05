import { Component } from '@angular/core';


@Component({
  selector: 'app-inventory-chart',
  templateUrl: './inventory-chart.component.html',
  styleUrls: ['./inventory-chart.component.scss']
})
export class InventoryChartComponent {
  public options: any = {
    title: {
      text: 'Inventory Details',
      fontSize: 18,
      fontWeight: '500'
    },
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'category',
        fills: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
        strokes: ['#0055FF', '#00C38A', '#FF9900', '#FF1355', '#6842F4'],
        tooltipRenderer: (params: { datum: { category: any; value: any; }; }) => {
          return `<div style="text-align: center; font-weight: bold;">${params.datum.category}</div>
                  <div style="text-align: center;">Value: ${params.datum.value}</div>`;
        },
        label: {
          enabled: true,
          minRequiredAngle: 0, // Show labels for all slices
          position: 'inside',
          color: '#ffffff', // Label text color
          fontSize: 14,
          fontWeight: 'bold',
          offset: 0 // Offset label inside the pie slice
        },
        callout: {
          colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
          length: 10, // Length of the line from slice to callout
          strokeWidth: 2 // Stroke width of the callout line
        },
        data: [
          { category: 'Category A', value: 75 },
          { category: 'Category B', value: 10 },
          { category: 'Category C', value: 10 },
          { category: 'Category D', value: 5 }
        ]
      }
    ]
  };
  
}
