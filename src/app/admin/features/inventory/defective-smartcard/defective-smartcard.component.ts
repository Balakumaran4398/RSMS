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
  
  rowData: any[] = [];
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private renderer: Renderer2) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.Defective_Smartcard_list(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }
  columnDefs: ColDef[] = [
    {headerName: 'S.NO', lockPosition: true, headerCheckboxSelection: true,valueGetter: 'node.rowIndex+1', checkboxSelection: true, width: 100,filter:false },
    { headerName: 'SMARTCARD', field: 'smartcard', width: 250 },
    { headerName: 'BOX_ID', field: 'boxid', width: 200 },
    { headerName: 'CAS', field: 'casname', width: 200, cellStyle: { textAlign: 'center' }, },

    { headerName: 'LCO NAME', field: 'operatorname', width: 200 },

    {
      headerName: 'IS_DEFECTIVE', field: 'defectivedisplay', cellStyle: { textAlign: 'center' },width: 250,
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
      },
    },
    {
      headerName: "Action",width: 220,
      editable: true,filter:false,
      cellRenderer: (params: any) => {
        if (params.data.defectivedisplay === "Yes") {
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
  // onSelectionChanged() {
  //   if (this.gridApi) {
  //     // const selectedRows = this.gridApi.getSelectedRows();
  //     let selectedRows: any[] = [];
  //     this.gridApi.forEachNodeAfterFilter((rowNode: any) => {
  //       if (rowNode.isSelected()) {
  //         selectedRows.push(rowNode.data);
  //       }
  //     });
  //     // console.log("Filtered & Selected Rows:", selectedRows);
  //     if (selectedRows.length === 0) {
  //       this.gridApi.deselectAll();
  //     }
  //     // console.log("Final Selected Rows:", selectedRows);
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
    this.selectedIds = Array.from(this.selectedIdsSet)
    this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    console.log("Updated Selected Rows:", selectedRows);
    console.log("Selected Rows:", this.selectedIds);
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
        rowData: this.rowData, 
        selectedIds: this.selectedIds, 
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
