import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment, { Moment } from 'moment';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-operatorcancelsubreport',
  templateUrl: './operatorcancelsubreport.component.html',
  styleUrls: ['./operatorcancelsubreport.component.scss']
})
export class OperatorcancelsubreportComponent implements OnInit{

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
  id: any;
  type: any;
  operatorname: any;
  lcoid: any;
  constructor(public dialogRef: MatDialogRef<OperatorcancelsubreportComponent>, private swal: SwalService, private userService: BaseService, private storageservice: StorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.OType = data.type;
    this.operatorid = data.operator;
    this.lcoid = data.operator;
    this.operatorname = data.operatorname;
    console.log(data);
    console.log(this.operatorid);
    this.id = data.id;
    this.area = data.name;
    console.log(this.id);
    this.setType(this.OType);
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ngOnInit(): void {
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    console.log(this.fromdate, this.todate);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  setType(OType: string) {
    switch (OType) {
      case 'cancel_Subscription':
        this.type = 10;
        break;
      default:
        this.type = 0;
        break;
    }
  }
  getPDF() {
    console.log(this.operatorid);
    console.log(this.type);
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.type, 1, this.operatorid, 0, this.fromdate, this.todate)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.operatorname + ' - ' + this.OType + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
}
