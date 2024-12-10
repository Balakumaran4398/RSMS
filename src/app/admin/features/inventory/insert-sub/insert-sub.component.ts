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
      width: 315,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  filteredOperators: any[] = [];
  selectedOperator: any;



  submitted: boolean = false;
  constructor(private userService: BaseService, private storageService: StorageService, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    // this.rowData=data;
    userService.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      // this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
      this.lco_list = Object.entries(data[0].operatorid).map(([key, value]) => {
        return { name: key, value: value };
      });
      console.log(this.lco_list);
      this.filteredOperators = this.lco_list;
    })
  }
  columnDefs: ColDef[] = [
    {
      lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 80
    },
    {
      headerName: 'SMARTCARD',
      field: 'smartcard', width: 200
    },
    {
      headerName: 'BOX_ID',
      field: 'boxid',width: 300
    },

    {
      headerName: 'CAS',
      field: 'casname',width: 300
    },
    {
      headerName: 'IS_ALLOCATED',width: 300,
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
      headerName: 'IS_DEFECTIVE',width: 300,
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
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
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
