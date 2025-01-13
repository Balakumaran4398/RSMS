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
// import { G } from 'node_modules1/@angular/cdk/keycodes';
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
    console.log(ctrlValue);

  }
  getMonthandyear() {
    console.log(this.date);

  }
  passSelectedDate(selectedDate: moment.Moment) {
    console.log('Selected Date:', selectedDate.format('YYYY-MM'));
    this.monthYear = selectedDate.format('YYYY-MM');
    console.log('MonthYear', this.monthYear);
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
  submitted: boolean = false;
  constructor(public dialogRef: MatDialogRef<OperatordialogueComponent>, private swal: SwalService, private userService: BaseService, private excelService: ExcelService, private storageservice: StorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.OType = data.type;
    console.log('datya', data);

    this.operatorid = data.operatorid;
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
    this.userService.getAreaDetailsById(this.role, this.username, this.operatorid).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
    const selectedDate = moment();
    this.passSelectedDate(selectedDate);
  }
  setType(OType: string) {
    switch (OType) {
      case 'total_smartcard_connection':
        this.type = 1;
        break;
      case 'active_smartcard_connection':
        this.type = 2;
        break;
      case 'expired_smartcard_connection':
        this.type = 3;
        break;
      case 'new_smartcard_connection':
        this.type = 4;
        break;
      case 'block_smartcard_connection':
        this.type = 5;
        break;
      case 'box_in_hand':
        this.type = 6;
        break;
      case 'total_smartcard':
        this.type = 7;
        break;
      case 'recharge':
        this.type = 8;
        break;
      case 'lcowise_retailer':
        this.type = 9;
        break;
      case 'cancel_Subscription':
        this.type = 10;
        break;
      case 'productwise_current':
        this.type = 11;
        break;
      case 'areawise':
        this.type = 12;
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
    this.submitted = true;
    // if (!this.areaname || this.areaname.trim() === '') {
    //   this.swal.Error("Area Name is required.");
    //   return;
    // }
    // if (!this.validatePincode(this.pincode)) {
    //   this.swal.Error("Invalid Pincode. Please enter a valid 6-digit number.");
    //   return;
    // }
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
      this.swal.Error(err?.error?.message || err?.error?.operatorid);
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



  getExcel() {
    console.log('dfdfdsf', this.type)
    const generateExcelReport = (areatitle: string, areasub: string, header: string[], datas: any[]) => {
      const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
      const sub = 'MSO ADDRESS:' + this.msodetails;
      this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);
    };
    console.log('type dfdfsf', this.type)
    this.userService.getOperatorDashboardExcelReport(this.role, this.username, this.type, 2, this.operatorid, 0, 0, 0)
      .subscribe((response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          const datas: any[] = [];
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];

          const generateDataRows = (fields: string[], rowData: any[]) => {
            rowData.forEach((d: any, index: number) => {
              const row = fields.map(field => d[field]);
              datas.push([index + 1, ...row]);
            });
          };
          console.log('type dfdfsf', this.type)

          if (this.type === 1) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'ACTIVATION DATE', 'EXPIRY DATE', 'PACKAGE STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'areaname', 'mobileno', 'smartcard', 'boxid', 'activationdate', 'expirydate', 'statusdisplay'], this.rowData);
          } else if (this.type === 2) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'ACTIVATION DATE', 'EXPIRY DATE', 'STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'mobileno', 'smartcard', 'boxid', 'productname', 'activationdate', 'expirydate', 'statusdisplay'], this.rowData);
          } else if (this.type === 3) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'EXPIRY DATE',];
            generateDataRows(['subid', 'customername', 'address', 'mobileno', 'smartcard', 'boxid', 'productname', 'expirydate'], this.rowData);
          } else if (this.type === 4) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'areaname', 'mobileno', 'smartcard', 'boxid', 'statusdisplay'], this.rowData);
          } else if (this.type === 5) {
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
            generateDataRows(['subid', 'operatorname', 'customername', 'smartcard', 'boxid', 'casname', 'productname', 'productid', 'creationdate', 'expirydate'], this.rowData);
          } else if (this.type === 6 || this.type === 7) {
            areatitle = 'A1:E2';
            areasub = 'A3:E3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CAS', 'ALLOCATION DATE'];
            generateDataRows(['smartcard', 'boxid', 'casname', 'connectiondate'], this.rowData);
          }
          else if (this.type === 9) {
            areatitle = 'A1:G2';
            areasub = 'A3:G3';
            header = ['S.NO', 'RETAILER NAME', 'MOBILE', 'AREA', 'RETAILER USERNAME', 'BALANCE', 'STATUS'];
            generateDataRows(['retailername', 'mobileno', 'areaname', 'username', 'balance', 'statusdisplay'], this.rowData);
          } else if (this.type === 11) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NUMBER', 'SMARTCARD', 'BOX ID', 'EXPIRY DATE'];
            generateDataRows(['retailername', 'mobileno', 'retailerid', 'username', 'balance'], this.rowData);
          }

          generateExcelReport(areatitle, areasub, header, datas);
        } else if (response.status === 204) {
          const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
          const sub = 'MSO ADDRESS:' + this.msodetails;
          const datas: any[] = [];
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];

          // Handle empty data for no records
          if (this.type === 1) {
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'ACTIVATION DATE', 'EXPIRY DATE', 'PACKAGE STATUS'];
          } else if (this.type === 2) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'ACTIVATION DATE', 'EXPIRY DATE', 'STATUS'];
          } else if (this.type === 3) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'EXPIRY DATE',];
          } else if (this.type === 4) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'STATUS'];
          } else if (this.type === 5) {
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
          } else if (this.type === 6 || this.type === 7) {
            areatitle = 'A1:E2';
            areasub = 'A3:E3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CAS', 'ALLOCATION DATE'];
          } else if (this.type === 9) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'RETAILER NAME', 'MOBILE NUMBER', 'AREA', 'RETAILER USERNAME', 'BALANCE'];
          } else if (this.type === 11) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NUMBER', 'SMARTCARD', 'BOX ID', 'EXPIRY DATE'];
          }

          generateExcelReport(areatitle, areasub, header, datas);
          this.rowData = [];
        }
      }, (error) => {
        this.handleApiError(error);
      });
  }

  getRetailerExcel() {

  }
  getPDF() {

    this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.type, 1, this.operatorid, 0, 0, 0)
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
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, 8, 1, this.operatorid, this.monthYear, 0, 0)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.monthYear + '  _  ' + this.operatorname + ' - ' + this.OType + ".pdf").toUpperCase();
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

  getAreawiseReportDownload(reporttype: number) {

    this.processingSwal();
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.type, reporttype, this.operatorid, 0, 0, 0)
      .subscribe((x: Blob) => {
        if (reporttype == 1) {
          this.reportMaking(x, "LCO_ID_" + this.operatorid + "_AREAWISE_CONECTION_COUNT_REPORT.pdf", 'application/pdf');
        } else if (reporttype == 2) {
          this.reportMaking(x, "LCO_ID_" + this.operatorid + "_AREAWISE_CONECTION_COUNT_REPORT.xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });

  }

  // -----------------------------------------------------common method for pdf and excel------------------------------------------------------------------------


  reportMaking(x: Blob, reportname: any, reporttype: any) {
    const blob = new Blob([x], { type: reporttype });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = data;
    link.download = reportname.toUpperCase();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
    Swal.close();
  }
  pdfswalError(error: any) {
    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
  processingSwal() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

  }

}
