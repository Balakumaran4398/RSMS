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

  constructor(public dialogRef: MatDialogRef<RefundComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    console.log(this.data);
    this.amount = data?.data.amount;
    // this.remarks = data.transactionremarks1;
    this.id = data?.data.id;
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.refuntlist = data?.data;
    this.operatorid = data?.data.operatorid,
      this.isenablesmartcard = data.smartcard
    console.log(this.operatorid);
  }



  toggleedit() {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  // onSubmit() {
  //   if (!this.remarks) {
  //     Swal.fire({
  //       title: 'Error!',
  //       text: 'Refund remarks cannot be empty.',
  //       icon: 'error'
  //     });
  //     return;
  //   }
  //   this.swal.Loading();
  //   this.userservice.getRefund(this.role, this.username, this.id, this.amount, this.remarks, this.operatorid, this.isenablesmartcard).subscribe(
  //     (res: any) => {

  //       Swal.fire({
  //         title: 'Success!',
  //         text: res.message || 'Recharge has been added successfully.',
  //         icon: 'success',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         willClose: () => {
  //           window.location.reload();
  //         }
  //       });
  //     },
  //     (error: any) => {
  //       console.error(error);
  //       Swal.fire({
  //         title: 'Error!',
  //         text: error?.error.message || error?.error.refundamount.remarks || 'There was an issue adding the Recharge.',
  //         icon: 'error'
  //       });
  //     }
  //   );


  // }

  onSubmit() {
    this.submitted = true;
    if (!this.amount || !this.remarks) {
      return;
    }

    // const dialogRef = this.dialog.open(LoginrefundComponent, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data:'dfsfsd'
    // });

    // dialogRef.afterClosed().subscribe((data) => {
    //   console.log('dfdsfdsfsd', data);

      if (this.data) {
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
    // });
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
