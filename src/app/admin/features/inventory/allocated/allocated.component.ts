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
export class  AllocatedComponent {
  // rowData: any[] | null | undefined;
  gridApi: any;
  public rowSelection: any = "multiple";
  role: any;
  username: any;
  rowData: any[] = [];
  allocatedhistory: any
  smartcard: any;
  caslist: any[] = [];
  cas: any
  selectedLcoName: any = 0;
  submitted: boolean = false;
  // lco_list: { [key: string]: number } = {};
  lco_list: any[] = [];
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
  filteredOperators: any[] = [];
  selectedOperator: any;
  constructor(public dialog: MatDialog, public userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userService.Allocated_smartcard_List(this.role, this.username).subscribe((data: any) => {
      // this.rowData = data[0].allocatedsmartcard;
      console.log(data);

      console.log(this.rowData);
      // this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
      this.lco_list = Object.entries(data[0].operatorid).map(([key, value]) => {
        return { name: key, value: value };
      });
      this.filteredOperators = this.lco_list;
      console.log(this.lco_list);
      this.caslist = data[0].castype;
      console.log(this.caslist);
    })

    this.operatorList();
    this.casList();
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
  casList() {
    this.userService.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log('dfdsfdsfsd', this.cas);
      this.cas = data.map((item: any) => ({
        id: item.id,
        name: item.casname
      }));
      this.caslist = this.cas;
      console.log(this.cas);

    });
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

  // filteredLcoKeys(): string[] {
  //   const keys = Object.keys(this.lco_list);

  //   if (!this.searchTerm) {
  //     return keys;
  //   }

  //   return keys.filter(key =>
  //     key.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
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
  columnDefs: ColDef[] = [
    // {
    //   lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 80
    // },
    {
      headerName: 'SMARTCARD', width: 250,
      field: 'smartcard',

    },
    {
      headerName: 'BOX_ID', width: 200,
      field: 'boxid',

    },
    {
      headerName: 'CARTON BOX', width: 230,
      field: 'cottonbox',

    },
    {
      headerName: 'CAS', width: 150, cellStyle: { textAlign: 'center' },
      field: 'casname',

    },
    {
      headerName: 'IS_ALLOCATED', width: 200,
      field: 'allocationstatus', cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {

        if (params.value === "Allocated") {
          return `<span style="color: #06991a;">${params.value}</span>`;
        } else {
          return `<span style="color: red;">${params.value}</span>`;
        }
      },
    },
    {
      headerName: 'IS_DEFECTIVE', width: 150, cellStyle: { textAlign: 'center' },
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
      headerName: 'IS_EMI', width: 150, cellStyle: { textAlign: 'center' },
      field: 'emidisplay',
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'LCO_NAME', width: 200,
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
    this.submitted = true;
    // if (!this.smartcard || !this.selectedLcoName) {
    //   // Swal.fire({
    //   //   icon: 'warning',
    //   //   title: 'Validation Error',
    //   //   text: 'Please fill out all required fields.',
    //   // });
    //   return;
    // }

    console.log(this.selectedLcoName);
    console.log(this.smartcard);

    // this.swal.Loading();
    // if ((this.smartcard != null && this.smartcard != undefined && this.smartcard > 0) || (this.selectedLcoName != null && this.selectedLcoName != undefined && this.selectedLcoName > 0)) {
      this.userService.getsearchforallocated_smartcard_List(this.role, this.username, this.selectedLcoName || 0, this.smartcard || 0)
        .subscribe((data: any) => {
          this.rowData = data;
          this.allocatedhistory = data;
          Swal.fire({
            icon: 'success',
            title: 'Search Completed',
            text: data.message || 'Search results have been retrieved successfully.',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
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
    // } else {
    //   return;
    // }
  }
  submit(): void {
    const dataToSend = {
      rowData: this.rowData,
      lco_list: this.lco_list,
      castype: this.caslist,
    };
    console.log(dataToSend);

    const dialogRef = this.dialog.open(AllocatedInventoryComponent, {
      width: '450px',
      data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  generateExcel() {
    if ((this.smartcard != null && this.smartcard != undefined && this.smartcard > 0) || (this.selectedLcoName != null && this.selectedLcoName != undefined && this.selectedLcoName > 0)) {
      this.userService.getAllocatedSmartcardReport(this.role, this.username, this.selectedLcoName, this.smartcard || 0, 2)
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/xlsx' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `Smartcard Allocation Report.xlsx`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the Excel for allocation report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
    }
  }

  generatePDF() {
    if ((this.smartcard != null && this.smartcard != undefined && this.smartcard > 0) || (this.selectedLcoName != null && this.selectedLcoName != undefined && this.selectedLcoName > 0)) {
      this.userService.getAllocatedSmartcardReport(this.role, this.username, this.selectedLcoName, this.smartcard || 0, 1)
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `Smartcard Allocation Report.pdf`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the Pdf for allocation report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });

    }

  }
}

