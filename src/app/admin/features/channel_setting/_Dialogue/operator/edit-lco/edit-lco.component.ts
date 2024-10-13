import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-lco',
  templateUrl: './edit-lco.component.html',
  styleUrls: ['./edit-lco.component.scss']
})
export class EditLcoComponent {
  edit_dialog: boolean = false;
  username: any;
  id: any;
  role: any;
  type: number = 0;
  form!: FormGroup;
  gatewayList: any[] = []
  businessList: any[] = [];

  operatorid: any;
  operatorname: any;
  address: any;
  area: any;
  state: any;
  pincode: any;
  contactnumber: any;
  mail: any;
  nameheader: any;
  paymentid: any;
  lcobusinessid: any;
  userid: any;
  password: any;


  constructor(public dialogRef: MatDialogRef<EditLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public userService: BaseService, storageService: StorageService, private fb: FormBuilder) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log('Received operator data:', data);
    this.operatorid = data.operatorid;
    this.operatorname = data.operatorname,
      this.address = data.address,
      this.area = data.area,
      this.state = data.state,
      this.pincode = data.pincode,
      this.contactnumber = data.contactnumber1,
      this.mail = data.mail,
      this.nameheader = data.nameheader,
      this.paymentid = data.paymentid,
      this.lcobusinessid = data.lcobusinessid,
      this.password = data.password,
      this.userid = data.userid

  }
  toggleedit() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.form = this.fb.group({
      operatorid: this.operatorid,
      operatorname: ['', Validators.required],
      address: ['', Validators.required],
      area: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      contactnumber1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mail: ['', [Validators.required, Validators.email]],
      nameheader: ['', Validators.required],
      lcobusinessid: ['', Validators.required],
      userid: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      paymentid: ['', Validators.required],
      role: this.role,
      username: this.username
    });
    this.PaymentGatewayList();
    this.Businesslist();
  }
  onSubmit() {
    this.userService.EditOperator(this.form.value).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res?.message || 'Operator edited successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message || error?.error.lcobusinessid || error?.error.nameheader || 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  PaymentGatewayList() {
    this.userService.getpaymentgatwaylist(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.gatewayList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, value: value };
      });
    })
  }
  Businesslist() {
    this.userService.getLcoBusinesslist(this.role, this.username).subscribe((data: any) => {
      this.businessList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, value: value };
      });
    })
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
