import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { LoginrefundComponent } from '../loginrefund/loginrefund.component';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent {

  role: any;
  username: any;
  isenablesmartcard = true;
  remarks: any;
  amount: any;
  id: any;
  Operatorname: any;
  Referenceid: any;
  refuntlist: any;
  operatorid: any;

  submitted: boolean = false;
  dataid: any;
  userid: any;
  accessip: any;
  lconame: any;
  lcoamount: any;
  constructor(public dialogRef: MatDialogRef<RefundComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    console.log(this.data);
    this.amount = data?.data.amount;
    this.lcoamount = data?.data.amount;
    this.lconame = data?.data.operatorname;
    // this.remarks = data.transactionremarks1;
    this.id = data?.data.id;
    this.dataid = data?.id;
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    this.refuntlist = data?.data;

    this.operatorid = data?.data.operatorid,
      this.isenablesmartcard = data.smartcard
    console.log(this.operatorid);
  }



  toggleedit() {
    this.dialogRef.close({ success: true });
  }
  // onKeydown(event: KeyboardEvent) {
  //   const key = event.key;
  //   if (!/^\d$/.test(key) && key !== 'Backspace') {
  //     event.preventDefault();
  //   }
  // }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (!/^\d$/.test(key) && key !== '.' && !allowedKeys.includes(key)) {
      event.preventDefault();
    }

    // Optional: Prevent more than one decimal point
    const input = event.target as HTMLInputElement;
    if (key === '.' && input.value.includes('.')) {
      event.preventDefault();
    }
  }


  onSubmit() {
    this.submitted = true;
    if (!this.amount || !this.remarks) {
      return;
    }

    const dialogRef = this.dialog.open(LoginrefundComponent, {
      // width: '500px',
      // panelClass: 'custom-dialog-container',
      data: '1'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        console.log('dsfsdfdsfdsfdsf', result);
        this.swal.Loading();
        this.userservice
          .getRefund(this.role, this.username, this.id, this.amount, this.remarks, this.operatorid, this.isenablesmartcard)
          .subscribe(
            (res: any) => {
              Swal.fire({
                title: 'Success!',
                text: res.message || 'Recharge has been added successfully.',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                willClose: () => {
                  window.location.reload();
                }
              });
              const data = ` Operator Name: ${this.lconame}, ` + ` Amount: ${this.amount},` + ` Remarks: ${this.remarks},`;
              const remark = ` Operator Name: ${this.lconame}, ` + ` Amount: ${this.lcoamount},` + ` Remarks: ${this.remarks},`;
              this.logCreate('Refund Button Clicked', remark, data);
            },
            (error: any) => {
              console.error(error);
              Swal.fire({
                title: 'Error!',
                text: error?.error.message || error?.error.refundamount.remarks || 'There was an issue adding the Recharge.',
                icon: 'error'
              });
            }
          );
      } else {
        console.log('Dialog closed without success');
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}
