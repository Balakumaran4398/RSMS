import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { BroadCreateDialogComponent } from '../../channel_setting/_Dialogue/broad-create-dialog/broad-create-dialog.component';
import { OperatorWalletComponent } from '../Dialog/operator-wallet/operator-wallet.component';
declare var AmCharts: any;

@Component({
  selector: 'app-operatordashboard',
  templateUrl: './operatordashboard.component.html',
  styleUrls: ['./operatordashboard.component.scss']
})
export class OperatordashboardComponent implements OnInit {
  role: any;
  username: any;

  activecount: any;
  areachange: any;
  deactivecount: any;
  notallocated: any;
  suspendcount: any;
  totalexpirycount: any;
  totalrechargecount: any;
  tomorrowexpirycount: any;
  yesterdayexpirycount: any;
  yesterdayrechargecount: any;

  operatorDetailsCount: any;
  lcoDeatails: any;

  barchartDetails: any;
  pieDetails: any;


  lcoDeatailsCount: any;
  date: any;
  operatorId: any;
  operatorname: any;
  operatorBalance: any;
  type: any;

  months: any[] = [];
  years: any[] = [];

  selectedMonth: any = 0;
  selectedYear: any = 0;

  walletshare: boolean = false;


  constructor(private router: Router, private userService: BaseService, private storageService: StorageService, public dialog: MatDialog,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    const style = document.createElement("style");
    style.innerHTML = `
      @media (min-width: 992px) {
        .col-lg-1-7 {
          max-width: 14.28%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  ngOnInit(): void {
    this.getOperator()
    // this.onAmCharts();
    this.operatorDetails();
    // this.operataDetailsCount();
    this.date = new Date().toISOString().split('T')[0];
    console.log(this.date);
    // this.getbar('');
    this.generateMonths();
    this.generateYears();
    const currentDate = new Date();
    this.selectedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = currentDate.getFullYear();
  }




  onOnlineRecharge() {
    this.router.navigate(['admin/online_recharge']);
  }

  generateMonths() {
    this.months = [
      { value: '01', name: 'January' },
      { value: '02', name: 'February' },
      { value: '03', name: 'March' },
      { value: '04', name: 'April' },
      { value: '05', name: 'May' },
      { value: '06', name: 'June' },
      { value: '07', name: 'July' },
      { value: '08', name: 'August' },
      { value: '09', name: 'September' },
      { value: '10', name: 'October' },
      { value: '11', name: 'November' },
      { value: '12', name: 'December' }
    ];
  }
  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  addnew(): void {
    let dialogData = {
      id: this.operatorId
    };
    const dialogRef = this.dialog.open(OperatorWalletComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  getOperator() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.operatorBalance = this.lcoDeatails?.balance;
      console.log(this.operatorId);
      this.operataDetailsCount(this.operatorId)
      this.getbar(this.operatorId)

    })
  }
  operatorDetails() {
    this.userService.getOperatorLoginDashboardCount(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorDetailsCount = data;
    })
  }
  operataDetailsCount(operator: any) {
    this.userService.OperatorDetails(this.role, this.username, operator).subscribe(
      (data: any) => {
        this.lcoDeatails = data[0];
        this.walletshare = this.lcoDeatails.walletshare;

        console.log(this.lcoDeatails);
      },
    );
  }
  getbar(operator: any) {
    console.log('bar');
    console.log('months', this.months);
    console.log('years', this.years);
    this.userService.getMonthWiseRechargeBarchart(this.role, this.username, this.selectedMonth, this.selectedYear, this.operatorId).subscribe(
      (data: any) => {
        this.barchartDetails = data;
        this.getPie(this.date);
        interface BarDetail {
          label: keyof typeof labelMappings;
          value: string;
        }
        const labelMappings = {
          "customeramount": { name: "Customer Amount", color: "#45ad9e" },
          "lcoamount": { name: "LCO Amount", color: "#3f91c4" },
          "lcocommission": { name: "LCO Profit", color: "#2ab531" },
          "tax": { name: "LCO Tax", color: "#d62486" },
          "refundamount": { name: "Refund", color: "#4356bf" },
          "rechargeamount": { name: "Recharge", color: "#e3b40b" }
        };

        const dataProvider = (this.barchartDetails as BarDetail[]).map((item) => ({
          country: labelMappings[item.label]?.name || item.label,
          visits: parseFloat(item.value),
          color: labelMappings[item.label]?.color || "#000000"
        }));

        AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "startDuration": 2,
          "dataProvider": dataProvider,
          "valueAxes": [{ "position": "left", "axisAlpha": 0, "gridAlpha": 0 }],
          "graphs": [{
            "balloonText": "[[category]]: <b>[[value]]</b>",
            "colorField": "color",
            "fillAlphas": 0.85,
            "lineAlpha": 0.1,
            "type": "column",
            "topRadius": 1,
            "valueField": "visits",
            "labelText": "[[value]]",
            "labelPosition": "top",
            "fontSize": 14,
            "bold": true,
            "color": "#00000"
          }],
          "depth3D": 40,
          "angle": 30,
          "chartCursor": { "categoryBalloonEnabled": false, "cursorAlpha": 0, "zoomable": false },
          "categoryField": "country",
          "categoryAxis": { "gridPosition": "start", "axisAlpha": 0, "gridAlpha": 0 }
        });
      },
    );
  }
  // getPie(operator: any) {
  //   this.userService.getDatewisePackageRechargePiechart(this.role, this.username, this.date, this.operatorId).subscribe(
  //     (data: any) => {
  //       this.pieDetails = data;
  //       console.log(this.pieDetails);


  //     },
  //   );
  // }

  getPie(operator: any) {
    console.log('pie');
    console.log('months', this.months);
    console.log('years', this.years);
    const labelMappings: Record<string, { name: string; color: string }> = {
      "basecount": { name: "BASE", color: "#027523" },
      "addoncount": { name: "Addon", color: "#048077" },
      "alacartecount": { name: "Alacarte", color: "#022738" }
    };

    this.userService.getMonthWisePackageRechargePiechart(this.role, this.username, this.selectedMonth, this.selectedYear, this.operatorId).subscribe(
      (data: any) => {
        this.pieDetails = data;
        console.log(this.pieDetails);
        const pieData = this.pieDetails.map((item: any) => ({
          category: labelMappings[item.label]?.name || item.label,
          value: parseFloat(item.value),
          color: labelMappings[item.label]?.color || "#000000"
        }));

        AmCharts.makeChart("chartpie", {
          "type": "pie",
          "dataProvider": pieData,
          "valueField": "value",
          "titleField": "category",
          "colorField": "color",
          "balloon": { "fixedPosition": false },
          "innerRadius": "40%",
          "labelText": "[[percents]]%",
          "color": "white",
          "labelRadius": -40,
          "legend": {
            "position": "bottom",
            "align": "center",
            "valueWidth": 30
          }
        });
      }
    );
  }


  onAmCharts() {
    // AmCharts.makeChart("chartdiv", {
    //   "type": "serial",
    //   "startDuration": 2,
    //   "dataProvider": [
    //     { "country": "Customer Amount", "visits": 4025, "color": "#027523" },
    //     { "country": "LCO Profit", "visits": 1882, "color": "#048077" },
    //     { "country": "LCO Amount", "visits": 1192, "color": "#022738" },
    //     { "country": "LCO Tax", "visits": 2010, "color": "#423f69" },
    //     { "country": "Refund", "visits": 2882, "color": "#69101d" },
    //     { "country": "Recharge", "visits": 3882, "color": "#630139" },
    //   ],
    //   "valueAxes": [{ "position": "left", "axisAlpha": 0, "gridAlpha": 0 }],
    //   "graphs": [{
    //     "balloonText": "[[category]]: <b>[[value]]</b>",
    //     "colorField": "color",
    //     "fillAlphas": 0.85,
    //     "lineAlpha": 0.1,
    //     "type": "column",
    //     "topRadius": 1,
    //     "valueField": "visits",
    //     "labelText": "[[value]]",
    //     "labelPosition": "top",
    //     "fontSize": 14,
    //     "bold": true,
    //     "color": "#000000"
    //   }],
    //   "depth3D": 40,
    //   "angle": 30,
    //   "chartCursor": { "categoryBalloonEnabled": false, "cursorAlpha": 0, "zoomable": false },
    //   "categoryField": "country",
    //   "categoryAxis": { "gridPosition": "start", "axisAlpha": 0, "gridAlpha": 0 }
    // });



    // AmCharts.makeChart("chartpie", {
    //   "type": "pie",
    //   "dataProvider": [
    //     { "category": "BASE", "value": 4025, "color": "#027523" },
    //     { "category": "Addon", "value": 1882, "color": "#048077" },
    //     { "category": "Alacarte", "value": 1192, "color": "#022738" }
    //   ],
    //   "valueField": "value",
    //   "titleField": "category",
    //   "colorField": "color",
    //   "balloon": { "fixedPosition": false },

    //   "innerRadius": "40%",

    //   "labelText": "[[percents]]%",
    //   "color": "white",
    //   "labelRadius": -40,

    //   "legend": {
    //     "position": "bottom",
    //     "align": "center",
    //     "valueWidth": 30,
    //   }
    // });
  }

  openLCO_Dialog(event: any) {
    console.log(event); 
    this.router.navigate(['admin/lco_dashboard/' + event]);
  }
  openLCO_dashboard(event: any) {
    console.log(event);
    this.router.navigate(['admin/lco_dashboard_report/' + event]);
  }
  // openLCO_Dialog(event: any) {
  //   console.log(event);
  //   this.router.navigate(['admin/lco_dashboard/' + event]);
  // }
}
