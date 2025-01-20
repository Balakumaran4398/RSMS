import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-reference',
  templateUrl: './package-reference.component.html',
  styleUrls: ['./package-reference.component.scss']
})
export class PackageReferenceComponent {
  username: any;
  role: any;
  Castype: any = 0;
  selectedTab: any = '1';
  rowData: any[] = [];
  cas: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  isshow: boolean = true;

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
    rowClassRules: {
      'always-selected': (params: any) => params.data,
    },
    // onFirstDataRendered: (params: { api: { forEachNode: (arg0: (node: any) => void) => void; }; }) => {
    //   this.selectRowsBasedOnUsername(params);
    // },
    paginationPageSize: 10,
    pagination: true,
  }
  rows: any[] = [];

  public rowSelection: any = "multiple";
  agGrid: any;

  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, public userservice: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.rowData = [];
    if (this.gridOptions) {
      let newRowData;
      if (this.selectedTab === '1') {
        newRowData = this.getBasePackageData('1');
      } else if (this.selectedTab === '2') {
        newRowData = this.getAddonPackageData('2');
      } else if (this.selectedTab === '3') {
        newRowData = this.getAlacarteData('3');
      }
      this.gridApi.selectAll();
    }

  }
  getBasePackageData(event: any) {
    this.onSubscriberStatusChange(event)

    return [this.rowData];
  }
  getAddonPackageData(event: any) {
    this.onSubscriberStatusChange(event)
    return [this.rowData];
  }
  getAlacarteData(event: any) {
    this.onSubscriberStatusChange(event)
    return [this.rowData];
  }

  ngAfterViewInit(): void {
    this.loadData(this.selectedTab);
  }
  onSubscriberStatusChange(event: any) {
    this.isshow = false;
    this.userservice.ProductTeference(this.role, this.username, this.Castype, this.selectedTab).subscribe((data: any) => {
      if (this.selectedTab === '1') {
        this.rowData = data.baselist;
      } else if (this.selectedTab === '2') {
        this.rowData = data.addonlist;
      } else if (this.selectedTab === '3') {
        this.rowData = data.alacartelist;
      } else {
        this.rowData = [];
      }

      this.updateColumnDefs(this.selectedTab);
      console.log(this.rowData.length);

      if (this.gridApi) {
        this.gridApi.selectAll();
      }


      // Swal.fire({
      //   title: 'Success!',
      //   text: 'Data loaded successfully.',
      //   icon: 'success',
      //   timer: 2000,  // 2 seconds
      //   timerProgressBar: true,
      //   showConfirmButton: false,
      //   // willClose: () => {
      //   //   window.location.reload();  // Reload the page after the timer ends
      //   // }
      // });
    },
      // (error) => {
      //   // Show error message
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'There was an error loading the data.',
      //     icon: 'error',
      //     confirmButtonText: 'OK'
      //   });
      // }
    )

  }
  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
    console.log('on grid ready calling');

    // this.gridColumnApi = params.columnApi;
  }
  onSelectionChanged(event: any) {

    console.log(event);

    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;

      console.log(this.isAnyRowSelected);

      const selectedNodes = event.api.getSelectedNodes();
      const isHeaderSelected = selectedNodes.length === event.api.getDisplayedRowCount();

      if (isHeaderSelected) {
        console.log('Header checkbox selected');
      }

      // If no rows are selected, select all rows
      if (!this.isAnyRowSelected) {
        this.gridApi.selectAll();
      }

      console.log("Selected Rows:", selectedRows.length);
      this.rows = selectedRows.length > 0 ? selectedRows : this.gridApi.getDisplayedRowAtIndex(0);
      // this.selectedIds = this.rows.map((e: any) => e.id);
      // this.selectedtypes = this.rows.map((e: any) => e.isactive);
    }
  }
  private loadData(tab: any): void {
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
    });
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true,
    },

    { headerName: "CHANNEL NAME", field: '', width: 250 },
    { headerName: "PACKAGE RATE", field: '', width: 200 },
    { headerName: "REFERENCE ID", field: '', width: 200 },
    { headerName: "PRODUCT ID", field: '', width: 200 },

  ]
  private updateColumnDefs(tab: string): void {
    if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },

        { headerName: "CHANNEL NAME", field: 'productname', width: 250, cellStyle: { textAlign: 'left' }, },
        { headerName: "PACKAGE RATE", field: 'packagerate', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: "REFERENCE ID", field: 'orderid', width: 200, cellStyle: { textAlign: 'center' }, },
        {
          headerName: "PRODUCT ID", field: 'casproductid', width: 200, cellStyle: { textAlign: 'center' },
          cellRenderer: (params: any) => {
            const span = document.createElement('span');
            span.innerText = params.value;
            span.style.color = 'blue';
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => {
              const input = document.createElement('input');
              input.type = 'text';
              input.value = params.value;
              input.style.width = '100%';
              input.style.padding = '4px';
              input.style.textAlign = 'center';
              input.style.fontSize = '14px';
              input.style.color = 'red';
              span.replaceWith(input);
              input.focus();
              input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
              });
              input.addEventListener('blur', () => {
                const newValue = input.value;
                params.data.casproductid = newValue;
                span.innerText = newValue;
                span.style.color = 'green';
                input.replaceWith(span);
              });

              input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                  input.blur();
                }
              });
            });

            return span;
          }
        },
      ]
    } else if (tab === '2') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },

        { headerName: "CHANNEL NAME", field: 'productname', width: 250,  cellStyle: { textAlign: 'left' },},
        { headerName: "PACKAGE RATE", field: 'packagerate', width: 200, },
        { headerName: "REFERENCE ID", field: 'orderid', width: 200, },
        {
          headerName: "PRODUCT ID", field: 'casproductid', width: 200,

          cellRenderer: (params: any) => {
            const span = document.createElement('span');
            span.innerText = params.value;
            span.style.color = 'blue';
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => {
              const input = document.createElement('input');
              input.type = 'text';
              input.value = params.value;
              input.style.width = '100%';
              input.style.padding = '4px';
              input.style.textAlign = 'center';
              input.style.fontSize = '14px';
              input.style.color = 'red';
              span.replaceWith(input);
              input.focus();
              input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
              });
              input.addEventListener('blur', () => {
                const newValue = input.value;
                params.data.casproductid = newValue;
                span.innerText = newValue;
                span.style.color = 'green';
                input.replaceWith(span);
              });

              input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                  input.blur();
                }
              });
            });

            return span;
          }

        },
      ]
    } else if (tab === '3') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { headerName: "CHANNEL NAME", field: 'productname', width: 250 , cellStyle: { textAlign: 'left' },},
        { headerName: "PACKAGE RATE", field: 'packagerate', width: 200 },
        { headerName: "REFERENCE ID", field: 'orderid', width: 200 },
        {
          headerName: "PRODUCT ID", field: 'casproductid', width: 200,
          cellRenderer: (params: any) => {
            const span = document.createElement('span');
            span.innerText = params.value;
            span.style.color = 'blue';
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => {
              const input = document.createElement('input');
              input.type = 'text';
              input.value = params.value;
              input.style.width = '100%';
              input.style.padding = '4px';
              input.style.textAlign = 'center';
              input.style.fontSize = '14px';
              input.style.color = 'red';
              span.replaceWith(input);
              input.focus();
              input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
              });
              input.addEventListener('blur', () => {
                const newValue = input.value;
                params.data.casproductid = newValue;
                span.innerText = newValue;
                span.style.color = 'green';
                input.replaceWith(span);
              });

              input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                  input.blur();
                }
              });
            });

            return span;
          }
        },
      ]
    }
  }

  save() {
    let requestBody = {
      castype: this.Castype,
      role: this.role,
      username: this.username,
      type: this.selectedTab
    } as any;
    if (this.rows.length === 0) {
      this.rows = this.gridApi.getDisplayedRowAtIndex(0);
    }
    requestBody['baselist'] = this.rows;
    console.log(requestBody);


    // if (this.selectedTab == 1) {
    //   requestBody['baselist'] = this.rows.map(item => ({
    //     productname: item.productname,
    //     casproductid: item.casproductid,
    //     packagerate: item.packagerate,
    //     orderid: item.orderid
    //   }));
    //   requestBody['baselist'] = this.rows;
    // } else if (this.selectedTab == 2) {
    //   requestBody['baselist'] = this.rows.map(item => ({
    //     productname: item.productname,
    //     casproductid: item.casproductid,
    //     packagerate: item.packagerate,
    //     orderid: item.orderid
    //   }));
    //   requestBody['baselist'] = this.rows
    // } else if (this.selectedTab == 3) {
    //   requestBody['baselist'] = this.rows.map(item => ({
    //     productname: item.productname,
    //     casproductid: item.casproductid,
    //     packagerate: item.packagerate,
    //     orderid: item.orderid
    //   }));
    //   requestBody['baselist'] = this.rows
    // }
    Swal.fire({
      title: 'Updating...',
      // text: 'Please wait while the  is being updated',
      // allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.ProductTeference_SaveAll(requestBody).subscribe(
      (response: any) => {
        console.log('Product ID updated successfully', response);
        Swal.fire({
          title: 'Success!',
          text: response.message || 'Product ID updated successfully.',
          icon: 'success',
          timer: 2000,
          // timerProgressBar: true,
          // showConfirmButton: false
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message || error?.error?.baselist || 'Failed to update Product ID.',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    );
  }

  addnew(type: string): void {
  }

}
