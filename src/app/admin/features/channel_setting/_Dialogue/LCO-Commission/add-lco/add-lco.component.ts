import { HttpResponse } from '@angular/common/http';
import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-lco',
  templateUrl: './add-lco.component.html',
  styleUrls: ['./add-lco.component.scss']
})
export class AddLcoComponent {
  role: any;
  username: any;
  producttype: any = 1;
  lcomembershipList: any[] = [];
  lcogroupid: any = 1;
  // rowData: any;
  rowData: any[] = [];

  filteredOperators: any = [];
  selectedOperator: any;
  selectedLcoName: any;

  isDisCommission: boolean = false;

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];

  type: any;
  constructor(
    public dialogRef: MatDialogRef<AddLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    // userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
    //   this.lcomembershipList = Object.keys(data).map(key => {
    //     const value = data[key];
    //     const name = key;
    //     return { name: name, value: value };
    //   });
    // })

    console.log(data);
    this.type = data.type;
    this.onproducttypechange("");
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public rowSelection: any = "multiple";
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
    paginationPageSize: 10,
    pagination: true,
  }

  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
    { headerName: "PRODUCT ID", field: 'productid', width: 200, },
    {
      headerName: "PRODUCT RATE", field: 'rate', width: 250, cellRenderer: (params: any) => `<span style="color: #035203;
      font-weight: bold;;">₹</span> ${params.value}`
    },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 250, },
    {
      headerName: "MSO AMOUNT",
      field: 'msoamount',
      width: 250,

    },

    {
      headerName: "COMMISSION", width: 240,
      field: 'commission',
      editable: true,

      cellStyle: (params) => {
        if (params.value) {
          return {
            color: 'blue',
            fontWeight: 'bold'
          };
        } else {
          return {
            color: 'blue',
            fontWeight: 'bold'
          };
        }
      },
      tooltipField: 'Edit',
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.style.border = 'none';
        editButton.title = 'Edit the Commision Value';
        editButton.innerText = params.value;
        editButton.style.cursor = 'pointer';
        editButton.style.color = 'blue';
        editButton.addEventListener('click', (event) => {
          console.log('Edit button clicked for Commission:', params.value);
        });

        return editButton;
      },
      onCellValueChanged: (params: any) => {
        if (params.oldValue !== params.newValue) {
          console.log(`Commission Updated: ${params.newValue}`);
          params.data.msoamount = params.newValue;
          this.isDisCommission = true;
          Swal.fire({
            icon: 'info',
            title: 'Please Enter the Updated Value',
            text: 'You have updated the Commission. Ensure the new value is correct.',
            confirmButtonText: 'OK'
          });
        }
      },

    },
  ]
  columnDefs1: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
    { headerName: "PRODUCT ID", field: 'productid', width: 200, },
    {
      headerName: "PRODUCT RATE", field: 'rate', width: 200, cellRenderer: (params: any) => `<span style="color: #035203;
      font-weight: bold;;">₹</span> ${params.value}`
    },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 200, },
    {
      headerName: "MSO AMOUNT",
      field: 'msoamount',
      width: 200,
      editable: true,

      cellStyle: (params) => {
        if (params.value) {
          return {
            color: 'blue',
            fontWeight: 'bold'
          };
        } else {
          return {
            color: 'blue',
            fontWeight: 'bold'
          };
        }
      },
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.style.border = 'none';
        editButton.title = 'Edit MSO Amount';
        editButton.innerText = params.value;
        editButton.style.cursor = 'pointer';
        editButton.style.color = 'blue';
        editButton.addEventListener('click', (event) => {
          console.log('Edit button clicked for MSO Amount:', params.value);
        });

        return editButton;
      },
      onCellValueChanged: (params: any) => {
        if (params.oldValue !== params.newValue) {
          console.log(`MSO Amount Updated: ${params.newValue}`);
          params.data.msoamount = params.newValue;
          this.isDisCommission = true;
          Swal.fire({
            icon: 'info',
            title: 'Please Enter the Updated Value',
            text: 'You have updated the MSO Amount. Ensure the new value is correct.',
            confirmButtonText: 'OK'
          });
        }
      }
    },

    {
      headerName: "COMMISSION VALUE", width: 200,
      field: 'commission',

    },

    {
      headerName: "	IS PERCENTAGE", field: 'ispercentage', width: 180, editable: true, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '8px';

        // Conditional text span
        const textSpan = document.createElement('span');
        textSpan.style.color = params.value === true ? 'green' : 'red';
        textSpan.innerText = params.value === true ? 'YES' : 'NO';
        container.appendChild(textSpan);

        // Edit button
        const editButton = document.createElement('button');
        editButton.style.border = 'none';
        editButton.style.background = 'transparent';
        editButton.style.cursor = 'pointer';
        editButton.style.color = '#007bff';
        editButton.title = 'Edit IsPercentage';
        editButton.addEventListener('click', () => {
          console.log('Edit button clicked for IsPercentage:', params.value);
        });

        container.appendChild(editButton);

        return container;
      }
    },
  ]
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lcomembershipList.filter((operator: any) =>
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


  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((row: any) => row.packageid);
      this.selectedname = selectedRows.map((row: any) => row.productname);
    }
  }
  onproducttypechange(event: any) {
    this.userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        // const name = key;
        const name = key.replace(/\s*\(.*?\)\s*/g, '').trim();
        return { name: name, value: value };
      });
      this.filteredOperators = this.lcomembershipList;
      this.lcogroupid = ''
      this.rowData = [];
      this.lcomembershipList.sort((a: any, b: any) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      });
    })
  }

  // getproductMembershipList(event: any) {
  //   if (this.type === 'commission') {
  //     this.userservice.getproductMembershipList(this.role, this.username, this.producttype, this.lcogroupid).subscribe(
  //       (response: HttpResponse<any[]>) => {
  //         if (response.status === 200) {
  //           this.rowData = response.body;
  //           this.swal.Success_200();
  //         } else if (response.status === 204) {
  //           this.swal.Success_204();
  //         }
  //       },
  //       (error) => {
  //         if (error.status === 400) {
  //           this.swal.Error_400();
  //         } else if (error.status === 500) {
  //           this.swal.Error_500();
  //         } else {
  //           Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
  //         }
  //       }
  //     );
  //   } else if (this.type === 'dis_commission') {
  //     this.userservice.getDistributroProductMembershipList(this.role, this.username, this.producttype, this.lcogroupid).subscribe(
  //       (response: HttpResponse<any[]>) => {
  //         if (response.status === 200) {
  //           this.rowData = response.body;
  //           this.swal.Success_200();
  //         } else if (response.status === 204) {
  //           this.swal.Success_204();
  //         }
  //       },
  //       (error) => {
  //         if (error.status === 400) {
  //           this.swal.Error_400();
  //         } else if (error.status === 500) {
  //           this.swal.Error_500();
  //         } else {
  //           Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
  //         }
  //       }
  //     );
  //   }

  // }
  getproductMembershipList(selectedOperator: any) {
    console.log(this.type);
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    // const successHandler = (response: HttpResponse<any[]>) => {
    const successHandler = (response: any) => {
      // if (response.status === 200) {
      this.rowData = response;
      console.log(this.rowData);
      // this.swal.Success_200();
      // } else if (response.status === 204) {
      // this.swal.Success_204();
      // }
    };
    const errorHandler = (error: any) => {
      const errorStatusHandlers: { [key: number]: () => void } = {
        400: () => this.swal.Error_400(),
        500: () => this.swal.Error_500(),
      };
      (errorStatusHandlers[error.status] || (() => Swal.fire('Error', 'Something went wrong. Please try again.', 'error')))();
    };

    if (this.type === 'commission') {
      this.userservice.getproductMembershipList(this.role, this.username, this.producttype, this.lcogroupid).subscribe(successHandler, errorHandler);

    } else if (this.type === 'dis_commission') {
      this.userservice.getDistributroProductMembershipList(this.role, this.username, this.producttype, this.lcogroupid).subscribe(successHandler, errorHandler);
    }
  }

  createCommission() {
    let requestBody = {
      role: this.role,
      username: this.username,
      producttype: this.producttype,
      lcogroupid: this.lcogroupid,
      lcocommissionlist: this.rows

    } as any;

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we update the product information.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.addProductMembership(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }


  createDisCommission() {
    let requestBody = {
      role: this.role,
      username: this.username,
      producttype: this.producttype,
      lcogroupid: this.lcogroupid,
      lcocommissionlist: this.rows

    } as any;

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we update the product information.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.addDistributorProductMembership(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}
