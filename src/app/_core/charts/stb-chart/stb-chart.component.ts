import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
	selector: 'app-stb-chart',
	templateUrl: './stb-chart.component.html',
	styleUrls: ['./stb-chart.component.scss']
})
export class StbChartComponent implements OnInit {
	role: string;
	username: string;

	constructor(private userservice: BaseService, private storageservice: StorageService) {
		this.role = storageservice.getUserRole();
		this.username = storageservice.getUsername();
	}

	ngOnInit(): void {
		this.userservice.getDashboardStbBarChart(this.role, this.username).subscribe((data: any) => {
			this.renderChart(data);
			console.log(data);

		});
	}

	renderChart(data: any): void {
		const chart = new CanvasJS.Chart("stbchartContainer", {
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
				gridThickness: 0
			},
			data: [{
				type: "column",
				indexLabelFontColor: "#5A5757",
				dataPoints: [
					{ label: "Active", y: data["ACTIVE STB's"], color: "#1a8a38" },
					{ label: "Deactive", y: data["DEACTIVE STB's"], color: "#db635a" },
					{ label: "Fresh", y: data["NOT ACTIVE STB's"], color: "#622a82" },
					{ label: "Not Expiry", y: data["ACTIVE SUBSCRIPTION"], color: "#2d72ad" },
					{ label: "Expiry", y: data["EXPIRED SUBSCRIPTION"], color: "#deac2c" },
					{ label: "Block", y: data["BLOCKED STB's"], color: "#52504e" }
				]
			}]

		});

		chart.render();  // Render the chart
	}
}
