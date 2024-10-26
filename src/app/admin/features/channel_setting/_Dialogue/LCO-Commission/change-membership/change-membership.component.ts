import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-membership',
  templateUrl: './change-membership.component.html',
  styleUrls: ['./change-membership.component.scss']
})
export class ChangeMembershipComponent {
  lcoForm !: FormGroup<any>;
  role: any;
  username: any;
  operatorid: any;
  lcogroupid: any;
  usedcount: any;
  sharecount: any;
  lcomembershipid: any = 0;
  lcomembershipList: any[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  count: any;
  rowData: any[] = [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeMembershipComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService,
    private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.rowData = data;
    this.operatorid = data.map((item: any) => item.operatorid);
    this.lcogroupid = data[0].lcogroupid;
    this.membershiplist();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,

      floatingFilter: true
    },
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    { headerName: "OPERATOR", field: 'operatorname', width: 450 },
  ]
  membershiplist() {
    this.userservice.getLcoGroupMasterListNotInLcogroupId(this.role, this.username, this.lcogroupid).subscribe(
      (data: any) => {
        console.log(data);
        this.lcomembershipList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
      })
  }
  change() {
    let requestBody = {
      role: this.role,
      username: this.username,
      lcogroupid: this.lcomembershipid,
      lcomembershiplist: []
    } as any;
    requestBody.lcomembershiplist = this.rowData.map(item => ({
      operatorname: item.operatorname,
      operatorid: item.operatorid,
      lcogroupupdateddate: item.lcogroupupdateddate,
      lcogroupid: item.lcogroupid,
    }));
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to apply these changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, apply changes!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait while we Change the LCO Membership.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.updateLcoMembership(requestBody)
          // .subscribe((data: any) => {
          //   console.log(data);
          //   Swal.fire({
          //     title: 'Success!',
          //     text: 'Changes have been applied successfully.',
          //     icon: 'success',
          //     timer: 2000,
          //     timerProgressBar: true,
          //     willClose: () => {
          //     }
          //   });
          .subscribe(
            (res: any) => {
              Swal.fire({
                title: 'Success!',
                text: res?.message,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                this.dialogRef.close();
              });
            },
            (err: any) => {
              Swal.fire({
                title: 'Error!',
                text: err?.error?.message,
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                showConfirmButton: false
              });
            }
          );
      }
    });
  }



}
