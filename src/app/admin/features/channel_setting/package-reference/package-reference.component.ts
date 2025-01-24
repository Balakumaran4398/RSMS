import { Component } from '@angular/core';
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
    // rowClassRules: {
    //   'always-selected': (params: any) => params.data,
    // },

    paginationPageSize: 10,
    pagination: true,
  }
  rows: any[] = [];

  // public rowSelection: any = "multiple";
  agGrid: any;

  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService) {
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
    },
    )

  }
  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
    console.log('on grid ready calling');

    // this.gridColumnApi = params.columnApi;
    this.gridApi.forEachNode((node: any) => node.setSelected(true));

  }
  onSelectionChanged(event: any) {
    console.log(event);
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      // this.isAnyRowSelected = selectedRows.length > 0;
      console.log(this.isAnyRowSelected);
      const selectedNodes = event.api.getSelectedNodes();
      const isHeaderSelected = selectedNodes.length === event.api.getDisplayedRowCount();
      if (isHeaderSelected) {
        console.log('Header checkbox selected');
      }
      if (this.isAnyRowSelected) {
        this.gridApi.selectAll();
      }
      console.log("Selected Rows:", selectedRows.length);
      this.rows = selectedRows.length > 0 ? selectedRows : this.gridApi.getDisplayedRowAtIndex(0);
    }
  }

  // onSelectionChanged(event: any) {
  //   if (this.gridApi) {
  //     const selectedRows = this.gridApi.getSelectedRows();
  //     const displayedRows = this.gridApi.getDisplayedRowCount();
  
  //     const selectedNodes = event.api.getSelectedNodes();
  //     const isHeaderSelected = selectedNodes.length === displayedRows;
  
  
  //     if (isHeaderSelected || selectedRows.length === 0) {
  //       // Select all rows programmatically if header is selected or no rows are selected
  //       this.gridApi.selectAll();
  //     }
  
  //     console.log("Selected Rows:", selectedRows);
  //     this.rows = this.gridApi.getSelectedRows(); // Ensure all rows are captured
  //   }
  // }
  

  // onHeaderCheckboxClick() {
  //   const allRowsSelected = this.gridApi.getSelectedNodes().length === this.rowData.length;
  //   this.gridApi.forEachNode((node: any) => node.setSelected(!allRowsSelected));
  // }
  private loadData(tab: any): void {
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
    });
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true,width: 100
    },

    { headerName: "CHANNEL NAME", field: '', width: 300 },
    { headerName: "PACKAGE RATE", field: '', width: 290 },
    { headerName: "REFERENCE ID", field: '', width: 250 },
    { headerName: "PRODUCT ID", field: '', width: 250 },

  ]
  private updateColumnDefs(tab: string): void {
    if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true, width: 100,
        },

        { headerName: "CHANNEL NAME", field: 'productname', width: 300, cellStyle: { textAlign: 'left' }, },
        { headerName: "PACKAGE RATE", field: 'packagerate', width: 290, cellStyle: { textAlign: 'center' }, },
        { headerName: "REFERENCE ID", field: 'orderid', width: 250, cellStyle: { textAlign: 'center' }, },
        {
          headerName: "PRODUCT ID", field: 'casproductid', width: 250, cellStyle: { textAlign: 'center' },
          cellRenderer: (params: any) => {
            const span = document.createElement('span');
            span.innerText = params.value;
            span.style.color = 'blue';
            span.style.cursor = 'pointer';
            span.title = 'Edit product id';
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
          checkboxSelection: true, width: 100,
        },

        { headerName: "CHANNEL NAME", field: 'productname', width: 300, cellStyle: { textAlign: 'left' }, },
        { headerName: "PACKAGE RATE", field: 'packagerate', width: 290, },
        { headerName: "REFERENCE ID", field: 'orderid', width: 250, },
        {
          headerName: "PRODUCT ID", field: 'casproductid', width: 250,

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
          checkboxSelection: true, width: 100,
        },
        { headerName: "CHANNEL NAME", field: 'productname', minwidth: 300, cellStyle: { textAlign: 'left' }, },
        { headerName: "PACKAGE RATE", field: 'packagerate', minwidth: 290 },
        { headerName: "REFERENCE ID", field: 'orderid', minwidth: 250 },
        {
          headerName: "PRODUCT ID", field: 'casproductid', minwidth: 250,
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
    this.rows = this.gridApi.getSelectedRows();
    // if (this.rows.length === 0) {
    //   this.rows = this.gridApi.getDisplayedRowAtIndex(0);
    // }
    requestBody['baselist'] = this.rows;
    console.log(requestBody);


    Swal.fire({
      title: 'Updating...',
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
