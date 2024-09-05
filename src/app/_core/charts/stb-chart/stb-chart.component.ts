import { Component } from '@angular/core';

@Component({
  selector: 'app-stb-chart',
  templateUrl: './stb-chart.component.html',
  styleUrls: ['./stb-chart.component.scss']
})
export class StbChartComponent {
  public options: any = {
    autoSize: true,
    // width: 800,
    height: 400,
    title: {
      text: 'STB Details',
      fontSize: 18,
      fontWeight: '500'
    },
    series: [{
      type: 'bar',
      xKey: 'label',
      yKey: 'value',
      label: {
        formatter: ({ value }: any) => `${value}`,
        fontSize: 12,
      },
      fills: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'], 
      strokes: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'], 
      highlightStyle: {
        item: {
          fill: '#1f6764'
        }
      }
    }],
    data: [
      { label: 'Active', value: 20 },
      { label: 'Deactive', value: 20 },
      { label: 'Fresh', value: 24 },
      { label: 'Not Expiry', value: 29 },
      { label: 'Expiry', value: 13 },
      { label: 'Block', value: 13 },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Status' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Count' },
        label: { formatter: ({ value }: any) => `${value}` }
      }
    ],
    tooltip: {
      enabled: true
    },
    animation: {
      duration: 1000,
      easing: 'easeOut'
    }
  };
}
