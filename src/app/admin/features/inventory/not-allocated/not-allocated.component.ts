import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { EditInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/edit-inventory/edit-inventory.component';
import { UpdateInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/update-inventory/update-inventory.component';
import { SubInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/sub-inventory/sub-inventory.component';
import Swal from 'sweetalert2';
import { InventoryloginComponent } from '../../inventory_role/Dialogue/inventorylogin/inventorylogin.component';

@Component({
  selector: 'app-not-allocated',
  templateUrl: './not-allocated.component.html',
  styleUrls: ['./not-allocated.component.scss']
})
export class NotAllocatedComponent implements OnInit {
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectsmartcard: number[] = [];
  selectedtypes: number[] = [];
  // selectedisEmi: boolean = false;
  selectedisEmi: any;
  hasSelectedRows: boolean = true;
  username: any;
  role: any;
  rows: any[] = [];
  cas: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      width: 250,
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
  ngOnInit(): void {

  }


  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      lockPosition: true, headerCheckboxSelection: true, valueGetter: 'node.rowIndex+1',checkboxSelection: true, width: 100,filter:false
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
      headerName: 'IS ALLOCATED', width: 200,
      field: 'isallocated', cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },

    {
      headerName: "Edit", width: 200,
      editable: true, cellStyle: { textAlign: 'center' },
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

  // onSelectionChanged() {
  //   if (this.gridApi) {
  //     // const selectedRows = this.gridApi.getSelectedRows();
  //     const selectedRows =this.gridApi.getRenderedNodes().map((node:any) => node.data);
  //     console.log('SELECTED ROWS',selectedRows);

  //     this.isAnyRowSelected = selectedRows.length > 0;
  //     this.selectedIds = selectedRows.map((e: any) => e.id);
  //     this.selectsmartcard = selectedRows.map((e: any) => e.smartcard);
  //     this.selectedtypes = selectedRows.map((e: any) => e.isactive);
  //     this.selectedisEmi = selectedRows.map((e: any) => e.isemi);
  //   }
  // }

  onSelectionChanged(event: any) {
    if (this.gridApi) {
      let selectedRows: any[] = [];
      this.gridApi.forEachNodeAfterFilter((rowNode: any) => {
        if (rowNode.isSelected()) {
          selectedRows.push(rowNode.data);
        }
      });
      // console.log("Filtered & Selected Rows:", selectedRows);
      if (selectedRows.length === 0) {
        this.gridApi.deselectAll();
      }
      // console.log("Final Selected Rows:", selectedRows);
      this.updateSelectedRows(selectedRows);
    }
  }
  updateSelectedRows(selectedRows: any[]) {
    this.isAnyRowSelected = selectedRows.length > 0;
    this.selectedIds = selectedRows.map((e: any) => e.id);
    this.selectsmartcard = selectedRows.map((e: any) => e.smartcard);
    this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    this.selectedisEmi = selectedRows.map((e: any) => e.isemi);

    // console.log("Updated Selected Rows:", selectedRows);
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

  openLoginPage() {

    const dialogRef = this.dialog.open(InventoryloginComponent, {
      data: { type: 'reception' }
      // width: '500px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.status === 'success') {
        this.addnew('');
      } else {
      }
    });
  }
  addnew(data: any): void {
    console.log(data);
    const dataToSend = {
      rowData: this.rowData,
      lco_list: this.lco_list,
      castype: this.caslist,
      smartcard: this.selectsmartcard,
      type: this.role
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
        // rowData: this.rowData,
        // rowData: this.rows,
        lco_list: this.lco_list,
        castype: this.caslist,
        smartcard: this.selectsmartcard,
        isemi: this.isemi,
        subIsemi: this.selectedisEmi,
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

  getPDF() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    // this.swal.Loading();
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getNotAllocatedReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = ("Not Allocatted report.pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  getExcel() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    // this.swal.Loading();
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getNotAllocatedReport(this.role, this.username, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = ("Not Allocatted report.xlsx").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
}
