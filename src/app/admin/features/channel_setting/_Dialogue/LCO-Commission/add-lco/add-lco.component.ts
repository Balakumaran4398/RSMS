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
  rowData: any;

  filteredOperators:any=[];
  selectedOperator:any;
  selectedLcoName:any;

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
  gridOptions: any = {
    defaultany: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 130,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "PRODUCT NAME", field: 'productname',  width: 300,},
    { headerName: "PRODUCT ID", field: 'productid',  width: 250,},
    {
      headerName: "PRODUCT RATE", field: 'rate', width: 220, cellRenderer: (params: any) => `<span style="color: #035203;
      font-weight: bold;;">₹</span> ${params.value}`
    },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 200, },
    {
      headerName: "MSO AMOUNT", field: 'msoamount', width: 200,   },
    {
      headerName: "COMMISSION",
      field: 'commission',
      editable: true,
      cellStyle: (params) => {
        if (params.value) {
          return { color: 'green' };
        } else {
          return { color: 'blue' };
        }
      }
    },

    {
      headerName: "	IS PERCENTAGE", field: 'ispercentage', width: 200,
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
  ]
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lcomembershipList.filter((operator:any) =>
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
      this.filteredOperators = this.lcomembershipList
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
    const successHandler = (response: HttpResponse<any[]>) => {
      if (response.status === 200) {
        this.rowData = response.body;
        console.log(this.rowData);
        // this.swal.Success_200();
      } else if (response.status === 204) {
        this.swal.Success_204();
      }
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
