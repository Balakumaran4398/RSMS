import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { CanvasJS } from '@canvasjs/angular-charts';
import { Router } from '@angular/router';

@Component({
	selector: 'app-stb-chart',
	templateUrl: './stb-chart.component.html',
	styleUrls: ['./stb-chart.component.scss']
})
export class StbChartComponent implements OnInit {
	role: string;
	username: string;

	constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
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
			// title: {
			// 	text: "STB DETAILS",
			// 	fontSize: 18,
			// 	fontWeight: 600
			// },
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
				dataPointWidth: 10,
				indexLabelFontColor: "#5A5757",
				indexLabelFontSize: 14,
				indexLabelPlacement: "outside",
				indexLabelAlign: "center",
				dataPoints: [
					{ label: "Active", y: data["ACTIVE STB's"], color: "#1a8a38", indexLabel: data["ACTIVE STB's"].toString(), click: () => this.navigateToPage('Active') },
					{ label: "Deactive", y: data["DEACTIVE STB's"], color: "#db635a", indexLabel: data["DEACTIVE STB's"].toString(), click: () => this.navigateToPage('Deactive') },
					{ label: "Fresh", y: data["NOT ACTIVE STB's"], color: "#622a82", indexLabel: data["NOT ACTIVE STB's"].toString(), click: () => this.navigateToPage('Fresh') },
					{ label: "Not Expiry", y: data["ACTIVE SUBSCRIPTION"], color: "#2d72ad", indexLabel: data["ACTIVE SUBSCRIPTION"].toString(), click: () => this.navigateToPage('Not Expiry') },
					{ label: "Expiry", y: data["EXPIRED SUBSCRIPTION"], color: "#deac2c", indexLabel: data["EXPIRED SUBSCRIPTION"].toString(), click: () => this.navigateToPage('Expiry') },
					{ label: "Block", y: data["BLOCKED STB's"], color: "#52504e", indexLabel: data["BLOCKED STB's"].toString(), click: () => this.navigateToPage('Block') }
				]
			}]
		});
		chart.render();
	}
	navigateToPage(status: string): void {
		let packageId: string;
		switch (status) {
			case 'Active':
				packageId = '1';
				break;
			case 'Deactive':
				packageId = '2';
				break;
			case 'Fresh':
				packageId = '3';
				break;
			case 'Not Expiry':
				packageId = '4';
				break;
			case 'Expiry':
				packageId = '5';
				break;
			case 'Block':
				packageId = '6';
				break;
			default:
				packageId = '';
		}
		this.router.navigate(['admin/STBReport/' + packageId]);
	}

}
