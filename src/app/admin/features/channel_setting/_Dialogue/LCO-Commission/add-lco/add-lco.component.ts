import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
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
  lcogroupid: any = 1;
  rowData: any[] = [];
  lcomembershipList: any[] = [];

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<AddLcoComponent>, private userservice: BaseService, private storageservice: StorageService) {
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
      console.log("Selected Rows:", selectedRows);
      console.log("Selected Rows:", this.rows);
      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected Names:", this.selectedname);
    }
  }
  onproducttypechange(event: any) {
    this.userservice.getproductMembershipList(this.role, this.username, this.producttype, this.lcogroupid).subscribe(
      (data: any) => {
        console.log(data);
        this.rowData = data;
      },
      (error) => {
        console.error('Error fetching lcomembershipid details', error);
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
    // requestBody.lcocommissionlist = this.rowData.map(item => ({
    //   packageid: item.packageid,
    //   productname: item.productname,
    //   rate: item.rate,
    //   productid: item.productid,
    //   customeramount: item.customeramount,
    //   msoamount: item.msoamount,
    //   commission: item.commission,
    //   ispercentage: item.ispercentage,
    //   producttype: item.producttype
    // }));
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we update the product information.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.userservice.addProductMembership(requestBody).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res?.message || 'Product information has been successfully updated.',
          timer: 2000,
          timerProgressBar: true,
        });
        console.log(res);
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: error?.error.message || 'Something went wrong while updating the product information.'
        });
        console.error(error);
      }
    );
  }
}
