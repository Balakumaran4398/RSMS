import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { SublcooperatordialogueComponent } from '../sublcooperatordialogue/sublcooperatordialogue.component';
import { AddednotaddedComponent } from '../addednotadded/addednotadded.component';

@Component({
  selector: 'app-sublcooperator',
  templateUrl: './sublcooperator.component.html',
  styleUrls: ['./sublcooperator.component.scss']
})
export class SublcooperatorComponent {
  role: any;
  username: any;
  operatorid: any;

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
    { headerName: 'USER ID', field: 'username', filter: true, width: 200, },
    { headerName: 'MOBILE NUMBER', field: 'contactNo', filter: true },
    { headerName: 'BALANCE', field: 'balance', filter: true, width: 200, },
    { headerName: 'ADDRESS', field: 'address', filter: true },
    { headerName: 'PASSWORD', field: 'password', filter: true },
    { headerName: 'ACIVE SUBSCRIPTION', field: 'activecount', filter: true, cellStyle: { textAlign: 'center', }, },
    {
      headerName: 'ACTIONS', field: '', filter: true, width: 500,
      cellRenderer: (params: any) => {
        // const deleteButton = document.createElement('button');
        const updateButton = document.createElement('button');
        const areaupdationButton = document.createElement('button');
        const reportButton = document.createElement('button');
        const permmissionButton = document.createElement('button');
        // const paymentgateButton = document.createElement('button');


        // deleteButton
        // deleteButton.innerHTML = '<i class="fa-solid fa-rectangle-xmark" style="font-size: x-large;color: #294456;">‌</i>';
        // deleteButton.style.backgroundColor = 'transparent';
        // deleteButton.style.border = 'none';
        // deleteButton.title = 'Edit';
        // deleteButton.style.cursor = 'pointer';
        // deleteButton.style.marginRight = '10px';
        // deleteButton.style.fontSize = "18px";
        // deleteButton.addEventListener('click', () => {
        //   this.opendialogue('deletesublco', params.data);
        // this.openEditDialog(params.data);

        // });

        // updateButton
        // updateButton.innerHTML = '<i class="fa-solid fa-edit" style="font-size: x-large;color: #0f8d18;">‌</i>';
        updateButton.innerHTML = '<button style="width: 7em;background-color: #4c6b79;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Edit Sub LCO</p></button>';
        updateButton.style.backgroundColor = 'transparent';
        updateButton.style.border = 'none';
        updateButton.title = 'Edit Sub LCO';
        updateButton.style.cursor = 'pointer';
        updateButton.addEventListener('click', () => {
          const packageId = params.data.packageid;
          this.opendialogue('updatesublco', params.data);
        });

        // areaupdationButton
        // areaupdationButton.innerHTML = '<i class="fa-solid fa-undo" style="font-size: x-large;color: #363626;">‌</i>';
        areaupdationButton.innerHTML = '<button style="width: 8em;background-color: #774957;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Area Updation</p></button>';
        areaupdationButton.style.backgroundColor = 'transparent';
        areaupdationButton.style.border = 'none';
        areaupdationButton.title = 'Area Updation';
        areaupdationButton.style.cursor = 'pointer';
        areaupdationButton.style.marginLeft = '20px';
        areaupdationButton.addEventListener('click', () => {
          this.openaddedlogue('areaupdation', params.data);
        });

        // View button
        // reportButton.innerHTML = '<i class="fa-solid fa-file-invoice-dollar" style="font-size: x-large;color: #c50534;">‌</i>';
        reportButton.innerHTML = '<button style="width: 5em;background-color: #956196;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Report</p></button>';
        reportButton.style.backgroundColor = 'transparent';
        reportButton.style.border = 'none';
        reportButton.title = 'Datewise Monthwise Report';
        reportButton.style.cursor = 'pointer';
        reportButton.style.marginLeft = '20px';
        reportButton.addEventListener('click', () => {
          this.opendialogue('reportdation', params.data);
        });

        // permmissionButton
        // permmissionButton.innerHTML = '<i class="fa-solid fa-lock" style="font-size: x-large;color: #06561f;">‌</i>';
        permmissionButton.innerHTML = '<button style="width: 6em;background-color: #63846f;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Permission</p></button>';
        permmissionButton.style.backgroundColor = 'transparent';
        permmissionButton.style.border = 'none';
        permmissionButton.title = 'Permission';
        permmissionButton.style.cursor = 'pointer';
        permmissionButton.style.marginLeft = '20px';
        permmissionButton.addEventListener('click', () => {
          this.openaddedlogue('permission', params.data);
        });


        // paymentgateway button
        // paymentgateButton.innerHTML = '<i class="fa-solid fa-repeat" style="font-size: x-large;color: #635292;">‌</i>';
        // paymentgateButton.style.backgroundColor = 'transparent';
        // paymentgateButton.style.border = 'none';
        // paymentgateButton.title = 'View';
        // paymentgateButton.style.cursor = 'pointer';
        // paymentgateButton.style.marginLeft = '20px';
        // paymentgateButton.addEventListener('click', () => {
        //   // this.openCloneDialog(params.data);
        //   this.opendialogue('paymentgateway', params.data);
        // });
        const div = document.createElement('div');
        // div.appendChild(deleteButton);
        div.appendChild(updateButton);
        div.appendChild(areaupdationButton);
        div.appendChild(reportButton);
        div.appendChild(permmissionButton);
        // div.appendChild(paymentgateButton);
        return div;
      },
    },
  ];
  ngOnInit(): void {

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
    }
    console.log('selectedIds', this.selectedIds);

    let dialogData = { type: type, data: data, id: this.operatorid, selectedid: this.selectedIds };
    console.log(dialogData);

    const dialogRef = this.dialog.open(SublcooperatordialogueComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
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
