import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent {

  role: any;
  username: any;
  isenablesmartcard = false;
  remarks: any;
  amount: any;
  id: any;
  Operatorname: any;
  Referenceid: any;
  refuntlist: any;
  operatorid: any = 0;
  constructor(public dialogRef: MatDialogRef<RefundComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    console.log(this.data);
    this.amount = data.amount;
    this.remarks = data.transactionremarks1;
    this.id = data.id;
    console.log(this.amount);
    console.log(this.remarks);
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.refuntlist = data;
    console.log(this.refuntlist);
    console.log(this.data);



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

  onSubmit() {
    // if (this.form.valid) {

    this.swal.Loading();
    this.userservice.getRefund(this.role, this.username, this.id, this.amount, this.remarks, this.operatorid, this.isenablesmartcard).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Success!',
          text: res.message || 'Recharge has been added successfully.',
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
          text: error?.error.message || error?.error.lcobusinessid || 'There was an issue adding the Recharge.',
          icon: 'error'
        });
      }
    );
    // } else {
    //   this.form.markAllAsTouched();
    // }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
