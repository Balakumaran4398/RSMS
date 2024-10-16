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
  editstreetname: any;
  constructor(public dialogRef: MatDialogRef<NewstreetComponent>, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log(data);
    this.editstreetname = data?.data?.name;
    console.log(this.editstreetname);

    this.type = data.type;
    this.areaid = data?.areaid;
    console.log(this.areaid);
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
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
      areaid: this.data?.data?.areaid,
      id: this.data?.data?.id,
      isactive: this.data?.data?.isactive,
    }
    console.log(requestBody);

    this.userservice.updateStreet(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}
