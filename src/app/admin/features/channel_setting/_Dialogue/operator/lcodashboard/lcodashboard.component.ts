import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_core/service/Data.service';
import { OperatordialogueComponent } from '../operatordialogue/operatordialogue.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { StreetComponent } from '../street/street.component';
import Swal from 'sweetalert2';
import { tuesday } from 'ag-charts-community/dist/types/src/sparklines-util';
import { SwalService } from 'src/app/_core/service/swal.service';
import { EditareaComponent } from '../editarea/editarea.component';

@Component({
  selector: 'app-lcodashboard',
  templateUrl: './lcodashboard.component.html',
  styleUrls: ['./lcodashboard.component.scss']
})
export class LcodashboardComponent implements OnInit {
  operatorDetails: any[] = [];
  operatorid: any;
  dialogData: any;
  operatorname: any;
  mobile: any;
  mailid: any;
  userid: any;
  address: any;
  pincode: any;
  password: any;
  area: any;
  state: any;
  Totalamount: any;
  gridOptions = {
    defaultColDef: {

    },
    paginationPageSize: 5,
    pagination: true,
  }

  editingRow: any;

  role: any;
  username: any;
  package: any = 2;
  packageid: any[] = [
    { basePackage: 2 },
    { addonPackage: 3 },
    { alacartePackage: 4 }
  ];

  rowData: any[] = [];
  barchart: any;
  chartOptions: any = {};
  chartOptions1: any = {};
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];


  isactive: boolean = false;
  Areaname: any;
  Areapincode: any;
  Areaid: any;
  public rowSelection: any = "multiple";
  constructor(private route: ActivatedRoute, private swal: SwalService, private dataService: DataService, public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.operatorid = +params['operatorid'];
      this.dialogData = this.dataService.getDialogData();
      if (this.dialogData) {
        this.operatorname = this.dialogData.detailsList.operatorname;
        this.mobile = this.dialogData.detailsList.contactnumber1;
        this.mailid = this.dialogData.detailsList.mail;
        this.userid = this.dialogData.detailsList.userid;
        this.address = this.dialogData.detailsList.address;
        this.area = this.dialogData.detailsList.area;
        this.state = this.dialogData.detailsList.state;
        this.pincode = this.dialogData.detailsList.pincode;
        this.password = this.dialogData.detailsList.password;
      } else {
        console.log('No dialog data available.');
      }
    });
    this.barChart();
    this.tableData();
    this.onPackageSelect("");
  }
  tableData() {
    this.userservice.getAreaListByOperatorId(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.rowData = data;
      console.log(data);
      this.isactive = data.find((item: any) => item)?.isactive;
      this.Areaname = data.find((item: any) => item)?.name;
      this.Areapincode = data.find((item: any) => item)?.pincode;
      this.Areaid = data.find((item: any) => item)?.id;
    })
  }

  // barChart() {
  //   this.userservice.getPackagewiseRechargeDetailsforBarchart(this.role, this.username, this.operatorid)
  //     .subscribe((Data: any) => {
  //       console.log(Data);
  //       if (!Data || Data.length === 0) {
  //         console.error('No data returned from API');
  //         return;
  //       }
  //       this.chartOptions1 = {
  //         animationEnabled: true,
  //         showInLegend: true,
  //         axisX: {
  //           labelAngle: 0,
  //           title: "Month",
  //           grid: {
  //             display: false
  //           }
  //         },
  //         axisY: {
  //           title: "Recharge Count",
  //           gridThickness: 0,
  //         },
  //         toolTip: {
  //           shared: true
  //         },
  //         legend: {
  //           cursor: "pointer",
  //           itemclick: function (e: any) {
  //             if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
  //               e.dataSeries.visible = false;
  //             } else {
  //               e.dataSeries.visible = true;
  //             }
  //             e.chart.render();
  //           }
  //         },
  //         data: [
  //           {
  //             type: "column",
  //             name: "Base Package",
  //             legendText: "Base Package",
  //             // showInLegend: true,
  //             dataPoints: this.transformDataToDataPoints(Data?.baselist, "#2fd6c8")
  //           },
  //           {
  //             type: "column",
  //             name: "Addon Package",
  //             legendText: "Addon Package",
  //             // showInLegend: true,
  //             dataPoints: this.transformDataToDataPoints(Data?.addonlist, "#3c8680")
  //           },
  //           {
  //             type: "column",
  //             name: "Alacarte Package",
  //             legendText: "Alacarte Package",
  //             // showInLegend: true,
  //             dataPoints: this.transformDataToDataPoints(Data?.alacartelist, "#1b5849")
  //           }
  //         ]
  //       };
  //     });
  // }

  // transformDataToDataPoints(data: any, color: string): any[] {

  //   const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  //   if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
  //     console.warn('Data is not valid for transformation:', data);
  //     return [];
  //   }


  //   return monthOrder.map(month => ({
  //     label: month,
  //     y: data[month],
  //     color: color
  //   }));
  // }


  // barChart() {
  //   this.userservice.getPackagewiseRechargeDetailsforBarchart(this.role, this.username, this.operatorid)
  //     .subscribe((Data: any) => {
  //       console.log(Data);
  //       if (!Data || Data.length === 0) {
  //         console.error('No data returned from API');
  //         return;
  //       }
  //       this.chartOptions1 = {
  //         animationEnabled: true,
  //         showInLegend: true,
  //         axisX: {
  //           labelAngle: 0,
  //           title: "Month",
  //           grid: {
  //             display: false
  //           }
  //         },
  //         axisY: {
  //           title: "Recharge Count",
  //           gridThickness: 0,
  //         },
  //         toolTip: {
  //           shared: true
  //         },
  //         legend: {
  //           cursor: "pointer",
  //           itemclick: function (e: any) {
  //             if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
  //               e.dataSeries.visible = false;
  //             } else {
  //               e.dataSeries.visible = true;
  //             }
  //             e.chart.render();
  //           },
  //           verticalAlign: "top", // Vertically aligns the legend at the top of the chart
  //           horizontalAlign: "left", // Horizontally aligns the legend to the left
  //           itemMaxWidth: 150, // Ensures that the legend items do not overflow
  //         },
  //         data: [
  //           {
  //             type: "column",
  //             name: "Base Package",
  //             legendText: "Base Package",
  //             dataPoints: this.transformDataToDataPoints(Data?.baselist, "#2fd6c8")
  //           },
  //           {
  //             type: "column",
  //             name: "Addon Package",
  //             legendText: "Addon Package",
  //             dataPoints: this.transformDataToDataPoints(Data?.addonlist, "#3c8680")
  //           },
  //           {
  //             type: "column",
  //             name: "Alacarte Package",
  //             legendText: "Alacarte Package",
  //             dataPoints: this.transformDataToDataPoints(Data?.alacartelist, "#1b5849")
  //           }
  //         ]
  //       };
  //     });
  // }

  // transformDataToDataPoints(data: any, color: string): any[] {
  //   const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  //   if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
  //     console.warn('Data is not valid for transformation:', data);
  //     return [];
  //   }

  //   return monthOrder.map(month => ({
  //     label: month,
  //     y: data[month] || 0, // Ensure 0 if data is undefined for that month
  //     color: color,
  //     indexLabel: data[month] !== undefined ? data[month].toString() : "0", // Show "0" if no data for that month
  //     indexLabelPlacement: 'outside', 
  //     indexLabelFontSize: 16, 
  //     indexLabelFontColor: '#000000' 
  //   }));
  // }

  barChart() {
    this.userservice.getPackagewiseRechargeDetailsforBarchart(this.role, this.username, this.operatorid)
      .subscribe((Data: any) => {
        console.log(Data);
        if (!Data || Data.length === 0) {
          console.error('No data returned from API');
          return;
        }
        this.chartOptions1 = {
          animationEnabled: true,
          showInLegend: true,
          axisX: {
            labelAngle: 0,
            title: "Month",
            grid: {
              display: false
            }
          },
          axisY: {
            title: "Recharge Count",
            gridThickness: 0,
          },
          toolTip: {
            shared: true
          },
          // legend: {
          //   cursor: "pointer",
          //   verticalAlign: "top", 
          //   horizontalAlign: "left",
          //   itemMaxWidth: 150, 
          //   fontSize: 14, 
          //   borderColor: "gray", 
          //   borderThickness: 1, 
          //   itemTextFormatter: function (e: any) {
          //     return e.dataSeries.name; 
          //   }
          // },
          data: [
            {
              type: "column",
              name: "Base Package",
              legendText: "Base Package",
              color: "#014a01",
              dataPoints: this.transformDataToDataPoints(Data?.baselist, "#014a01")
            },
            {
              type: "column",
              name: "Addon Package",
              legendText: "Addon Package",
              color: "#388a75",
              dataPoints: this.transformDataToDataPoints(Data?.addonlist, "#388a75")
            },
            {
              type: "column",
              name: "Alacarte Package",
              legendText: "Alacarte Package",
              color: "#359c9c",
              dataPoints: this.transformDataToDataPoints(Data?.alacartelist, "#359c9c")
            }
          ]
        };
      });
  }

  transformDataToDataPoints(data: any, color: string): any[] {
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      console.warn('Data is not valid for transformation:', data);
      return [];
    }

    return monthOrder.map(month => ({
      label: month,
      y: data[month] || 0,
      color: color,
      indexLabel: data[month] !== undefined ? data[month].toString() : "0",
      indexLabelPlacement: 'outside',
      indexLabelFontSize: 12,
      indexLabelFontColor: '#000000'
    }));
  }

  ngOnDestroy() {
    this.dataService.clearDialogData();
  }

  getPackageName(pack: any): string {
    if (pack.basePackage) {
      return 'Base Package';
    } else if (pack.addonPackage) {
      return 'Addon Package';
    } else if (pack.alacartePackage) {
      return 'Alacarte Package';
    }
    return '';
  }
  // getPackageName(packageObj: any): string {
  //   return Object.keys(packageObj)[0];
  // }
  // getPackageId(packageObj: any): number {
  //   return packageObj[Object.keys(packageObj)[0]];
  // }

  onPackageSelect(event: any): void {
    const selectedPackageId = event?.target?.value ?? this.package;
    console.log('Selected Package ID:', selectedPackageId); this.userservice.getPackagewiseRechargeDetailsforPiechart(this.role, this.username, this.package, this.operatorid)
      .subscribe((data: any) => {
        if (!data || !data['rechargelist'] || data['rechargelist'].length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'No Data Available',
            text: data?.message,
            confirmButtonText: 'Reload',
            allowOutsideClick: true
          })
        } else {
          this.Totalamount = data.totalamount;
          const monthColors: { [key: string]: string } = {
            "January": "#103f2f",
            "February": "#464878",
            "March": "#9e5972",
            "April": "#0f94a3",
            "May": "#402033",
            "June": "#377a58",
            "July": "#415e27",
            "August": "#007787",
            "September": "#3c445e",
            "October": "#8c8b8b",
            "November": "#012d3b",
            "December": "#8ba7b0"
          };
          const dataPoints = data['rechargelist'].map((item: any) => ({
            name: item.monthname,
            y: item.amount,
            color: monthColors[item.monthname] || "#000000"
          }));

          this.chartOptions = {
            animationEnabled: true,
            theme: 'light2',
            legend: {
              verticalAlign: 'center',
              horizontalAlign: 'right',
              fontSize: 14,
              fontFamily: 'Arial',
              markerType: 'square',
              right: '10px'
            },
            data: [{
              type: 'pie',
              startAngle: 90,
              cursor: 'pointer',
              explodeOnClick: false,
              showInLegend: true,
              legendMarkerType: 'square',
              indexLabelPlacement: 'inside',
              indexLabelFontColor: 'white',
              dataPoints: dataPoints
            }]
          };

        }

      });
  }


  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80,
    },
    { headerName: 'AREA NAME', width: 170, field: 'name', },
    { headerName: 'PINCODE ', field: 'pincode', width: 150, },
    {
      headerName: 'ACTIVE STATUS', field: 'statusdisplay', width: 170,
      // editable: true,
      cellRenderer: (params: { value: any; data: any }) => {
        const status = params.data?.statusdisplay;
        const color = status === 'Active' ? 'green' : 'red';
        const text = status === 'Active' ? 'Active' : 'Deactive';
        return `<span style="color: ${color}; ">${text}</span>`;
      }

    },
    {
      headerName: 'STREET DETAILS', width: 100,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/assets/images/icons/streetlist2.webp" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Street List';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.street(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    {
      headerName: 'EDIT', width: 80,

      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Street List';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.editarea(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    }
  ];
  validatePincode(pincode: string): boolean {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern.test(pincode);
  }
  saveRow(rowData: any) {
    const requestBody = {
      role: this.role,
      username: this.username,
      name: rowData.name,
      operatorid: this.operatorid,
      pincode: rowData.pincode,
      isactive: rowData.isactive,
      id: this.Areaid
    };

    this.userservice.updateArea(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  newArea(type: any): void {
    let dialogData = { type: type, operatorid: this.operatorid };
    const dialogRef = this.dialog.open(OperatordialogueComponent, {
      width: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  street(data: any): void {
    const dialogRef = this.dialog.open(StreetComponent, {
      width: '600px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  editarea(data: any): void {
    const dialogRef = this.dialog.open(EditareaComponent, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((row: any) => row.packageid);
      this.selectedname = selectedRows.map((row: any) => row.productname);

    }
  }
  updateArea() {
    let requestBody = {
      role: this.role,
      username: this.username,
      name: this.Areaname,
      operatorid: this.operatorid,
      pincode: this.Areapincode,
      isactive: this.isactive,

    } as any;
    this.userservice.updateArea(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}
