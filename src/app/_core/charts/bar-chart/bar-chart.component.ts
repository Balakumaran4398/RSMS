// import { Component, OnInit } from '@angular/core';
// import { CanvasJS } from '@canvasjs/angular-charts';
// import { BaseService } from '../../service/base.service';
// import { StorageService } from '../../service/storage.service';

// @Component({
// 	selector: 'app-bar-chart',
// 	templateUrl: './bar-chart.component.html',
// 	styleUrls: ['./bar-chart.component.scss']
// })
// export class BarChartComponent implements OnInit {
// 	chartOptions: any;

// 	// ngOnInit() {
// 	// 	this.initializeChartOptions();

// 	// }

// 	role: string;
// 	username: string;
// 	date:any;
// 	chart: any;  // Store chart instance here
// 	// chartOptions: any;
// 	constructor(private userservice: BaseService, private storageservice: StorageService) {
// 	  this.role = storageservice.getUserRole();
// 	  this.username = storageservice.getUsername();
// 	}

// 	ngOnInit(): void {
// 	  this.userservice.getDashboardSubscribtionBarChartDetails(this.role, this.username,this.date).subscribe((data: any) => {
// 		console.log(data);
// 		// this.updateChartData(data);
// 	  });
// 	}


// 	initializeChartOptions() {
// 		const weekLabels = this.generateWeekLabels();

// 		this.chartOptions = {
// 			animationEnabled: true,
// 			title: {
// 				text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
// 				fontSize: 20,
// 				fontWeight: 600,
// 			},
// 			axisX: {
// 				labelAngle: 0,
// 				gridThickness: 0,

// 			},
// 			axisY: {
// 				title: "Count",
// 				gridThickness: 0,
// 			},

// 			toolTip: {
// 				shared: true
// 			},
// 			legend: {
// 				cursor: "pointer",
// 				itemclick: function (e: any) {
// 					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
// 						e.dataSeries.visible = false;
// 					} else {
// 						e.dataSeries.visible = true;
// 					}
// 					e.chart.render();
// 				}
// 			},
// 			data: [{
// 				type: "column",
// 				name: "Subscription Expired Count",
// 				legendText: "Expired Subscriptions",
// 				showInLegend: true,
// 				dataPoints: weekLabels.map((label) => ({
// 					label: label,
// 					y: Math.floor(Math.random() * 300),
// 					color: '#3bada6',
// 					width: 10
// 				})
// 				),

// 			}]

// 		};
// 	}

// 	generateWeekLabels() {
// 		const today = new Date();
// 		const weekLabels = [];

// 		for (let i = 0; i < 7; i++) {
// 			const date = new Date(today);
// 			date.setDate(today.getDate() - (today.getDay() - i)); // Get the correct day of the week
// 			const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
// 			weekLabels.push(formattedDate);
// 		}

// 		return weekLabels;
// 	}

// }


// import { Component, OnInit } from '@angular/core';
// import { BaseService } from '../../service/base.service';
// import { StorageService } from '../../service/storage.service';

// @Component({
// 	selector: 'app-bar-chart',
// 	templateUrl: './bar-chart.component.html',
// 	styleUrls: ['./bar-chart.component.scss']
// })
// export class BarChartComponent implements OnInit {
// 	chartOptions: any;
// 	role: string;
// 	username: string;
// 	date: any;
// 	chart: any;

// 	constructor(private userservice: BaseService, private storageservice: StorageService) {
// 		this.role = storageservice.getUserRole();
// 		this.username = storageservice.getUsername();
// 	}

// 	ngOnInit(): void {
// 		this.date = new Date().toISOString().split('T')[0]; 
// 		// this.loadChartData(this.date); 
// 		this.onDateChange();
// 	}

// 	onDateChange(): void {
// 		this.loadChartData(this.date); 
// 	}

// 	loadChartData(date: string): void {
// 		this.userservice.getDashboardSubscribtionBarChartDetails(this.role, this.username, date).subscribe((data: any) => {
// 			console.log("API Data:", data); // Log the API response
// 			if (data) {
// 				this.updateChartData(data); // Update chart with new data
// 			}
// 		}, (error) => {
// 			console.error("Error fetching API data:", error);
// 		});
// 	}

// 	updateChartData(apiData: { [key: string]: number }): void {
// 		// Transform API data into dataPoints array for the chart
// 		const dataPoints = Object.entries(apiData).map(([date, count]) => ({
// 			label: date, // Use date as the label
// 			y: count,    // Use count for the y value
// 			color: this.getColor(count) // Optional: Set color based on the count
// 		}));

// 		this.chartOptions = {
// 			animationEnabled: true,
// 			title: {
// 				text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
// 				fontSize: 20,
// 				fontWeight: 600,
// 			},
// 			axisX: {
// 				labelAngle: 0,
// 				gridThickness: 0,
// 			},
// 			axisY: {
// 				title: "Count",
// 				gridThickness: 0,
// 			},
// 			toolTip: {
// 				shared: true
// 			},
// 			legend: {
// 				cursor: "pointer",
// 				itemclick: (e: any) => {
// 					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
// 						e.dataSeries.visible = false;
// 					} else {
// 						e.dataSeries.visible = true;
// 					}
// 					e.chart.render();
// 				}
// 			},
// 			data: [{
// 				type: "column",
// 				name: "Subscription Expired Count",
// 				legendText: "Expired Subscriptions",
// 				showInLegend: true,
// 				dataPoints: dataPoints // Use transformed dataPoints from API
// 			}]
// 		};

// 		this.renderChart(); // Render the chart with the new data
// 	}

// 	renderChart(): void {
// 		if (this.chart) {
// 			this.chart.render();
// 		}
// 	}

// 	// Optional: Method to set color based on count
// 	private getColor(count: number): string {
// 		if (count > 0) {
// 			return '#28b847'; // Green for positive counts
// 		}
// 		return '#d1ae2e'; // Yellow or any other color for zero counts
// 	}
// }





import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { SwalService } from '../../service/swal.service';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  chartOptions: any;
  role: string;
  username: string;
  date: any;
  chart: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.loadChartData(this.date);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const selectedDate = new Date(input.value);
      const today = new Date();
      if (selectedDate <= today) {
        this.date = input.value;
        this.loadChartData(this.date);
      } else {
        this.swal.warning_1();
      }
    }
  }

  loadChartData(date: string): void {
    this.userservice.getDashboardSubscribtionBarChartDetails(this.role, this.username, date).subscribe((data: any) => {
      this.updateChartData(data);
    });
  }

  updateChartData(data: any): void {
    const dataPoints = [];
    // for (const date in data) {
    //   if (data.hasOwnProperty(date)) {
    //     dataPoints.push({ x: new Date(date), y: data[date], label: date });
    //   }
    // }
	for (const date in data) {
		if (data.hasOwnProperty(date)) {
		  // Set color based on the value
		  let color;
		  const count = data[date];
		  if (count > 0) {
			color = "#3bada6"; // Green for counts greater than 0
		  } else {
			color = "#d1ae2e"; // Yellow for counts equal to 0
		  }
	
		  dataPoints.push({ x: new Date(date), y: count, label: date, color: color });
		}
	  }
    const chart = new CanvasJS.Chart("barchartContainer", {
      title: {
        text: "NEXT 7 DAYS SUBSCRIPTION EXPIRED COUNT",
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
        dataPoints: dataPoints,
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "inside",
        width: 30, 
        color: (dataPoints:any) => {
          if (dataPoints.y > 0) {
            return "#3bada6";
          }
          return "#d1ae2e"; 
        }
      }]
    });

    chart.render();  
  }
}
