import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import moment, { Moment } from 'moment';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/_core/service/excel.service';

@Component({
  selector: 'app-package-based',
  templateUrl: './package-based.component.html',
  styleUrls: ['./package-based.component.scss']
})
export class PackageBasedComponent implements OnInit {
  type: any;
  packageType: any;
  returndata: any;
  username: any;
  role: any;
  rowData: any;
  msodetails: any;
  productType: any = '';
  product: any = [
    { lable: "Base", value: 1 },
    { lable: "Addon", value: 2 },
    { lable: "Alacarte", value: 3 },
    { lable: "All", value: 4 },
  ];
  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;

  constructor(public dialogRef: MatDialogRef<PackageBasedComponent>, private swal: SwalService, @Inject(MAT_DIALOG_DATA) public data: any, private excelService: ExcelService, public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data.type
    // this.setType(this.type);
    if (this.type === 'package') {
      this.packageType = 1;
    } else if (this.type === 'addon_package') {
      this.packageType = 2;
    } else {
      this.packageType = 0;
    }

  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ngOnInit(): void {
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    console.log(this.fromdate, this.todate);
  }
  onNoClick(): void {
    this.dialogRef.close(this.returndata);
  }
  readonly date = new FormControl(moment());

  fromdate: any;
  todate: any;

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.isFileSelected = true;
      this.file = input.files[0];
      this.filePath = input.files[0].name;
      console.log(this.file);
    } else {
      this.isFileSelected = false;
      this.file = null;
      this.filePath = '';
    }
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
  getExcel() {
    console.log(this.packageType);
    this.userService.getPackageModificationExcelReport(this.role, this.username, this.fromdate, this.todate, 1, this.packageType, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['PACKAGE NAME PREVIOUS', 'PACKAGE NAME CURRENR', 'PACKAGE ID', 'PRODUCT ID', 'OLD CHANNEL LIST', 'NEW CHANNEL LIST', 'ADDED CHANNEL LIST', 'REMOVED CHANNEL LIST', 'UPDATED DATE', 'COUNT'];

            this.rowData.forEach((d: any) => {
              const row = [d.packagenamepre, d.packagenamecur, d.packageid, d.casproductid, d.channelnamepre, d.chanenlnamecur, d.addedchannels, d.removedchannels, d.updateddate, d.count];
              // console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateTraiPackageBaseExcel(areatitle, header, datas, title, areasub, sub);

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
    this.userService.getPackageModificationPdfReport(this.role, this.username, this.fromdate, this.todate, 1, this.packageType, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
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
  getChannelExcel() {
    this.userService.getChannelModificationExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:G2';
            areasub = 'A3:G3';
            header = ['CHANNEL NAME PREVIOUS', 'CHANNEL NAME CURRENT', 'BROADCASTER NAME PREVIOUS', 'BROADCASTER NAME CURRENT', 'SERVICE ID PREVIOUS', 'SERVICE ID CURRENT', 'CREATED DATE'];

            this.rowData.forEach((d: any) => {
              const row = [d.channelnamepre, d.channelnamecur, d.broadcasternamepre, d.broadcasternamecur, d.serviceidpre, d.serviceidcur, d.createddate];
              console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateTraiPackageBaseExcel(areatitle, header, datas, title, areasub, sub);

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
  getChannelPDF() {
    this.userService.getChannelModificationPdfReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
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
  getComboExcel() {
    this.userService.getComboModificationExcelReport(this.role, this.username, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.rowData);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            if (this.rowData.addonlist && this.rowData.addonlist.length > 0) {
              areatitle = 'A1:E2';
              areasub = 'A3:E3';
              header = ['CHANNEL ID', 'CHANNEL NAME', 'RATE'];
              this.rowData.forEach((d: any) => {
                const row = [d.addonlist.channelid, d.addonlist.channelname, d.addonlist.inramt];
                console.log('addonlist', row);
                datas.push(row);
              });
              // this.excelService.generateComboExcel(areatitle, header, datas, title, areasub, sub);
            }
            if (this.rowData.channellist && this.rowData.channellist.length > 0) {
              areatitle = 'A1:E2';
              areasub = 'A3:E3';
              header = ['CHANNEL ID', 'CHANNEL NAME', 'RATE'];
              this.rowData.channellist.forEach((d: any) => {
                const row = [d.channelid, d.channelname, d.inramt];
                console.log('channellist ', row);
                datas.push(row);
              });
              // this.excelService.generateComboExcel(areatitle, header, datas, title, areasub, sub);
            }
            if (this.rowData.combomodificationlist && this.rowData.combomodificationlist.length > 0) {
              areatitle = 'A1:D2';
              areasub = 'A3:D3';
              header = ['PACKAGE ID', 'PACKAGE NAME', 'PRODUCT TYPE', 'PRODUCT TYPE NAME'];
              this.rowData.combomodificationlist.forEach((d: any) => {
                const row = [d.packageid, d.packagename, d.producttype, d.producttypename];
                console.log('combomodificationlist', row);
                datas.push(row);
              });
            }
            this.excelService.generateComboExcel(areatitle, header, datas, title, areasub, sub);
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
  getComboPDF() {
    console.log('type 1 and 4', this.type);
    this.userService.getComboModificationPdfReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
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

  getBouquetAlacarteExcel() {
    this.userService.getBouquetSubscriptionExcelReport(this.role, this.username, this.fromdate, this.todate, this.productType, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.rowData);
            console.log(this.type);
            const title = (this.type + '  REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            // header = ['CHANNEL ID', 'CHANNEL NAME', 'RATE'];
            header = ['SMARTCARD', 'BOXID', 'PRODUCT ID', 'PRODUCT NAME', 'LOG DATE', 'ACTIVATION DATE', 'EXPIRY DATE', 'ACTIVITY', 'STATUS'];

            this.rowData.forEach((d: any) => {
              const row = [d.smartcard, d.boxid, d.orderid, d.packagename, d.logdate, d.logdate, d.expirydate, d.activity, d.status];
              console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateBouquetExcel(areatitle, header, datas, title, areasub, sub);

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
  getBouquetAlacartePDF() {
    console.log('type 1 and 4', this.type);
    this.userService.getBouquetSubscriptionPdfReport(this.role, this.username, this.fromdate, this.todate, this.productType, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
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
