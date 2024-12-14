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
import Swal from 'sweetalert2';
import { G } from 'node_modules1/@angular/cdk/keycodes';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { HttpResponse } from '@angular/common/http';

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

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
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
    console.log(this.date);

  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    // const ctrlValue = this.date.value;
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.passSelectedDate(ctrlValue);

  }
  passSelectedDate(selectedDate: moment.Moment) {
    console.log('Selected Date:', selectedDate.format('YYYY-MM'));
    // Add your logic to handle the selected date here
    this.monthYear = selectedDate.format('YYYY-MM');
    console.log('MonthYear',this.monthYear);
    
  }
  pincode: any;
  areaname: any;
  username: any;
  operatorid: any;
  operatorname: any;
  role: any;
  OType: any;
  area: any;
  id: any
  rowData: any;
  type: any;
  monthYear: any;
  msodetails: any;

  constructor(public dialogRef: MatDialogRef<OperatordialogueComponent>, private swal: SwalService, private userService: BaseService, private excelService: ExcelService, private storageservice: StorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.OType = data.type;
    this.operatorid = data.operator;
    this.operatorname = data.operatorname;
    console.log(data);
    console.log('operatorid', this.operatorid);
    console.log('operatorname', this.operatorname);
    this.id = data.id;
    this.area = data.name;
    console.log(this.id);
    this.setType(this.OType);
    console.log(this.type);
  }
  ngOnInit(): void {
    this.userService.getAreaDetailsById(this.role, this.username, this.id).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
  }
  setType(OType: string) {
    switch (OType) {
      case 'connection':
        this.type = 1;
        break;
      case 'notexpiry':
        this.type = 2;
        break;
      case 'expired':
        this.type = 3;
        break;
      case 'new':
        this.type = 4;
        break;
      case 'block':
        this.type = 5;
        break;
      case 'box in hand':
        this.type = 6;
        break;
      case 'total box':
        this.type = 7;
        break;
      default:
        this.type = 0;
        break;
    }
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
  // getExcel() {   
  //   this.userService.getOperatorDashboardExcelReport(this.role,this.username,  this.type, 2, this.operatorid)
  //     .subscribe(
  //       (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
  //         console.log(this.type);
  //         if (response.status === 200) {
  //           this.rowData = response.body;
  //           console.log(this.type);
  //           if (this.type == 1 || this.type == 4) {
  //             console.log(this.type);
  //             const areatitle = 'A1:K2';
  //             const areasub = 'A3:K3';
  //             const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
  //             console.log(title);

  //             const sub = 'MSO ADDRESS:' + this.msodetails;
  //             const header = ['CUSTOMER ID', 'SUBSCRIBER NAME', 'SUBSCRIBER LAST NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE STATUS', 'ACTIVATION DATE', 'EXPIRY DATE'];
  //             const data = this.rowData;
  //             const datas: Array<any> = [];
  //             data.forEach((d: any) => {
  //               const row = [d.subid, d.customername, d.customernamelast, d.address, d.areaname, d.mobileno, d.smartcard, d.boxid,d.statusdisplay, d.activationdate, d.expirydate];
  //               console.log('type 1 and 2', row);
  //               datas.push(row);
  //             });
  //             // this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);
  //           } else if (this.type == 2 || this.type == 3 || this.type == 6) {
  //             console.log(this.type);
  //             const areatitle = 'A1:G2';
  //             const areasub = 'A3:G3';
  //             const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
  //             console.log(title);
  //             const sub = 'MSO ADDRESS:' + this.msodetails;
  //             const header = ['CUSTOMER ID', 'SUBSCRIBER NAME', 'SUBSCRIBER LAST NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'PACKAGE STATUS', 'EXPIRY DATE'];
  //             const data = this.rowData;
  //             const datas: Array<any> = [];
  //             data.forEach((d: any) => {
  //               const row = [d.subid, d.customername, d.customernamelast, d.address,  d.mobileno, d.smartcard, d.boxid,d.d.statusdisplay,  d.expirydate];
  //               console.log('type 3', row);
  //               datas.push(row);
  //             });
  //             // this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);
  //           } else if (this.type == 4 || this.type == 5) {
  //             const areatitle = 'A1:J2';
  //             const areasub = 'A3:J3';
  //             const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
  //             console.log(title);
  //             const sub = 'MSO ADDRESS:' + this.msodetails;
  //             const header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
  //             const data = this.rowData;
  //             const datas: Array<any> = [];
  //             data.forEach((d: any) => {
  //               const row = [d.subid,d.operatorname, d.customername, d.smartcard, d.boxid,d.casname,d.statusdisplay,  d.expirydate];
  //               console.log('type 4 and 5', row);
  //               datas.push(row);
  //             });
  //             // this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);
  //           } else if (this.type == 6) {
  //             const areatitle = 'A1:J2';
  //             const areasub = 'A3:J3';
  //             const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
  //             console.log(title);
  //             const sub = 'MSO ADDRESS:' + this.msodetails;
  //             const header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'MOBILE NUMBER', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PACKAGE', 'BLOCKED DATE', 'EXPIRY DATE'];
  //             const data = this.rowData;
  //             const datas: Array<any> = [];
  //             data.forEach((d: any) => {
  //               const row = [d.subid, d.operatorname, d.customername, d.mobileno, d.smartcard, d.boxid, d.casname, d.productname, d.blockeddate, d.expirydate];
  //               console.log('type 6', row);
  //               datas.push(row);
  //             });
  //             // this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);
  //           }
  //         } else if (response.status === 204) {
  //           this.swal.Success_204();
  //           this.rowData = [];
  //         }
  //       },
  //       (error) => {
  //         this.handleApiError(error);
  //       }
  //     );
  // }


  getExcel() {
    this.userService.getOperatorDashboardExcelReport(this.role, this.username, this.type, 2, this.operatorid, 0, 0, 0, 0)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            if (this.type == 1 || this.type == 4) {
              areatitle = 'A1:K2';
              areasub = 'A3:K3';
              header = ['CUSTOMER ID', 'SUBSCRIBER NAME', 'SUBSCRIBER LAST NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE STATUS', 'ACTIVATION DATE', 'EXPIRY DATE'];

              this.rowData.forEach((d: any) => {
                const row = [d.subid, d.customername, d.customernamelast, d.address, d.areaname, d.mobileno, d.smartcard, d.boxid, d.statusdisplay, d.activationdate, d.expirydate];
                console.log('type 1 and 4', row);
                datas.push(row);
              });

            } else if (this.type == 2 || this.type == 3 || this.type == 6) {
              areatitle = 'A1:I2';
              areasub = 'A3:I3';
              header = ['CUSTOMER ID', 'SUBSCRIBER NAME', 'SUBSCRIBER LAST NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE STATUS', 'EXPIRY DATE'];

              this.rowData.forEach((d: any) => {
                const row = [d.subid, d.customername, d.customernamelast, d.address, d.mobileno, d.smartcard, d.boxid, d.statusdisplay, d.expirydate];
                console.log('type 2, 3, and 6', row);
                datas.push(row);
              });

            } else if (this.type == 4 || this.type == 5) {
              areatitle = 'A1:J2';
              areasub = 'A3:J3';
              header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];

              this.rowData.forEach((d: any) => {
                const row = [d.subid, d.operatorname, d.customername, d.smartcard, d.boxid, d.casname, d.productname, d.productid, d.creationdate, d.expirydate];
                console.log('type 4 and 5', row);
                datas.push(row);
              });
            }

            // Uncomment below to generate the Excel report after integrating the Excel service
            this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);

          } else if (response.status === 204) {
            this.swal.Success_204();
            this.rowData = [];
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }

  getPDF() {
    console.log(this.operatorid);
    console.log(this.type);
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.type, 1, this.operatorid, 0, 0, 0, 0)
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

  getRechargePDF() {
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, 8, 1, this.operatorid, this.monthYear, 0, 0, 0)
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
  handleApiError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }
}
