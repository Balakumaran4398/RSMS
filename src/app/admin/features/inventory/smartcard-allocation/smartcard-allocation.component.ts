import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { ColDef } from 'ag-grid-community';
import { SmartcardInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/smartcard-inventory/smartcard-inventory.component';
import Swal from 'sweetalert2';

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
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 167,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  constructor(public dialog: MatDialog, private userService: BaseService, storageService: StorageService, private renderer: Renderer2) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.getDeallocate_smartcard_List(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
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
      headerName: 'CAS ',
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
    {
      headerName: 'LCO_NAME',
      field: 'operatorname',

    },
    {
      headerName: "Delete",
      editable: true,
      cellRenderer: (params: any) => {
        const deleteButton = document.createElement('button');
        // deleteButton.innerHTML = '<img src="/assets/images/icons/delete1.png" style="width:25px">';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.style.backgroundColor = 'transparent';
        deleteButton.style.color = 'rgb(2 85 13)';
        deleteButton.style.fontSize = '35px';
        deleteButton.style.border = 'none';
        this.renderer.setAttribute(deleteButton, 'matTooltip', 'Delete'); // Angular Material tooltip
        this.renderer.setAttribute(deleteButton, 'matTooltipPosition', 'above'); // Tooltip position
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.marginRight = '6px';
        deleteButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(deleteButton);
        return div;
      }
    }
  ]

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
          Swal.fire({
            icon: 'error',
            title: 'Deallocation Error',
            text: error?.error?.message || 'A server error occurred. Please try again later.',
            timer: 3000,timerProgressBar: true,
            showConfirmButton: true
          });
          console.error('Error:', error);
        });
    }
  }
  

}
