import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
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
  operatorname1: any;
  address: any;
  area: any;
  state: any;
  pincode: any;
  contactnumber: any;
  mail: any;
  nameheader: any;
  paymentid: any = 0;
  lcobusinessid: any = 0;
  userid: any;
  password: any;

  userid1: any;
  accessip: any;
  constructor(public dialogRef: MatDialogRef<EditLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private swal: SwalService,
    public userService: BaseService, storageService: StorageService, private fb: FormBuilder) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid1 = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    console.log('Received operator data:', data);
    this.operatorid = data.operatorid;
    this.operatorname = data.operatorname,
      this.operatorname1 = data.operatorname,
      this.address = data.address,
      this.area = data.area,
      this.state = data.state,
      this.pincode = data.pincode,
      this.contactnumber = data.contactnumber1,
      this.mail = data.mail,
      this.nameheader = data.nameheader,
      this.paymentid = data.paymentid,
      // this.lcobusinessid = data.lcobusinessid,
      this.lcobusinessid = data.lcobusinessid || 0;
    this.password = data.password,
      this.userid = data.userid
    this.type = data.type;
    console.log(this.type);


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
      // mail: ['', [Validators.required, Validators.email]],
      mail: ['', [Validators.required, Validators.email, this.customEmailValidator()]],
      nameheader: ['', Validators.required],
      lcobusinessid: ['', Validators.required],
      userid: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      paymentid: ['', Validators.required],
      role: this.role,
      username: this.username
    });
    this.PaymentGatewayList();
    this.Businesslist();
  }
  customEmailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;

      if (email && !emailPattern.test(email)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }



  onSubmit() {
    console.log(this.form.value.operatorname);
    console.log("fjsiefjsdfk=====", this.form);


    if (this.form.invalid && /^[0-9]{10}$/.test(this.form.value.contactnumber1)) {

      this.swal.Loading();
      this.userService.EditOperator(this.form.value).subscribe((res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res?.message || 'Operator edited successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // window.location.reload();
        });
        console.log(this.form.value.operatorid);
      },
        (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message ||
              error?.error?.lcobusinessid ||
              error?.error?.paymentid ||
              error?.error?.userid ||
              error?.error?.pincode ||
              error?.error?.state ||
              error?.error?.operatorname ||
              error?.error?.password ||
              error?.error?.mail ||
              error?.error?.contactnumber1 ||
              error?.error?.area ||
              error?.error?.address ||
              'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
      const data = ` Old Operator Name: ${this.form.value.operatorname}, ` + `  Old Contact: ${this.form.value.contactnumber1}, ` + ` Old Email : ${this.form.value.mail}, ` + ` Old Address : ${this.form.value.address}, ` + ` Old Area:${this.form.value.area}, ` + ` Old State:${this.form.value.state}, ` + ` Old Pincode:${this.form.value.pincode}, ` + ` Old username: ${this.form.value.userid}, ` + ` Old password:${this.form.value.password}, ` + ` Old Business Name:${this.form.value.lcobusinessid}, ` + ` Old Payment Gateway:${this.form.value.paymentid}`;
      const remark = ` New Operator Name: ${this.operatorname1}, ` + ` New Contact: ${this.contactnumber}, ` + ` New Email : ${this.mail}, ` + ` New Address : ${this.address}, ` + ` New Area:${this.area}` + ` New State:${this.state}, ` + ` New Pincode:${this.pincode}, ` + ` New username: ${this.userid}, ` + ` New password:${this.password}, ` + ` New Business Name:${this.lcobusinessid}, ` + ` New Payment Gateway:${this.paymentid}`;
      this.logCreate('LCO Update Button Clicked', remark, data);
    } else {
      this.form.markAllAsTouched();
    }
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

  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid1,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}
