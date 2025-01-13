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
      headerName: 'SMARTCARD', width: 250,
      field: 'smartcard',

    },
    {
      headerName: 'BOX_ID', width: 250,
      field: 'boxid',
    },
    {
      headerName: 'CARTON BOX', width: 250, cellStyle: { textAlign: 'center' },
      field: 'cottonbox',
    },

    {
      headerName: 'IS_ALLOCATED',
      field: 'isallocated', width: 200, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'DE_ALLOCATED', width: 200, cellStyle: { textAlign: 'center' },
      field: 'deallocateddisplay',
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
      },
    },
    {
      headerName: 'IS_DEFECTIVE',
      field: 'defectivedisplay', width: 200, cellStyle: { textAlign: 'center' },
      // cellRenderer: (params: any) => {
      //   if (params.value) {
      //     return `<span style="color: #06991a;">YES</span>`;
      //   } else {
      //     return `<span style="color: red;">NO</span>`;
      //   }
      // },
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
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

  generateExcel() {
    this.userService.getReallocatedSmartcardReport(this.role, this.username, 2)
      .subscribe((x: Blob) => {
        console.log(x);

        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `Smartcard AllocReallocationation Report.xlsx`.toUpperCase();
        console.log("came");
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the Excel for Reallocation report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });

  }

  generatePDF() {
    this.userService.getReallocatedSmartcardReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `Smartcard Reallocation Report.pdf`.toUpperCase();

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the Pdf for Reallocation report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });



  }
}
