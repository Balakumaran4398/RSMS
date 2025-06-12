import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-newstreet',
  templateUrl: './newstreet.component.html',
  styleUrls: ['./newstreet.component.scss']
})
export class NewstreetComponent {
  username: any;
  operatorid: any;
  role: any;
  streetname: any;
  areaid: any;
  type: any;
  isdelete = false;
  editstreetname: any;
  isdelete1 = false;
  editstreetname1: any;
  Areaname: any;
  userid: any;
  accessip: any;
  constructor(public dialogRef: MatDialogRef<NewstreetComponent>, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log(data);
    this.editstreetname = data?.data?.name;
    this.isdelete = data?.data?.isdelete;
    this.editstreetname1 = data?.data?.name;
    this.isdelete1 = data?.data?.isdelete;
    this.type = data.type;
    this.areaid = data?.areaid;
    console.log(this.isdelete);

    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  newStreet() {
    // if (!this.streetname || this.streetname.trim() === '') {
    //   this.swal.Error("Area Name is required.");
    //   return;
    // }
    let requestBody = {
      role: this.role,
      username: this.username,
      streetname: this.streetname,
      areaid: this.areaid,
    }

    console.log(requestBody);

    this.userservice.createStreet(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  editStreet() {
    let requestBody = {
      role: this.role,
      username: this.username,
      streetname: this.editstreetname,
      isdelete: this.isdelete,
      areaid: this.data?.data?.areaid,
      id: this.data?.data?.id,
    }
    console.log(requestBody);

    this.userservice.updateStreet(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
      const data = ` Street Name: ${this.editstreetname}, ` + ` Status: ${this.isdelete},`;
      const remark = ` Street Name: ${this.editstreetname1}, ` + ` Status: ${this.isdelete1},`;
      this.logCreate('Street Update Button Clicked', remark, data);
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.isdelete);
    });
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
