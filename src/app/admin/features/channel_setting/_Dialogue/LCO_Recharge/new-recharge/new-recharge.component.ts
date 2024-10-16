import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-recharge',
  templateUrl: './new-recharge.component.html',
  styleUrls: ['./new-recharge.component.scss']
})
export class NewRechargeComponent {
  form!: FormGroup;
  edit_dialog: boolean = false;
  username: any;
  id: any;
  role: any;
  type: number = 2;
  operatorList: any[] = [];
  Date: any[] = [
    { lable: "Cheque", value: 1 },
    { lable: "Cash", value: 2 },
    { lable: "Account Transfer", value: 3 },
  ];
  constructor(public dialogRef: MatDialogRef<NewRechargeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userService.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }
  toggleedit() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.form = this.fb.group({
      paymenttypeid: ['', [Validators.required,]],
      operatorid: ['', [Validators.required, Validators.minLength(6)]],
      amount: ['', Validators.required],
      remarks: ['', Validators.required],
      role: this.role,
      username: this.username
    });
  }



  onSubmit() {
    // if (this.form.valid) {
    console.log(this.form.value);

    this.userService.Newrecharge(this.form.value).subscribe(
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
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
