import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-editarea',
  templateUrl: './editarea.component.html',
  styleUrls: ['./editarea.component.scss']
})
export class EditareaComponent implements OnInit {

  pincode: any;
  areaname: any;
  isdelete = false;
  username: any;
  operatorid: any;
  role: any;
  OType: any;
  area: any;
  id: any
  rowData: any[] = [];
  editarea: any;
  constructor(public dialogRef: MatDialogRef<EditareaComponent>, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.editarea = data;
    this.id = data.id;
    this.areaname = data.name;
    this.pincode = data.pincode;
    this.isdelete=data.isdelete;
    this.operatorid=data.operatorid;
    console.log(data);
    console.log(this.isdelete);

  }
  ngOnInit(): void {
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
  editArea() {
    const requestBody = {
      role: this.role,
      username: this.username,
      name: this.areaname,
      operatorid: this.operatorid,
      pincode: this.pincode,
      isdelete: this.isdelete,
      id: this.id
    };
    this.swal.Loading();
    this.userservice.updateArea(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}
