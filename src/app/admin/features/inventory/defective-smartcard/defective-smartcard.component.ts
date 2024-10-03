import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { ReplaceInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/replace-inventory/replace-inventory.component';
import { DefectiveInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/defective-inventory/defective-inventory.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defective-smartcard',
  templateUrl: './defective-smartcard.component.html',
  styleUrls: ['./defective-smartcard.component.scss']
})
export class DefectiveSmartcardComponent {
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedSmartcards: any[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  role: any;
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
  rowData: any[] = [];
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private renderer: Renderer2) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.Defective_Smartcard_list(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }
  columnDefs: ColDef[] = [
    { lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 80 },
    { headerName: 'SMARTCARD', field: 'smartcard', },
    { headerName: 'BOX_ID', field: 'boxid', },
    { headerName: 'CAS', field: 'casname', },

    { headerName: 'LCO NAME', field: 'operatorname', },

    {
      headerName: 'IS_DEFECTIVE', field: 'isdefective',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: "Action",
      editable: true,
           cellRenderer: (params: any) => {
        if (params.data.isdefective) {
          const replaceButton = document.createElement('button');
          replaceButton.innerHTML = `<i class="fas fa-sync-alt"></i> Replace`;
          replaceButton.style.backgroundColor = '#767e7e';
          replaceButton.style.height = '40px';
          replaceButton.style.top = '10px';
          replaceButton.style.color = 'white';
          replaceButton.style.width = '100px';
          replaceButton.style.borderRadius = '10px';
          replaceButton.style.cursor = 'pointer';
          replaceButton.title = 'Replace';
          replaceButton.addEventListener('mouseenter', () => {
            replaceButton.style.backgroundColor = '#5a6268';
            replaceButton.style.color = 'white';
            replaceButton.style.fontWeight = 'bold';
          });
          replaceButton.addEventListener('mouseleave', () => {
            replaceButton.style.backgroundColor = '#767e7e';
          });
          replaceButton.addEventListener('click', () => {
            this.openEditDialog(params.data);
          });
          const div = document.createElement('div');
          div.appendChild(replaceButton);
          return div;
        } else {
          return '';
        }
      }
    }
  ]
  toggleSelection(smartcard: any, id: any): void {
    const index = this.selectedSmartcards.indexOf(smartcard);
    if (index === -1) {
      this.selectedSmartcards.push(smartcard);
      this.selectedIds.push(id);
    } else {
      this.selectedSmartcards.splice(index, 1);
      this.selectedIds.splice(index, 1);
    }
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectedIds = selectedRows.map((e: any) => e.id);
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
    const dialogRef = this.dialog.open(ReplaceInventoryComponent, {
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
        showConfirmButton: false
      });
    } else {
      const dataToSend = {
        rowData: this.rowData, // Existing data
        selectedIds: this.selectedIds, // Selected IDs
      };
      console.log(dataToSend);
      const dialogRef = this.dialog.open(DefectiveInventoryComponent, {
        width: '400px',
        // height: '500px',
        data: dataToSend

      });
    }
  }
}
