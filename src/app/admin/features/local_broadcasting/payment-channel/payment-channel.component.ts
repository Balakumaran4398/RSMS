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
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector:[10,20,50],
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
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,filter:false
    },
    {
      headerName: 'CHANNEL NAME',      cellStyle: { textAlign: 'left', }, 
      field: 'channelname',

    },
    {
      headerName: 'SERVICE ID',
      field: 'serviceid', width: 130,

    },
    {
      headerName: 'LTB',
      field: 'operatorname', width: 150,

    },
    {
      headerName: 'LTB BALANCE',
      field: 'balance', width: 150,
      // valueFormatter: (params) => {
      //   return `₹ ${params.value}`;
      // }
    },
    {
      headerName: 'LCN',
      field: 'lcn', width: 100,

    },
    {
      headerName: 'CHANNEL RATE',
      field: 'channelrate', width: 150,

    },
    {
      headerName: 'TAX',
      field: 'tax', width: 100,

    },
    {
      headerName: 'SELLING PRICE',
      field: 'lcoprice', width: 140,

    },
    {
      headerName: 'PAY',
      field: '', width: 120,
      cellRenderer: (params: any) => {
        const isActive = params.data.statusdisplay === 'Active';
        const payButton = document.createElement('button');
        payButton.innerHTML = '<img src="/assets/images/icons/Pay2.png" style="width:70px">';
        payButton.style.backgroundColor = 'transparent';
        payButton.style.color = 'rgb(2 85 13)';
        payButton.style.border = 'none';
        payButton.style.cursor = 'pointer';
        payButton.style.marginRight = '6px';
        payButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });
        if (!isActive) {
          payButton.disabled = true;
          payButton.style.opacity = '0.5';
          payButton.title = 'Cannot pay, status is Deactive';

        } else {
          payButton.addEventListener('click', () => {
            this.openEditDialog(params.data);
          });
          payButton.title = 'Pay Now, status is Active';

        }
        const div = document.createElement('div');
        div.appendChild(payButton);
        return div;
      }
    },
    {
      headerName: 'EXPIRY DATE',
      field: 'expirydate', width: 200,

    },
    {
      headerName: 'IS ACTIVE	',
      field: 'statusdisplay', width: 120,
      cellRenderer: (params: any) => {
        const isActive = params.data.statusdisplay === "Active";
        const toggleButton = document.createElement('button');
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.fontSize = '22px';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';
        toggleButton.style.marginTop = '10px';
        const icon = document.createElement('i');
        icon.className = 'fa';
        toggleButton.appendChild(icon);
        const updateButtonStyle = (Active: boolean) => {
          if (Active) {
            icon.className = 'fa-solid fa-toggle-on';
            toggleButton.style.color = 'rgb(3 87 6)';
            toggleButton.style.fontSize = '24px';
            icon.style.fontSize = '24px';
          } else {
            icon.className = 'fa-solid fa-toggle-off';
            toggleButton.style.color = 'rgb(248 16 77)';
            toggleButton.style.fontSize = '24px';
            icon.style.fontSize = '24px';
          }
        };

        updateButtonStyle(isActive);
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.appendChild(toggleButton);
        return div;
      },
    },
    {
      headerName: 'EDIT', width: 150,
      cellRenderer: (params: any) => {
        const payButton = document.createElement('button');
        payButton.innerHTML = ' <img src="/assets/images/icons/EditLTP.png" style="width:70px">';
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
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
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
