import { Component } from '@angular/core';
import { AllocatedInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/allocated-inventory/allocated-inventory.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { PaymentUpdateComponent } from '../../channel_setting/_Dialogue/local+broadcasting/payment-update/payment-update.component';
import { UpdateLtbComponent } from '../../channel_setting/_Dialogue/local+broadcasting/update-ltb/update-ltb.component';

@Component({
  selector: 'app-payment-channel',
  templateUrl: './payment-channel.component.html',
  styleUrls: ['./payment-channel.component.scss']
})
export class PaymentChannelComponent {
  gridApi: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  constructor(private dialog: MatDialog) {

  }
  columnDefs: ColDef[] = [

    {
      headerName: 'CHANNEL NAME',
      field: 'broadcastername',

    },
    {
      headerName: 'SERVICE ID',
      field: 'broadcastername',

    },
    {
      headerName: 'LTB',
      field: 'broadcastername',

    },
    {
      headerName: 'LTB BALANCE',
      field: 'broadcastername',

    },
    {
      headerName: 'LCN',
      field: 'broadcastername',

    },
    {
      headerName: 'CHANNEL RATE',
      field: 'broadcastername',

    },
    {
      headerName: 'TAX',
      field: 'broadcastername',

    },
    {
      headerName: 'SELLING PRICE',
      field: 'broadcastername',

    },
    {
      headerName: 'PAY',
      field: 'broadcastername',
      cellRenderer: (params: any) => {
        const payButton = document.createElement('button');
        payButton.innerHTML = ' <img src="/assets/images/icons/pay4.png" style="width:45px">';
        payButton.style.backgroundColor = 'transparent';
        payButton.style.color = 'rgb(2 85 13)';
        payButton.style.border = 'none';
        payButton.title = 'Edit the Customer';
        payButton.style.cursor = 'pointer';
        payButton.style.marginRight = '6px';
        payButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(payButton);
        return div;
      }
    },
    {
      headerName: 'EXPIRY DATE',
      field: 'broadcastername',

    },
    {
      headerName: 'IS ACTIVE	',
      field: 'broadcastername',

    },
    {
      headerName: '',
      field: 'broadcastername',
      cellRenderer: (params: any) => {
        const payButton = document.createElement('button');
        payButton.innerHTML = ' <img src="/assets/images/icons/edit2.png" style="width:35px">';
        // payButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
        payButton.style.backgroundColor = 'transparent';
        payButton.style.color = 'rgb(2 85 13)';
        payButton.style.border = 'none';
        payButton.title = 'Edit the Customer';
        payButton.style.cursor = 'pointer';
        payButton.style.marginRight = '6px';
        payButton.addEventListener('click', () => {
          this.openEditDialog1(params.data);
        });

        const div = document.createElement('div');
        div.appendChild(payButton);
        return div;
      }
    },



  ]
  rowData = [
    {
      broadcastername: 'Example Value', // this value will be used for all columns
      // add more rows as needed
    },
  ];
  onGridReady(params: { api: any; }) {

    this.gridApi = params.api;
  }
  openEditDialog(data: any): void {
    console.log(data);
    const dialogRef = this.dialog.open(PaymentUpdateComponent, {
      width: '400px',
      // height: '500px',
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditDialog1(data: any): void {
    console.log(data);
    const dialogRef = this.dialog.open(UpdateLtbComponent, {
      width: '400px',
      // height: '500px',
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  submit(data: any): void {
    const dialogRef = this.dialog.open(AllocatedInventoryComponent, {
      width: '400px',
      // height: '500px',
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
