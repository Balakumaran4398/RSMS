import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { ReallocationComponent } from '../../channel_setting/_Dialogue/Inventory/Smartcard_Reallocation/reallocation/reallocation.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smartcard-reallocation',
  templateUrl: './smartcard-reallocation.component.html',
  styleUrls: ['./smartcard-reallocation.component.scss']
})
export class SmartcardReallocationComponent {
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedsmartcard: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  role: any;
  rowData: any[] = [];
  castype: any;
  count: any;
  lco_list: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 250,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.getsmartcardReallocationlist(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data[0].reallocatedsmartcard;
      this.lco_list = data[0].operatorid;
      this.count = data[0].count;
      this.castype = data[0].operatorid;
      console.log(this.rowData);
      console.log(this.lco_list);
      console.log(this.count);
      console.log(this.castype);
    })
  }
  columnDefs: ColDef[] = [
    {
      lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 80
    },
    {
      headerName: 'SMARTCARD',
      field: 'smartcard',

    },
    {
      headerName: 'BOX_ID',
      field: 'boxid',
    },
    {
      headerName: 'CARTON BOX',
      field: 'cottonbox',
    },

    {
      headerName: 'IS_ALLOCATED',
      field: 'isallocated',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'DE_ALLOCATED',
      field: 'deallocated',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'IS_DEFECTIVE',
      field: 'isdefective',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },

    },

  ]

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);

      // Extracting IDs from selected rows
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedsmartcard = selectedRows.map((e: any) => e.smartcard);
      // Extracting 'isactive' from selected rows
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);

      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected smartcards:", this.selectedsmartcard);
      console.log("Selected Types:", this.selectedtypes);
    }
  }
  onGridReady(params: { api: any; }) {

    this.gridApi = params.api;
  }

  showDisabledMessage(): void {
    if (!this.isAnyRowSelected) {
      Swal.fire({
        icon: 'info',
        title: 'Action Disabled',
        text: 'Please select at least one row before attempting to deallocate.',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      const dataToSend = {
        rowData: this.rowData,
        lco_list: this.lco_list,
        id: this.selectedIds,
        smartcard: this.selectedsmartcard,
      };
      const dialogRef = this.dialog.open(ReallocationComponent, {
        width: '450px',
        data: dataToSend
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
}
