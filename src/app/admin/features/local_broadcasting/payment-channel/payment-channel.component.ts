import { Component } from '@angular/core';
import { AllocatedInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/allocated-inventory/allocated-inventory.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { PaymentUpdateComponent } from '../../channel_setting/_Dialogue/local+broadcasting/payment-update/payment-update.component';
import { UpdateLtbComponent } from '../../channel_setting/_Dialogue/local+broadcasting/update-ltb/update-ltb.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { CreateltbComponent } from '../../channel_setting/_Dialogue/local+broadcasting/createltb/createltb.component';

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
  role: any;
  username: any;
  constructor(private dialog: MatDialog, private userservice: BaseService, private swal: SwalService, private storageservice: StorageService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', 
    },
    {
      headerName: 'CHANNEL NAME',
      field: 'channelname',

    },
    {
      headerName: 'SERVICE ID',
      field: 'serviceid',

    },
    {
      headerName: 'LTB',
      field: 'operatorname',

    },
    {
      headerName: 'LTB BALANCE',
      field: 'balance',
      valueFormatter: (params) => {
        return `₹ ${params.value}`;
      }
    },
    {
      headerName: 'LCN',
      field: 'lcn',

    },
    {
      headerName: 'CHANNEL RATE',
      field: 'channelrate',

    },
    {
      headerName: 'TAX',
      field: 'tax',

    },
    {
      headerName: 'SELLING PRICE',
      field: 'lcoprice',

    },
    {
      headerName: 'PAY',
      field: '',
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
      field: 'expirydate',

    },
    {
      headerName: 'IS ACTIVE	',
      field: 'statusdisplay',
      cellRenderer: (params: { value: any; }) => {
        const color = params.value ? 'red' : 'Green';
        const text = params.value ? 'Deactive' : 'Active';
        return `<span style="color: ${color}">${text}</span>`;
      }
    },
    {
      headerName: '',
   
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
  rowData: any[] = [];
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.userservice.getAllLocalChannelList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
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
      width: '500px',
      // height: '500px',
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  submit(data: any): void {
    const dialogRef = this.dialog.open(CreateltbComponent, {
      width: '500px',
      // height: '500px',
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
