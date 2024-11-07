import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDateFormats } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MY_FORMATS1: MatDateFormats = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-logindialogue',
  templateUrl: './logindialogue.component.html',
  styleUrls: ['./logindialogue.component.scss']
})
export class LogindialogueComponent implements OnInit {
  maxDate = new Date(2040, 11, 31);
  fromdate: any;
  todate: any;
  createForm !: FormGroup;
  role: any;
  roleid: any;
  mail: any;
  date: any;
  username: any;
  type: any;
  roleList: any[] = [];
  userid: any;
  password: any;


  edituserid: any;
  editPassword: any;
  editDate: any;
  editRole: any;
  isactive: boolean;
  editmail: any;
  id: any;
  constructor(public dialogRef: MatDialogRef<LogindialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data.type;
    this.edituserid = data?.data?.username;
    this.editPassword = data?.data?.password;
    this.editRole = data?.data?.rolename;
    this.isactive = data?.data?.isactive;
    this.editmail = data?.data?.email;
    this.id = data?.data?.id;
    console.log('isactive', this.isactive);

  }
  ngOnInit(): void {
    this.userservice.getAllRoles(this.role, this.username).subscribe((data: any) => {
      this.roleList = data.map((item: any) => ({
        id: item.id,
        role: item.name,
      }));
      console.log(this.roleList);
    });
  }

  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }
  onClick(): void {
    this.dialogRef.close();
  }
  onCreate(form: any): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    const requestBody = {
      role: this.role,
      username: this.username,
      uname: this.userid,
      password: this.password,
      roleid: this.roleid,
      email: this.mail,
    };
    console.log(requestBody);

    this.swal.Loading();
    this.userservice.addNewUser(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onupdate(form: any): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    const requestBody = {
      role: this.role,
      username: this.username,
      uname: this.edituserid,
      // password: this.editPassword,
      roleid: this.editRole,
      status: this.isactive,
      // email:this.editmail,
      id: this.id,
    };
    console.log(requestBody);

    this.swal.Loading();
    this.userservice.updateUser(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }


}
