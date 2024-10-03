import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-recharge',
  templateUrl: './bulk-recharge.component.html',
  styleUrls: ['./bulk-recharge.component.scss']
})
export class BulkRechargeComponent {
  form!: FormGroup;
  public rowSelection: any = "multiple";
  edit_dialog: boolean = false;
  username: any;
  role: any;
  id: any;
  type: number = 0;
  amount: any;
  remarks: any;

  rowData: any[] = [];
  selectedIds: number[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 320,
      floatingFilter: true
    },
  }
  columnDefs: any[] = [
    {
      headerName: "OPERATOR ID", field: 'operatorid', headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "OPERATOR NAME", field: 'operatorname', },
    { headerName: "CONTACT NUMBER", field: 'contactnumber1', },
  ]

  constructor(public dialogRef: MatDialogRef<BulkRechargeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public dialog: MatDialog,
    public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userService.OperatorDetails(this.role, this.username, 0).subscribe(
      (data: any) => {
        console.log(data);
        this.rowData = data;
      },
      (error) => {
        console.error('Error fetching operator details', error);
      }
    );
  }
  toggleedit() {
    this.dialogRef.close();
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.operatorid);
    }
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSubmit() {
    this.userService.bulkOperatorRecharge(this.role, this.username, this.selectedIds, this.amount, this.remarks).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Success!',
          text: res.message || 'Bulk Recharge has been added successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            window.location.reload();
            // this.ngOnInit();
          }
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.message || error?.error.lcobusinessid || 'There was an issue adding the Bulk Recharge.',
          icon: 'error'
        });
      }
    );
    // } else {
    //   this.form.markAllAsTouched();
    // }
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
