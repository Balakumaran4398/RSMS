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
  Totalamount: any;
  gridOptions = {
    defaultColDef: {

    },
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
          data: [
            {
              type: "column",
              name: "Base Package",
              legendText: "Base Package",
              // showInLegend: true,
              dataPoints: this.transformDataToDataPoints(Data?.baselist, "#2fd6c8")
            },
            {
              type: "column",
              name: "Addon Package",
              legendText: "Addon Package",
              // showInLegend: true,
              dataPoints: this.transformDataToDataPoints(Data?.addonlist, "#3c8680")
            },
            {
              type: "column",
              name: "Alacarte Package",
              legendText: "Alacarte Package",
              // showInLegend: true,
              dataPoints: this.transformDataToDataPoints(Data?.alacartelist, "#1b5849")
            }
          ]
        };
      });
  }

  transformDataToDataPoints(data: any, color: string): any[] {
    // if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    //   console.warn('Data is not valid for transformation:', data);
    //   return [];
    // }
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      console.warn('Data is not valid for transformation:', data);
      return [];
    }

    // return Object.keys(data).map(month => ({
    //   label: month,
    //   y: data[month] || 0,
    //   color: color
    // }));
    return monthOrder.map(month => ({
      label: month,
      y: data[month],  // Ensure missing months have a value of 0
      color: color
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
          // .then((result) => {
          //   if (result.isConfirmed) {
          //     window.location.reload();
          //   }
          // });

        } else {
          this.Totalamount = data.totalamount;
          const monthColors: { [key: string]: string } = {
            "January": "#103f2f",
            "February": "#1b5849",
            "March": "#4aa199",
            "April": "#58bfb6",
            "May": "#48d9cc",
            "June": "#1d6e59",
            "July": "#297f99",
            "August": "#185c70",
            "September": "#2384a1",
            "October": "#3fafd1",
            "November": "#012d3b",
            "December": "#8ba7b0"
          };
          const dataPoints = data['rechargelist'].map((item: any) => ({
            name: item.monthname,
            y: item.amount,
            color: monthColors[item.monthname] || "#000000"
          }));

          this.chartOptions = {

            data: [{
              type: "pie",
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
    {
      headerName: 'AREA NAME', width: 170,
      field: 'name',
      // editable: true,
      // cellRenderer: (params: any) => {

      //   const isEditing = this.editingRow && this.editingRow.id === params.data.id;

      //   if (isEditing) {
      //     return `<input type="text" maxLength="6" value="${params.data.name}" style="width:100%;height:50px"/>`;
      //   }
      //   return params.value;
      // }
    },
    {
      headerName: 'PINCODE ', field: 'pincode', width: 150,
      // editable: true,
      // cellRenderer: (params: any) => {
      //   const isEditing = this.editingRow && this.editingRow.id === params.data.id;

      //   if (isEditing) {
      //     return `<input type="text" maxLength="6" value="${params.data.pincode}" style="width:100%;height:50px"/>`;
      //   }
      //   return params.value;
      // }
    },
    {
      headerName: 'ACTIVE STATUS', field: 'statusdisplay', width: 170,
      // editable: true,
      cellRenderer: (params: { value: any; data: any }) => {
        const isEditing = this.editingRow && this.editingRow.id === params.data.id;
        const color = params.value ? 'red' : 'Green';
        const text = params.value ? 'Deactive' : 'Active';
        if (isEditing) {
          return `
            <select>
              <option value="Active" ${!params.value ? 'selected' : ''}>Active</option>
              <option value="Deactive" ${params.value ? 'selected' : ''}>Deactive</option>
            </select>`;
        }
        return `<span style="color: ${color}">${text}</span>`;
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
      // cellRenderer: (params: any) => {
      //   const editButton = document.createElement('button');
      //   const isEditing = this.editingRow && this.editingRow.id === params.data.id;
      //   console.log(isEditing);

      //   editButton.innerHTML = isEditing ? '<i class="fa-solid fa-check"></i>' : '<img src="/assets/images/icons/editstreet2.png" style="width:30px">';
      //   editButton.style.backgroundColor = 'transparent';
      //   editButton.style.border = 'none';
      //   editButton.style.cursor = 'pointer';
      //   editButton.addEventListener('click', () => {
      //     // if (isEditing) {
      //     //   this.saveRow(params.data);
      //     //   console.log(params.data);
      //     // } else {
      //     //   this.editingRow = { ...params.data };
      //     //   this.gridApi.refreshCells();
      //     // }
      //     editButton.addEventListener('click', () => {
      //       this.editarea(params.data);
      //     });
      //   });
      //   // editButton.addEventListener('click', () => {
      //   //   this.newArea(params.data);
      //   // });

      //   const closeButton = document.createElement('button');
      //   if (isEditing) {
      //     closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      //     closeButton.style.marginLeft = '10px';
      //     closeButton.style.cursor = 'pointer';
      //     closeButton.style.backgroundColor = 'transparent';
      //     closeButton.style.border = 'none';
      //     // closeButton.addEventListener('click', () => {
      //     //   this.saveRow(params.data);
      //     // });
      //     closeButton.addEventListener('click', () => {
      //       this.editingRow = null;
      //       this.gridApi.refreshCells();
      //     });
      //   }

      //   const div = document.createElement('div');
      //   div.appendChild(editButton);
      //   if (isEditing) {
      //     div.appendChild(closeButton);
      //   }
      //   return div;
      // }
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
    // Correct selection of inputs using rowData.id for unique identification
    // const updatedAreaName = (document.querySelector(`input[name="name-${rowData.id}"]`) as HTMLInputElement)?.value;
    // const updatedPincode = (document.querySelector(`input[name="pincode-${rowData.id}"]`) as HTMLInputElement)?.value;
    // const updatedStatus = (document.querySelector(`select[name="statusdisplay-${rowData.id}"]`) as HTMLSelectElement)?.value;

    // rowData.name = updatedAreaName || rowData.name;
    // rowData.pincode = updatedPincode || rowData.pincode;
    // rowData.statusdisplay = updatedStatus === 'Active' ? true : false;

    // this.gridApi.applyTransaction({ update: [rowData] });
    // this.editingRow = null;
    // this.gridApi.refreshCells();

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
      width: '500px',
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
