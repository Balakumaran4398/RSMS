import { Component } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  public options: any = {
    animation: {
      duration: 1000
    },
    autoSize: true,
    // width: 600, // Example width
    height: 400,

    title: {
      text: 'Next 7 Days Subscription Expiry Count',
      fontSize: 18,
      fontWeight: '500'
    },
    series: [{
      type: 'bar',
      xKey: 'label',
      yKey: 'value',
      label: {
        formatter: ({ value }: any) => `${value}K`,
        fontSize: 12,
      },
    }],
    data: [
      { label: 'June 15', value: 75, color: '#5c3de7' },
      { label: 'June 16', value: 20, color: '#5c3de7' },
      { label: 'June 17', value: 24, color: '#5c3de7' },
      { label: 'June 18', value: 29, color: '#5c3de7' },
      { label: 'June 19', value: 13, color: '#5c3de7' },
      { label: 'June 11', value: 75, color: '#5c3de7' },
      { label: 'June 12', value: 20, color: '#5c3de7' },
      { label: 'June 13', value: 24, color: '#5c3de7' },
      { label: 'June 14', value: 29, color: '#5c3de7' },
      { label: 'June 10', value: 13, color: '#5c3de7' }

    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Month' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'count' },
        label: { formatter: ({ value }: any) => `${value}K` }
      }
    ],
  };
}
