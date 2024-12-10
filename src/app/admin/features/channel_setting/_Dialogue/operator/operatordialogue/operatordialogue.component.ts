import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { default as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
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

@Component({
  selector: 'app-operatordialogue',
  templateUrl: './operatordialogue.component.html',
  styleUrls: ['./operatordialogue.component.scss'], 
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatordialogueComponent implements OnInit {


  
  readonly date = new FormControl(moment());
  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value ?? moment();
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }
  chosenYearHandler(normalizedYear: Moment) {
    // const ctrlValue = this.date.value;
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    // const ctrlValue = this.date.value;
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


  pincode: any;
  areaname: any;
  username: any;
  operatorid: any;
  role: any;
  OType: any;
  area: any;
  id: any
  rowData: any[] = [];



  
  constructor(public dialogRef: MatDialogRef<OperatordialogueComponent>, private swal: SwalService, private userService: BaseService, private storageservice: StorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.OType = data.type;
    this.operatorid = data.operatorid;
    console.log(data);
    this.id = data.id;
    this.area = data.name;
    console.log(this.id);
  }
  ngOnInit(): void {
    this.userService.getAreaDetailsById(this.role, this.username, this.id).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  newArea() {
    if (!this.areaname || this.areaname.trim() === '') {
      this.swal.Error("Area Name is required.");
      return;
    }
    if (!this.validatePincode(this.pincode)) {
      this.swal.Error("Invalid Pincode. Please enter a valid 6-digit number.");
      return;
    }
    let requestBody = {
      role: this.role,
      username: this.username,
      name: this.areaname,
      operatorid: this.operatorid,
      pincode: this.pincode
    }

    this.userService.createArea(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  validatePincode(pincode: string): boolean {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern.test(pincode);
  }


  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

}
