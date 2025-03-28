import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { SublcooperatordialogueComponent } from '../sublcooperatordialogue/sublcooperatordialogue.component';
import { AddednotaddedComponent } from '../addednotadded/addednotadded.component';
import { DistributordiscountComponent } from '../../../operator_Login/Dialog/distributordiscount/distributordiscount.component';

@Component({
  selector: 'app-sublcooperator',
  templateUrl: './sublcooperator.component.html',
  styleUrls: ['./sublcooperator.component.scss']
})
export class SublcooperatorComponent implements OnInit {
  role: any;
  username: any;
  operatorid: any;
  isCustomerMode: boolean = true;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
    headerComponentParams: { textAlign: 'center' },
    pagination: true,
    paginationPageSize: 10,
    autoHeight: true,
  }
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectednames: any[] = [];
  hasSelectedRows: boolean = true;
  rowData: any[] = [];
  public rowSelection: any = "multiple";
  constructor(private route: ActivatedRoute, public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    // console.log(route);

    this.route.params.subscribe(params => {
      this.operatorid = +params['operatorid'];
    });
    console.log('operatorid', this.operatorid);
  }
  columnDefs: any[] = [
    { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, filter: false },
    { headerName: "NAME	", field: 'retailerName', filter: true, width: 200, },
    {
      headerName: 'USER ID',
      field: 'username',
      filter: true,
      width: 200,
      cellStyle: { color: 'blue', fontWeight: 'bold' }
    },
    {
      headerName: 'PASSWORD',
      field: 'password',
      filter: true,
      cellStyle: { color: 'green', fontWeight: 'bold' }
    },
    { headerName: 'MOBILE NUMBER', field: 'contactNo', filter: true },
    { headerName: 'BALANCE', field: 'balance', filter: true, width: 200, },
    { headerName: 'ADDRESS', field: 'address', filter: true },
    { headerName: 'ACIVE SUBSCRIPTION', field: 'activecount', filter: true, cellStyle: { textAlign: 'center', }, },
    {
      headerName: 'ACTIONS', filter: true, width: 750,
      cellRenderer: (params: any) => {
        const updateButton = document.createElement('button');
        const areaupdationButton = document.createElement('button');
        const reportButton = document.createElement('button');
        const permmissionButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        const discountButton = document.createElement('button');


        const iswallet = params.data.iswallet === true || params.data.iswallet === 'true';

        if (iswallet) {

          deleteButton.innerHTML = '<i class="fa fa-cog" style="font-size: 1.5em; color: rgb(3, 138, 127);margin-left: 20px ; cursor: pointer;"></i>';
          deleteButton.style.backgroundColor = 'transparent';
          deleteButton.style.border = 'none';
          deleteButton.title = 'Edit Sub LCO';
          deleteButton.style.cursor = 'pointer';
          deleteButton.addEventListener('click', () => {
            const packageId = params.data.packageid;
            this.opendialogue('wallet_recharge', params.data);
          });

          // div.appendChild(deleteButton);
        }
        if (!params.data.isCustomerMode) {
          discountButton.innerHTML = '<i class="fa fa-dollar-sign" style="font-size: 1.5em; color: rgba(236, 7, 217, 0.94); cursor: pointer;margin-left: 20px ;"></i>';
          discountButton.style.backgroundColor = 'transparent';
          discountButton.style.border = 'none';
          discountButton.title = 'Sub lco discount';
          discountButton.style.cursor = 'pointer';

          discountButton.addEventListener('click', () => {
            const packageId = params.data.packageid;
            this.opendialogue('sub_lco_discount', params.data);
          });

          // div.appendChild(discountButton);
        } else {
          discountButton.setAttribute('disabled', 'true');
        }



        updateButton.innerHTML = '<button style="width: 7em;background-color:rgb(113, 121, 76);border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Edit Sub LCO</p></button>';
        updateButton.style.backgroundColor = 'transparent';
        updateButton.style.border = 'none';
        updateButton.title = 'Edit Sub LCO';
        updateButton.style.cursor = 'pointer';
        updateButton.addEventListener('click', () => {
          const packageId = params.data.packageid;
          this.opendialogue('updatesublco', params.data);
        });

        areaupdationButton.innerHTML = '<button style="width: 8em;background-color: #774957;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Area Updation</p></button>';
        areaupdationButton.style.backgroundColor = 'transparent';
        areaupdationButton.style.border = 'none';
        areaupdationButton.title = 'Area Updation';
        areaupdationButton.style.cursor = 'pointer';
        areaupdationButton.style.marginLeft = '20px';
        areaupdationButton.addEventListener('click', () => {
          this.openaddedlogue('areaupdation', params.data);
        });


        reportButton.innerHTML = '<button style="width: 5em;background-color: #956196;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Report</p></button>';
        reportButton.style.backgroundColor = 'transparent';
        reportButton.style.border = 'none';
        reportButton.title = 'Datewise Monthwise Report';
        reportButton.style.cursor = 'pointer';
        reportButton.style.marginLeft = '20px';
        reportButton.addEventListener('click', () => {
          this.opendialogue('reportdation', params.data);
        });


        permmissionButton.innerHTML = '<button style="width: 6em;background-color: #63846f;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Permission</p></button>';
        permmissionButton.style.backgroundColor = 'transparent';
        permmissionButton.style.border = 'none';
        permmissionButton.title = 'Permission';
        permmissionButton.style.cursor = 'pointer';
        permmissionButton.style.marginLeft = '20px';
        permmissionButton.addEventListener('click', () => {
          this.openaddedlogue('permission', params.data);
        });

        const div = document.createElement('div');
        // div.appendChild(deleteButton);
        div.appendChild(updateButton);
        div.appendChild(areaupdationButton);
        div.appendChild(reportButton);
        div.appendChild(permmissionButton);
        div.appendChild(deleteButton);
        div.appendChild(discountButton);
        return div;
      },
    },
    {
      headerName: 'STATUS',
      field: 'isactive',
      width: 200, cellStyle: { textAlign: 'center'},
      cellRenderer: (params: any) => {
        if (params.value) {
          return `<span style="color: green; font-weight: bold;">Active</span>`;
        } else {
          return `<span style="color: red; font-weight: bold;">Deactive</span>`;
        }
      }
    },
  ];
  ngOnInit(): void {
    this.operatorIdoperatorId();
  }
  lcoDeatails: any;
  sublcorecharge: boolean = false;
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;
      this.sublcorecharge = this.lcoDeatails?.sublcorecharge;
    })
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log('selectedRows', selectedRows);

      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.retailerId);
      console.log(this.selectedIds);
    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.userservice.getAllSublcoListByOperatorId(this.role, this.username, this.operatorid).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      this.rowData = this.rowData.map(row => ({
        ...row,
        isCustomerMode: this.isCustomerMode
      }));
    })
  }

  opendialogue(type: any, data: any) {
    let width = '800px';
    if (type === 'createsublco') {
      width = '500px';
    } else if (type === 'deletecasmaster') {
      width = '400px';
    } else if (type === 'editcasmaster') {
      width = '800px';
    } else if (type === 'deletesublco') {
      width = '350px';
    } else if (type === 'updatesublco') {
      width = '800px';
    } else if (type === 'reportdation') {
      width = '1000px';
    } else if (type === 'paymentgateway') {
      width = '500px';
    } else if (type === 'deletesublco') {
      width = '500px';
    } else if (type === 'wallet_recharge') {
      width = '500px';
    } else if (type === 'sub_lco_discount') {
      width = '1800px';
    }
    else if (type === 'sub_lco_recharge') {
      width = '500px';
    }
    console.log('selectedIds', this.selectedIds);
    // data.isCustomerMode = this.isCustomerMode
    let dialogData = { type: type, data: data, id: this.operatorid, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(SublcooperatordialogueComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
      console.log(result);
      console.log('isCustomerMode', result?.data?.isCustomerMode);
      this.rowData = this.rowData.map(row =>
        row.id === result.id ? { ...row, ...result } : row
      );

    });
  }
  openLcoRechargelogue(type: any, data: any) {
    let dialogData = { type: type, data: data };
    console.log(dialogData);
    const dialogRef = this.dialog.open(DistributordiscountComponent, {
      panelClass: 'custom-dialog-container',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openaddedlogue(type: any, data: any) {
    let width = '800px';
    let height = '1000px';
    if (type === 'areaupdation') {
      width = '1000px'
      // height = "1000px"
    } else if (type === 'permission') {
      width = '1000px';
      // height = "1000px"
    }
    let dialogData = { type: type, data: data, id: this.operatorid, selectedid: this.selectedIds };
    const dialogRef = this.dialog.open(AddednotaddedComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
