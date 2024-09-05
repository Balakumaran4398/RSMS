import { Component } from '@angular/core';
import { AllocatedInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/allocated-inventory/allocated-inventory.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { AddLtbComponent } from '../../channel_setting/_Dialogue/local+broadcasting/add-ltb/add-ltb.component';

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
      width: 360,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  constructor(private dialog: MatDialog) {

  }
  columnDefs: ColDef[] = [
    {
      headerName: 'S.NO', width: 100,
      lockPosition: true,
    },
    {
      headerName: 'LTB NAME',
      field: 'broadcastername',

    },
    {
      headerName: 'BALANCE',
      field: 'broadcastername',

    },
    {
      headerName: 'MOBILE NO',
      field: 'broadcastername',

    },
    {
      headerName: 'ADDRESS',
      field: 'broadcastername',

    },

  ]
  rowData = [
    {
      broadcastername: 'Example Value', // this value will be used for all columns
      // add more rows as needed
    },
  ];
  onGridReady(params: { api: any; }) {
    this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
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
