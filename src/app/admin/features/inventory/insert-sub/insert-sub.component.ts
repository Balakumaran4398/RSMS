import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { InsertSubDialogComponent } from '../../channel_setting/_Dialogue/Inventory/insert_sub/insert-sub-dialog/insert-sub-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert-sub',
  templateUrl: './insert-sub.component.html',
  styleUrls: ['./insert-sub.component.scss']
})
export class InsertSubComponent {
  // rowData: any[] | null | undefined;
  gridApi: any;
  public rowSelection: any = "multiple";
  selectedLcoName: any = 0;
  isLcoSelected: boolean = false;
  // lco_list: { [key: string]: number } = {};
  lco_list: any[] = [];
  searchTerm: string = '';
  username: any;
  role: any;
  rowData: any[] = [];
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;


  selectedLcoKeys: string[] = [];
  operatorid: number[] = [];
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
    pagination: true,
  };

  filteredOperators: any[] = [];
  selectedOperator: any;



  submitted: boolean = false;
  constructor(private userService: BaseService, private storageService: StorageService, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    // this.rowData=data;
    // userService.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
    //   console.log(data);
    //   // this.lco_list = data[0].operatorid;
    //   console.log(this.lco_list);
    //   this.lco_list = Object.entries(data[0].operatorid).map(([key, value]) => {
    //     return { name: key, value: value };
    //   });
    //   console.log(this.lco_list);
    //   this.filteredOperators = this.lco_list;
    // })
    this.operatorList();
  }

  operatorList() {
    this.userService.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.lco_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.lco_list;
    })
  }
  columnDefs: ColDef[] = [
    { headerName: 'S.NO', lockPosition: true, headerCheckboxSelection: true, valueGetter: 'node.rowIndex+1', checkboxSelection: true, width: 100, filter: false },

    {
      headerName: 'SMARTCARD',
      field: 'smartcard', width: 220
    },
    {
      headerName: 'BOX_ID',
      field: 'boxid', width: 300
    },

    {
      headerName: 'CAS', cellStyle: { textAlign: 'center' },
      field: 'casname', width: 200
    },
    {
      headerName: 'IS_ALLOCATED', width: 200,
      field: 'isallocated', cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'IS_DEFECTIVE', width: 300,
      field: 'isdefective', cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
  ]
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }
  Search() {
    console.log(this.selectedLcoName);
    this.submitted = true;
    if (!this.selectedLcoName) {
      return
    }
    this.userService.getOperatorWiseSubscriberList(this.role, this.username, this.selectedLcoName).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }
  // onSelectionChanged() {
  //   if (this.gridApi) {
  //     const selectedRows = this.gridApi.getSelectedRows();
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




  // updateOperatorIds() {
  //   this.operatorid = [];
  //   this.selectedLcoKeys.forEach(key => {
  //     if (this.lco_list[key] !== undefined) {
  //       this.operatorid.push(this.lco_list[key]);
  //     }
  //   });
  // }
  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  checkLcoSelection(): void {
    this.isLcoSelected = this.selectedLcoName !== '0';
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  showDisabledMessage() {
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
        operatorid: this.selectedLcoName,
        id: this.selectedIds
      };
      const dialogRef = this.dialog.open(InsertSubDialogComponent, {
        width: '450px',
        data: dataToSend
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
}
