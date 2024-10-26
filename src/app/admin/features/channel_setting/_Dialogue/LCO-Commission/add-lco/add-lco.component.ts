import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<AddLcoComponent>, private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
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
    }, { headerName: "PRODUCT NAME", field: 'productname', },
    { headerName: "PRODUCT ID", field: 'productid', },
    { headerName: "PRODUCT TYPE", field: 'producttype', },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
    {
      headerName: "MSO AMOUNT", field: 'msoamount',


    },
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
      headerName: "	IS PERCENTAGE", field: 'ispercentage',
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
        const name = key;
        return { name: name, value: value };
      });
    })
  }

  getproductMembershipList(event: any) {
    this.userservice.getproductMembershipList(this.role, this.username, this.producttype, this.lcogroupid).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
        }
      },
      (error) => {
        if (error.status === 400) {
          this.swal.Error_400();
        } else if (error.status === 500) {
          this.swal.Error_500();
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      }
    );
  }
  Create() {
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
}
