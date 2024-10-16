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
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rows: any[] = [];

  public rowSelection: any = "multiple";
  agGrid: any;

  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.gridOptions) {
      let newRowData;
      if (this.selectedTab === '1') {
        newRowData = this.getBasePackageData('1');
      } else if (this.selectedTab === '2') {
        newRowData = this.getAddonPackageData('2');
      } else if (this.selectedTab === '3') {
        newRowData = this.getAlacarteData('3');
      }
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
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }
  private loadData(tab: any): void {
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
    });
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
    },
    { headerName: "CHANNEL NAME", field: 'productname', },
    { headerName: "PACKAGE RATE", field: 'packagerate', },
    { headerName: "REFERENCE ID", field: 'referenceid', },
    { headerName: "PRODUCT ID", field: 'casproductid' },

  ]
  private updateColumnDefs(tab: string): void {
    if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "CHANNEL NAME", field: 'productname', },
        { headerName: "PACKAGE RATE", field: 'packagerate', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        {
          headerName: "PRODUCT ID", field: 'casproductid',
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
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "CHANNEL NAME", field: 'productname', },
        { headerName: "PACKAGE RATE", field: 'packagerate', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        {
          headerName: "PRODUCT ID", field: 'casproductid',

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
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "CHANNEL NAME", field: 'productname', },
        { headerName: "PACKAGE RATE", field: 'packagerate', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        {
          headerName: "PRODUCT ID", field: 'casproductid',
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

    if (this.selectedTab == 1) {
      requestBody['baselist'] = this.rows.map(item => ({
        productname: item.productname,
        casproductid: item.casproductid,
        packagerate: item.packagerate,
        orderid: item.orderid
      }));
    } else if (this.selectedTab == 2) {
      requestBody['addonlist'] = this.rows.map(item => ({
        productname: item.productname,
        casproductid: item.casproductid,
        packagerate: item.packagerate,
        orderid: item.orderid
      }));
    } else if (this.selectedTab == 3) {
      requestBody['alacartelist'] = this.rows.map(item => ({
        productname: item.productname,
        casproductid: item.casproductid,
        packagerate: item.packagerate,
        orderid: item.orderid
      }));
    }

    this.userservice.ProductTeference_SaveAll(requestBody).subscribe(
      (response: any) => {
        console.log('Product ID updated successfully', response);
        Swal.fire({
          title: 'Success!',
          text: response.message || 'Product ID updated successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error.error.message || 'Failed to update Product ID.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  addnew(type: string): void {
  }

}
