import { Component } from '@angular/core';
import { FONT_SIZE } from 'ag-charts-community/dist/types/src/integrated-charts-theme';

@Component({
	selector: 'app-stb-chart',
	templateUrl: './stb-chart.component.html',
	styleUrls: ['./stb-chart.component.scss']
})
export class StbChartComponent {
	chartOptions = {
		title: {
			text: "STB DETAILS",
			fontSize: 20,
			fontWeight: 600
		},
		animationEnabled: true,
		axisY: {
			title: "Count",
			titleFontSize: 16,
			titleFontColor: "#5A5757",
			labelFontColor: "#5A5757",
			gridThickness: 0,
		},

		data: [{
			type: "column",

			indexLabelFontColor: "#5A5757",
			dataPoints: [
				{ label: "Active", y: 50, color: "#1a8a38" },  // Green
				{ label: "Deactive", y: 30, color: "#db635a" },  // Pink
				{ label: "Fresh", y: 20, color: "#622a82" },  // Purple
				{ label: "Not Expiry", y: 40, color: "#2d72ad" },  // Blue
				{ label: "Expiry", y: 10, color: "#deac2c" },  // Yellow
				{ label: "Block", y: 15, color: "#52504e" }  // Light Green
			],


		}]

	}

}
