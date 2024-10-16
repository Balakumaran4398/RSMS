import { Component } from '@angular/core';
import { AllocatedInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/allocated-inventory/allocated-inventory.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { AddLtbComponent } from '../../channel_setting/_Dialogue/local+broadcasting/add-ltb/add-ltb.component';
import { SwalService } from 'src/app/_core/service/swal.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { BaseService } from 'src/app/_core/service/base.service';

@Component({
  selector: 'app-local-payment',
  templateUrl: './local-payment.component.html',
  styleUrls: ['./local-payment.component.scss']
})
export class LocalPaymentComponent {
  gridApi: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 360,  
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  role: any;
  username: any;
  constructor(private dialog: MatDialog, private userservice: BaseService, private swal: SwalService, private storageservice: StorageService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
     
    },
    {
      headerName: 'LTB NAME', width: 360,
      field: 'operatorname',

    },
    {
      headerName: 'BALANCE', width: 300,
      field: 'balance',
      valueFormatter: (params) => {
        return ` ${params.value}`;
      },

    },
    {
      headerName: 'MOBILE NO', width: 400,
      field: 'contactnumber1',

    },
    {
      headerName: 'ADDRESS', width: 400,
      field: 'address',
    },

  ]
  rowData: any[] = [];
  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
    this.userservice.getAllLocalChannelBroadcasterList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }
  submit(data: any): void {
    const dialogRef = this.dialog.open(AddLtbComponent, {
      width: '500px',
      // height: '500px',
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
