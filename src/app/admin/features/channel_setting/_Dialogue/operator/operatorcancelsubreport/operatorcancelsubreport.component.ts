import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment, { Moment } from 'moment';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-operatorcancelsubreport',
  templateUrl: './operatorcancelsubreport.component.html',
  styleUrls: ['./operatorcancelsubreport.component.scss']
})
export class OperatorcancelsubreportComponent {

  readonly date = new FormControl(moment());
  maxDate = new Date();
  fromdate: any;
  todate: any;
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
  username: any;
  operatorid: any;
  role: any;
  OType: any;
  area: any;
  id: any
  constructor(public dialogRef: MatDialogRef<OperatorcancelsubreportComponent>, private swal: SwalService, private userService: BaseService, private storageservice: StorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.OType = data.type;
    this.operatorid = data.operatorid;
    console.log(data);
    this.id = data.id;
    this.area = data.name;
    console.log(this.id);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
