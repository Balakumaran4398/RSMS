import { Component, OnInit } from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
	selector: 'app-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
	chartOptions: any;

	ngOnInit() {
		this.initializeChartOptions();

	}


	//   initializeChartOptions() {
	//     const weekLabels = this.generateWeekLabels();

	//     this.chartOptions = {
	//       animationEnabled: true,
	//       title: {
	//         text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
	//         fontSize: 23,
	//         fontWeight: 600
	//       },
	//       axisX: {
	//         labelAngle: -10
	//       },
	//       axisY: {
	//         title: "Count"
	//       },
	//       toolTip: {
	//         shared: true
	//       },
	//       legend: {
	//         cursor: "pointer",
	//         itemclick: function(e: any) {
	//           if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
	//             e.dataSeries.visible = false;
	//           } else {
	//             e.dataSeries.visible = true;
	//           }
	//           e.chart.render();
	//         }
	//       },
	//       data: [{
	//         type: "column",
	//         name: "Subscription Expired Count",
	//         legendText: "Expired Subscriptions",
	//         showInLegend: true,
	//         dataPoints: weekLabels.map((label, index) => ({
	//           label: label,
	//           y: Math.floor(Math.random() * 300) // Replace with actual data if needed
	//         }))
	//       }]
	//     };
	//   }

	initializeChartOptions() {
		const weekLabels = this.generateWeekLabels();

		this.chartOptions = {
			animationEnabled: true,
			title: {
				text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
				fontSize: 20,
				fontWeight: 600,
			},
			axisX: {
				labelAngle: 0,
				gridThickness: 0,

			},
			axisY: {
				title: "Count",
				gridThickness: 0,
			},

			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				itemclick: function (e: any) {
					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					e.chart.render();
				}
			},
			data: [{
				type: "column",
				name: "Subscription Expired Count",
				legendText: "Expired Subscriptions",
				showInLegend: true,
				dataPoints: weekLabels.map((label) => ({
					label: label,
					y: Math.floor(Math.random() * 300),
					color: '#3bada6',
					width: 10
				})
				),

			}]
			// data: [{
			// 	type: "column",
			// 	name: "Subscription Expired Count",
			// 	legendText: "Expired Subscriptions",
			// 	showInLegend: true,
			// 	dataPoints: weekLabels.map((label, index) => ({
			// 		label: label,
			// 		y: Math.floor(Math.random() * 300),
			// 		color: this.getGradientColor(index), // Apply gradient function
			// 		width: 10
			// 	}))
			// }]
		};
	}
	// getGradientColor(index: any) {
	// 	var color = new CanvasJS.Chart().ctx.createLinearGradient(0, 0, 0, 100);
	// 	color.addColorStop(0, '#134142');  // Start color
	// 	color.addColorStop(1, '#60e8eb');  // End color
	// 	return color;
	// }
	generateWeekLabels() {
		const today = new Date();
		const weekLabels = [];

		for (let i = 0; i < 7; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() - (today.getDay() - i)); // Get the correct day of the week
			const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
			weekLabels.push(formattedDate);
		}

		return weekLabels;
	}

}
