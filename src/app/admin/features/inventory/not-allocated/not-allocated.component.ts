import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { EditInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/edit-inventory/edit-inventory.component';
import { UpdateInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/update-inventory/update-inventory.component';
import { SubInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/sub-inventory/sub-inventory.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-not-allocated',
  templateUrl: './not-allocated.component.html',
  styleUrls: ['./not-allocated.component.scss']
})
export class NotAllocatedComponent {
  // rowData: any[] | null | undefined;
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectsmartcard: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  role: any;

  cas: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      width: 250,
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData: any[] = [];
  lco_list: any;
  caslist: any;
  isemi: any;
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userService.Not_Allocated(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data[0].notallocatedsmartcard;
      this.lco_list = data[0].operatorid;
      this.caslist = data[0].castype;
      this.isemi = data[0].isemi;
    })
  }
  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100,
    },
    {
      headerName: 'SMARTCARD', width: 300,
      field: 'smartcard',
    },
    {
      headerName: 'BOX_ID', width: 250,
      field: 'boxid',
    },
    {
      headerName: 'CARTON BOX', width: 250,
      field: 'cottonbox',

    },
    {
      headerName: 'CAS TYPE', width: 250,
      field: 'casname',
    },
    {
      headerName: 'IS ALLOCATED', width: 300,
      field: 'isallocated',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },

    {
      headerName: "Edit", width: 300,
      editable: true,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(2 85 13)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },


  ]

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectsmartcard = selectedRows.map((e: any) => e.smartcard);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  addnew(data: any): void {
    console.log(data);
    const dataToSend = {
      rowData: this.rowData,
      lco_list: this.lco_list,
      castype: this.caslist,
      smartcard: this.selectsmartcard,
    };
    const dialogRef = this.dialog.open(EditInventoryComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  showDisabledMessage(): void {
    if (!this.isAnyRowSelected) {
      Swal.fire({
        icon: 'info',
        title: 'Action Disabled',
        text: 'Please select atleast one row before attempting to deallocate.',
        timer: 3000,
        showConfirmButton: false
      });
    } else {

      const dataToSend = {
        rowData: this.rowData,
        lco_list: this.lco_list,
        castype: this.caslist,
        smartcard: this.selectsmartcard,
        isemi: this.isemi,
      };
      console.log(dataToSend);

      const dialogRef = this.dialog.open(SubInventoryComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: dataToSend
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }

  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(UpdateInventoryComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
