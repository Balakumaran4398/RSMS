import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { SmartcardInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/smartcard-inventory/smartcard-inventory.component';
import { MatDialog } from '@angular/material/dialog';
import { AllocatedInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/allocated-inventory/allocated-inventory.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-allocated',
  templateUrl: './allocated.component.html',
  styleUrls: ['./allocated.component.scss']
})
export class AllocatedComponent {
  // rowData: any[] | null | undefined;
  gridApi: any;
  public rowSelection: any = "multiple";
  role: any;
  username: any;
  rowData: any;
  smartcard: any;
  caslist: any;
  selectedLcoName: any = 0;
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 195,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  constructor(public dialog: MatDialog, public userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userService.Allocated_smartcard_List(this.role, this.username).subscribe((data: any) => {
      // this.rowData = data[0].allocatedsmartcard;
      console.log(this.rowData);
      this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
      this.caslist = data[0].castype;
      console.log(this.caslist);
    })
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);

      // Extracting IDs from selected rows
      this.selectedIds = selectedRows.map((e: any) => e.id);

      // Extracting 'isactive' from selected rows
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);

      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected Types:", this.selectedtypes);
    }
  }

  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);

    if (!this.searchTerm) {
      return keys;
    }

    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  columnDefs: ColDef[] = [
    // {
    //   lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 80
    // },
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
      headerName: 'CAS',
      field: 'casname',

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
    {
      headerName: 'IS_EMI',
      field: 'isemi',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">True</span>`;
        } else {
          return `<span style="color: red;">False</span>`;
        }
      },
    },
    {
      headerName: 'LCO_NAME',
      field: 'operatorname',

    },
  ]

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  Search() {
    // if (!this.smartcard && !this.selectedLcoName) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Invalid Search',
    //     text: 'Please enter a Smartcard number or select an LCO name to search.',
    //     confirmButtonText: 'OK'
    //   });
    //   return;
    // }
    console.log(this.selectedLcoName);
    this.swal.Loading();
    this.userService.getsearchforallocated_smartcard_List(this.role, this.username, this.selectedLcoName, this.smartcard || null).subscribe((data: any) => {
      this.rowData = data;
      Swal.fire({
        icon: 'success',
        title: 'Search Completed',
        text: data.message || 'Search results have been retrieved successfully.',
        confirmButtonText: 'OK'
      });
      console.log(data);
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.error.message || 'There was an error performing the search. Please try again.',
        confirmButtonText: 'OK'
      });
    });
  }
  submit(): void {
    const dataToSend = {
      rowData: this.rowData,
      lco_list: this.lco_list,
      castype: this.caslist,
    };

    const dialogRef = this.dialog.open(AllocatedInventoryComponent, {
      width: '450px',
      data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
