import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { ColDef } from 'ag-grid-community';
import { SmartcardInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/smartcard-inventory/smartcard-inventory.component';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-smartcard-allocation',
  templateUrl: './smartcard-allocation.component.html',
  styleUrls: ['./smartcard-allocation.component.scss']
})
export class SmartcardAllocationComponent {
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  role: any;


  public rowSelection: any = "multiple";
  rowData: any[] = [];
  // gridOptions = {
  //   defaultColDef: {
  //     sortable: true,
  //     resizable: true,
  //     filter: true,
  //     floatingFilter: true,
  //     comparator: (valueA: any, valueB: any) => {
  //       const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
  //       const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
  //       if (normalizedA < normalizedB) return -1;
  //       if (normalizedA > normalizedB) return 1;
  //       return 0;
  //     },
  //   },
  //   paginationPageSize: 10,
  //   pagination: true,
  // }

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector:[10,20,50],
    pagination: true,
  };

  constructor(public dialog: MatDialog, private userService: BaseService, storageService: StorageService, private renderer: Renderer2, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.getDeallocate_smartcard_List(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
    })
  }
  columnDefs: ColDef[] = [
    {
      lockPosition: true, headerCheckboxSelection: true, valueGetter: 'node.rowIndex+1', checkboxSelection: true, width: 80, filter: false
    },
    {
      headerName: 'SMARTCARD', width: 250,
      field: 'smartcard',

    },
    {
      headerName: 'BOX_ID', width: 200,
      field: 'boxid',

    },
    {
      headerName: 'CARTON BOX', width: 210,
      field: 'cottonbox',

    },
    {
      headerName: 'CAS ', width: 100,
      field: 'casname',

    },
    {
      headerName: 'IS_ALLOCATED', width: 150,
      field: 'isactive', cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'DE_ALLOCATED', width: 150, cellStyle: { textAlign: 'center' },
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
      headerName: 'IS_DEFECTIVE', width: 150,
      field: 'isdefective', cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'LCO_NAME', width: 250,
      field: 'operatorname',

    },
    // {
    //   headerName: "Delete", width: 150,
    //   editable: true, cellStyle: { textAlign: 'center' },
    //   cellRenderer: (params: any) => {
    //     const deleteButton = document.createElement('button');
    //     // deleteButton.innerHTML = '<img src="/assets/images/icons/delete1.png" style="width:25px">';
    //     deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    //     deleteButton.style.backgroundColor = 'transparent';
    //     deleteButton.style.color = 'rgb(2 85 13)';
    //     deleteButton.style.fontSize = '35px';
    //     deleteButton.style.border = 'none';
    //     this.renderer.setAttribute(deleteButton, 'matTooltip', 'Delete'); // Angular Material tooltip
    //     this.renderer.setAttribute(deleteButton, 'matTooltipPosition', 'above'); // Tooltip position
    //     deleteButton.style.cursor = 'pointer';
    //     deleteButton.style.marginRight = '6px';
    //     deleteButton.addEventListener('click', () => {
    //       this.openEditDialog(params.data);
    //     });
    //     const div = document.createElement('div');
    //     div.appendChild(deleteButton);
    //     return div;
    //   }
    // }
  ]

  // onSelectionChanged() {
  //   if (this.gridApi) {
  //     let selectedRows: any[] = [];
  //     this.gridApi.forEachNodeAfterFilter((rowNode: any) => {
  //       if (rowNode.isSelected()) {
  //         selectedRows.push(rowNode.data);
  //       }
  //     });
  //     if (selectedRows.length === 0) {
  //       this.gridApi.deselectAll();
  //     }
  //     this.isAnyRowSelected = selectedRows.length > 0;
  //     this.selectedIds = selectedRows.map((e: any) => e.id);
  //     this.selectedtypes = selectedRows.map((e: any) => e.isactive);
  //   }
  // }

  selectedIdsSet = new Set<number>();
  onSelectionChanged(event: any) {
    if (this.gridApi) {
      let selectedRows: any[] = [];
      this.gridApi.forEachNodeAfterFilter((rowNode: any) => {
        if (rowNode.isSelected()) {
          selectedRows.push(rowNode.data);
          this.selectedIdsSet.add(rowNode.data.id);
        }
      });
      console.log("Filtered & Selected Rows:", selectedRows);
      if (selectedRows.length === 0) {
        this.gridApi.deselectAll();
        this.selectedIdsSet.clear();
      }
      console.log("Final Selected Rows:", selectedRows);
      this.updateSelectedRows(selectedRows);
    }
  }


  updateSelectedRows(selectedRows: any[]) {
    this.isAnyRowSelected = selectedRows.length > 0;
    // this.selectedIds = selectedRows.map((e: any) => e.id);
    this.selectedIds = Array.from(this.selectedIdsSet);
    this.selectedtypes = selectedRows.map((e: any) => e.isactive);
  }






  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  openEditDialog(data: any): void {
    console.log(data);
    const dialogRef = this.dialog.open(SmartcardInventoryComponent, {
      width: '400px',
      // height: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  showDisabledMessage(): void {
    if (!this.isAnyRowSelected) {
      // Display an information message if no row is selected
      Swal.fire({
        icon: 'info',
        title: 'Action Disabled',
        text: 'Please select at least one row before attempting to deallocate.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } else {
      // If a row is selected, proceed with the deallocation
      this.swal.Loading();
      this.userService.DeAllocate_Smartcard(this.role, this.username, this.selectedIds)
        .subscribe((res: any) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Deallocation Successful',
            text: res.message || 'Smartcards have been successfully deallocated.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            // Reload the page after the alert is closed
            window.location.reload();
          });

        }, (error) => {
          // Handle HTTP errors or server issues
          console.log(error);

          Swal.fire({


            icon: 'error',
            title: 'Deallocation Error',
            text: error?.error?.message || error || 'A server error occurred. Please try again later.',
            timer: 3000, timerProgressBar: true,
            showConfirmButton: true
          });
          console.error('Error:', error);
        });
    }
  }

  generateExcel() {
    this.userService.getDeallocatedSmartcardReport(this.role, this.username, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `Smartcard Deallocation Report.xlsx`.toUpperCase();

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the Excel for Deallocation report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });

  }

  generatePDF() {
    this.userService.getDeallocatedSmartcardReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `Smartcard Deallocation Report.pdf`.toUpperCase();

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the Pdf for Deallocation report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });



  }

}
