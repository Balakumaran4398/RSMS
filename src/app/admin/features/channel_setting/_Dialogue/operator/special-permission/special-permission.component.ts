import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-special-permission',
  templateUrl: './special-permission.component.html',
  styleUrls: ['./special-permission.component.scss']
})
export class SpecialPermissionComponent {

  permission_dialog: boolean = false
  username: any;
  role: any;

  gatewayList: any[] = []
  businessList: any[] = [];

  islabel = false;
  onlinepaymentstatus = false;
  offlinepaymentsublco = false;
  enableforce = false;
  walletshare = false;
  bulk = false;
  recurring = false;
  iscancel = false;
  fullrefund = false;
  isridpay = false;
  plan = false;
  date = false;
  datetodate = false;
  subscriberlock = false;
  isactive = true;
  operatorid: any;

  constructor(public dialogRef: MatDialogRef<SpecialPermissionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public userService: BaseService, storageService: StorageService, private fb: FormBuilder) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log('Received operator data:', data);
    this.operatorid = data.operatorid;
    this.islabel = data.islabel;
    this.onlinepaymentstatus = data.isonlinepayment
    this.offlinepaymentsublco = data.offlinepaymentsublco
    this.enableforce = data.enableforce
    this.walletshare = data.walletshare
    this.bulk = data.bulk
    this.recurring = data.recurring
    this.iscancel = data.iscancel
    this.fullrefund = data.fullrefund
    this.isridpay = data.isridpay
    this.plan = data.plan
    this.date = data.date
    this.datetodate = data.datetodate
    this.subscriberlock = data.subscriberlock
    this.isactive = data.isactive
    console.log(this.isactive);

  }
  ngOninit() {
   
  }
  togglepermission() {
    this.dialogRef.close();
  }
  onSubmit() {
    console.log('111111111');
    let requestbody = {
      operatorid: this.operatorid,
      islabel:this.islabel,
      onlinepaymentstatus:this.onlinepaymentstatus,
      offlinepaymentsublco: this.offlinepaymentsublco,
      enableforce: this.enableforce,
      walletshare:this.walletshare,
      bulk: this.bulk,
      recurring:this.recurring,
      iscancel:  this.iscancel,
      fullrefund:this.fullrefund,
      isridpay: this.isridpay,
      plan: this.plan,
      date: this.date,
      datetodate:this.datetodate,
      subscriberlock: this.subscriberlock,
      isactive: this.isactive,
      role: this.role,
      username: this.username
    }
    this.userService.SetOperatorPermission(requestbody).subscribe((res: any) => {
      console.log(res);
      Swal.fire({
        title: 'Success!',
        text: res?.message || 'Set Operator Permission successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
        // this.ngOninit();
      });
    },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message  || 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}