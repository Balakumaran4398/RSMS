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
  productType: any = 4;
  product: any = [
    { lable: "Base", value: 1 },
    { lable: "Addon", value: 2 },
    { lable: "Alacarte", value: 3 },
    { lable: "All", value: 4 },
  ];
  file: File | null = null;
  file1: File | any = null;
  filePath: string = '';
  isDateSelect: boolean = false;
  isFileSelected: boolean = false;
  submitted: boolean = false;
  $event: any;

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

  fromdate1: any;
  todate1: any;
  isupload: boolean | any = false;
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.isFileSelected = true;
      this.isDateSelect = true;
      this.file = input.files[0];
      this.filePath = input.files[0].name;
      console.log(this.file);
      if (this.type == 'Reconcilation') {
        this.getReconsolationUploadData();
      }
    } else {
      this.isFileSelected = false;
      this.isDateSelect = false;
      this.file = null;
      this.filePath = '';
    }
  }
  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date;
    this.fromdate1 = year + "-" + month + "-" + date;
    console.log(this.fromdate);
    console.log(this.fromdate1);
    return this.fromdate;

  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date;
    this.todate1 = year + "-" + month + "-" + date;
    console.log(this.todate);
    console.log(this.todate1);
    return this.todate;
  }
  getPackage_AddonExcel() {
    this.userService.getPackageModificationExcelReport(this.role, this.username, this.fromdate, this.todate, 1, this.packageType, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            header = ['S.NO', 'PACKAGE NAME PREVIOUS', 'PACKAGE NAME CURRENT', 'PACKAGE ID', 'RCAS PRODUCT ID', 'ENSCURITY PRODUCT', 'OLD CHANNEL LIST', 'NEW CHANNEL LIST', 'ADDED', 'REMOVED', 'UPDATED DATE', 'COUNT'];

            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.packagenamepre, d.packagenamecur, d.packageid, d.rcasproductid, d.rcasproductid, d.channelnamepre, d.chanenlnamecur, d.addedchannels, d.removedchannels, d.updateddate, d.count];
              console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateTraiPackageBaseExcel(areatitle, header, datas, title, areasub, sub);

          } else if (response.status === 204) {
            // this.swal.Success_204();
            const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            header = ['S.NO', 'PACKAGE NAME PREVIOUS', 'PACKAGE NAME CURRENT', 'PACKAGE ID', 'RCAS PRODUCT ID', 'ENSCURITY PRODUCT', 'OLD CHANNEL LIST', 'NEW CHANNEL LIST', 'ADDED', 'REMOVED', 'UPDATED DATE', 'COUNT'];
            this.excelService.generateTraiPackageBaseExcel(areatitle, header, datas, title, areasub, sub);
            this.rowData = [];
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }
  getPackage_AddonPDF(type: any) {
    // this.userService.getPackageModificationPdfReport(this.role, this.username, this.fromdate, this.todate, 1, this.packageType, type)
    //   .subscribe((x: Blob) => {
    //     const blob = new Blob([x], { type: 'application/pdf' });
    //     const data = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = data;
    //     link.download = `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].pdf`.toUpperCase();
    //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    //     setTimeout(() => {
    //       window.URL.revokeObjectURL(data);
    //       link.remove();
    //     }, 100);
    //   },
    //     (error: any) => {
    //       Swal.fire({
    //         title: 'Error!',
    //         text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
    //         icon: 'error',
    //         confirmButtonText: 'Ok'
    //       });
    //     });
    this.swal.Loading();
    this.userService.getPackageModificationPdfReport(this.role, this.username, this.fromdate, this.todate, 1, this.packageType, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].pdf`, 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].xlsx`, 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // ============================SYNCHRONIZATION==========================
  getExcel() {
    if (this.file) {
      console.log(this.file);
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      formData.append('fromdate', this.fromdate || 0);
      formData.append('todate', this.todate || 0);
      formData.append('reporttype', '2');
      if (this.type == 'Synchronization') {
        formData.append('type', this.productType);
      }
      // if (this.type == 'Synchronization') {
      this.swal.Loading();
      this.userService.getSynchronizationExcelReport(formData).subscribe(
        (response: HttpResponse<any[]>) => {
          const statusCode = response.status;
          const responseData = response.body;

          console.log('HTTP Status:', statusCode);
          if (statusCode === 204 || !responseData || responseData.length === 0) {
            const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            const additionalSubheaders = {
              'From Date': this.fromdate,
              'To Date': this.todate,
              'Package Type': this.productType,
            };
            const header = ['S.NO', 'SMARTCARD', 'PRODUCT ID', 'ACTIVATION DATE', 'EXPIRY DATE', 'ACTIVITY', 'STATUS', 'TYPE'];

            this.excelService.generateSynchronizationExcel(
              'A1:H2',
              header,
              [],
              title,
              'A3:H3',
              sub,
              additionalSubheaders
            );
          } else {
            this.rowData = responseData;
            const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            const additionalSubheaders = {
              'From Date': this.fromdate,
              'To Date': this.todate,
              'Package Type': this.productType,
            };

            const datas: any[] = [];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.smartcard, d.orderid, d.logdate, d.expirydate, d.activity, d.status, d.type];
              datas.push(row);
            });

            this.excelService.generateSynchronizationExcel(
              'A1:H2',
              ['S.NO', 'SMARTCARD', 'PRODUCT ID', 'ACTIVATION DATE', 'EXPIRY DATE', 'ACTIVITY', 'STATUS', 'TYPE'],
              datas,
              title,
              'A3:H3',
              sub,
              additionalSubheaders
            );
          }
          this.swal.Close();
        },
        (error) => {
          this.handleApiError(error);
        }
      );

      // }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No file selected. Please choose a file to upload.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  getPDF() {
    if (this.file) {
      console.log(this.file);
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      formData.append('fromdate', this.fromdate);
      formData.append('todate', this.todate);
      formData.append('reporttype', '2');
      formData.append('type', this.productType);
      this.userService.getSynchronizationPDFReport(formData).subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].pdf`.toUpperCase();
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
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No file selected. Please choose a file to upload.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  // ======================================RECONSOLATION==========================================
  dummyFile: any;
  getReconsolationUploadData() {
    console.log(this.file);

    const formData = new FormData();
    formData.append('role', this.role);
    formData.append('username', this.username);
    if (this.file) {

      formData.append('file', this.file);
      console.log('11111111', this.file);
    } else {
      console.log('22222222');

      this.dummyFile = new Blob(['Dummy content'], { type: 'text/plain' });
      const extensions = ['dummy.xlsx', 'dummy.xls', 'dummy.csv'];
      const randomName = extensions[Math.floor(Math.random() * extensions.length)];

      formData.append('file', this.dummyFile, randomName);
    }
    formData.append('fromdate', this.fromdate1 || 0);
    formData.append('todate', this.todate1 || 0);
    formData.append('isupload', this.isupload = 'true');
    formData.append('reporttype', '3');

    console.log(this.file);
    this.swal.Loading();


    this.userService.getuploadFileReconcialiationReport(formData).subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseData = response.body;

        console.log('HTTP Status:', statusCode);

        if (statusCode === 200) {
          console.log('responseData', responseData);
          if (responseData?.message) {
            this.swal.success_1(responseData.message);
          }

        }
      },
      (error) => {
        console.log('Error message', error);
        this.swal.Error(error?.error?.message)
        // this.handleApiError(error);
      }
    );


  }
  getReconsolationData() {
    console.log('file', this.file)
    const formData = new FormData();
    formData.append('role', this.role);
    formData.append('username', this.username);
    // formData.append('file', this.file1);
    if (this.file) {
      formData.append('file', this.file);
    } else {
      this.dummyFile = new Blob(['Dummy content'], { type: 'text/plain' });
      const extensions = ['dummy.xlsx', 'dummy.xls', 'dummy.csv'];
      const randomName = extensions[Math.floor(Math.random() * extensions.length)];

      formData.append('file', this.dummyFile, randomName);
    }
    formData.append('fromdate', this.fromdate1 || 0);
    formData.append('todate', this.todate1 || 0);
    formData.append('reporttype', '3');
    formData.append('isupload', this.isupload = 'false');
    console.log(this.file);
    this.swal.Loading();
    this.userService.getuploadFileReconcialiationReport(formData).subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseData = response.body;

        const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
        const sub = 'MSO ADDRESS:' + this.msodetails;
        const additionalSubheaders = {
          'From Date': this.fromdate,
          'To Date': this.todate,
        };
          const header = ['S.NO', 'CAS CHANNEL NAME', 'CAS PRODUCT ID', 'CAS PRODUCT NAME', 'CAS MISMATCH','SMS CHANNEL NAME', 'SMS PRODUCT ID', 'SMS PRODUCT NAME','SMS MISMATCH','LOG DATE','IS MATCH'];

        if (statusCode === 204 || !responseData || responseData.length === 0) {
          this.swal.success(responseData.message);
          this.excelService.generateReconcilationExcel(
            'A1:K2',
            header,
            [],
            title,
            'A3:K3',
            sub,
            additionalSubheaders
          );
        } else if (statusCode === 200) {
          console.log('responseData', responseData);

          this.swal.success_1(responseData.message);
          // if (responseData?.message) {
          //   console.log('11111111111');
            
          // } else {
            this.rowData = responseData.data;
            const datas: any[] = this.rowData.map((d: any, index: number) => [
              index + 1,
              d.caschannelname,
              d.casproductname,
              d.casproductid,
              d.casmismatch,
              d.smschannelname,
              d.smsproductid,
              d.smsproductname,
              d.smsmismatch,
              d.logdate,
              d.ismatch
            ]);
            this.excelService.generateReconcilationExcel(
              'A1:K2',
              header,
              datas,
              title,
              'A3:K3',
              sub,
              additionalSubheaders
            );
          // }
        }
        //  else if (statusCode === 400 || statusCode === 500 || statusCode === 501) {
        //   if (responseData?.message) {
        //     this.swal.Error(responseData.message);
        //   }
        // }
      },
      (error) => {
        console.log('Error message', error);
        this.swal.Error(error?.error?.message);
        // this.handleApiError(error);
        // this.swal.Close();
      }
    );


  }
  // }
  getChannelExcel() {
    this.swal.Loading();
    this.userService.getChannelModificationExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.type);
          this.swal.Close();
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            header = ['S.NO', 'CHANNEL NAME PREVIOUS', 'CHANNEL NAME NEW', 'BROADCASTER NAME PREVIOUS', 'BROADCASTER NAME NEW', 'SERVICE ID PREVIOUS', 'SERVICE ID NEW', 'OLD PRODUCT ID', 'NEW PRODUCT ID', 'MRP PRE', 'MRP NEW', 'CREATED DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.channelnamepre, d.channelnamecur, d.broadcasternamepre, d.broadcasternamecur, d.serviceidpre, d.serviceidcur, d.oldproductid, d.newproductid, d.amountpre, d.amountcur, d.createddate];
              console.log('type 1 and 4', row);
              datas.push(row);
            });
            this.excelService.generateTraiPackageBaseExcel(areatitle, header, datas, title, areasub, sub);
          } else if (response.status === 204) {
            // this.swal.Success_204();
            this.swal.Close();
            const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            header = ['S.NO', 'CHANNEL NAME PREVIOUS', 'CHANNEL NAME CURRENT', 'BROADCASTER NAME PREVIOUS', 'BROADCASTER NAME NEW', 'SERVICE ID PREVIOUS', 'SERVICE ID NEW', 'OLD PRODUCT ID', 'NEW PRODUCT ID', 'MRP PRE', 'MRP NEW', 'CREATED DATE'];
            this.excelService.generateTraiPackageBaseExcel(areatitle, header, datas, title, areasub, sub);
            this.rowData = [];
          }
        },
        (error) => {
          this.swal.Close();
          this.handleApiError(error);
        }
      );
  }
  getChannelPDF() {
    this.swal.Loading();
    this.userService.getChannelModificationPdfReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        this.swal.Close();
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].pdf`.toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          this.swal.Close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }

  // getComboExcel() {
  //   this.swal.Loading();
  //   this.userService.getComboModificationExcelReport(this.role, this.username, 2)
  //     .subscribe(
  //       (response: HttpResponse<any[]>) => {
  //         console.log(this.type);
  //         this.swal.Close();
  //         console.log(response);

  //         this.rowData = response.body;
  //         console.log(this.rowData);

  //         const title = (this.type + ' REPORT').toUpperCase();
  //         const sub = 'MSO ADDRESS:' + this.msodetails;

  //         const datas: Array<any> = [];
  //         const columns: any[] = [];

  //         let areaTitle = 'A1:D2';
  //         let areaSub = 'A3:D3';
  //         console.log('addonlist');
  //         // Handle Addon List
  //         if (this.rowData.addonlist && this.rowData.addonlist.length > 0) {
  //           columns.push(['S.NO', 'CHANNEL ID', 'CHANNEL NAME', 'RATE']);
  //           this.rowData.addonlist.forEach((d: any, index: number) => {
  //             const row = [index + 1, d.channelid, d.channelname, d.inramt];
  //             console.log('addonlist', row);
  //             datas.push(row);
  //           });
  //         } else {
  //           columns.push(['S.NO', 'CHANNEL ID', 'CHANNEL NAME', 'RATE']);
  //           datas.push(['No data available']); // Placeholders if no data exists
  //         }
  //         datas.push(['', '', '']); // Add a blank row to separate sections

  //         // Handle Channel List
  //         if (this.rowData.channellist && this.rowData.channellist.length > 0) {
  //           columns.push(['S.NO', 'CHANNEL ID', 'CHANNEL NAME', 'RATE']);
  //           this.rowData.channellist.forEach((d: any, index: number) => {
  //             const row = [index + 1, d.channelid, d.channelname, d.inramt];
  //             console.log('channellist', row);
  //             datas.push(row);
  //           });
  //         } else {
  //           columns.push(['S.NO', 'CHANNEL ID', 'CHANNEL NAME', 'RATE']);
  //           datas.push(['No data available']);
  //         }
  //         datas.push(['', '', '']);

  //         console.log('combomodificationlist', this.rowData.combomodificationlist);

  //         // Handle Combo Modification List
  //         if (this.rowData.combomodificationlist && this.rowData.combomodificationlist.length > 0) {
  //           console.log('COMBO');

  //           columns.push(['S.NO', 'PACKAGE ID', 'PACKAGE NAME', 'PRODUCT TYPE', 'PRODUCT TYPE NAME']);
  //           this.rowData.combomodificationlist.forEach((d: any, index: number) => {
  //             const row = [index + 1, d.packageid, d.packagename, d.producttype, d.producttypename];
  //             console.log('combomodificationlist', row);
  //             datas.push(row);
  //           });
  //         } else {
  //           columns.push(['S.NO', 'PACKAGE ID', 'PACKAGE NAME', 'PRODUCT TYPE', 'PRODUCT TYPE NAME']);
  //           datas.push(['No data available']);
  //         }

  //         this.excelService.generateComboExcel(areaTitle, columns[0], datas, title, areaSub, sub,);
  //       },
  //       (error) => {
  //         this.swal.Close();
  //         this.handleApiError(error);
  //       }
  //     );
  // }

  // getComboPDF() {
  //   this.swal.Loading();
  //   this.userService.getComboModificationPdfReport(this.role, this.username, 1).subscribe((x: Blob) => {
  //     this.swal.Close();
  //     const blob = new Blob([x], { type: 'application/pdf' });
  //     const data = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = data;
  //     link.download = (this.type + ".pdf").toUpperCase();
  //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //     setTimeout(() => {
  //       window.URL.revokeObjectURL(data);
  //       link.remove();
  //     }, 100);
  //   },
  //     (error: any) => {
  //       this.swal.Close();
  //       Swal.fire({
  //         title: 'Error!',
  //         text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
  //         icon: 'error',
  //         confirmButtonText: 'Ok'
  //       });
  //     });
  // }
  getComboReport(type: number) {
    this.swal.Loading();
    this.submitted = true;
    console.log('11111        Type = ', type);

    this.userService.getComboModificationPdfReport(this.role, this.username, type).subscribe({
      next: (x: Blob) => {
        this.swal.Close();

        if (type == 1) {
          this.reportMaking(x, 'Combo' + ".pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, 'Combo' + ".xlsx", 'application/xlsx');
        }
      },
      error: (error: any) => {
        this.swal.Close();
        this.pdfswalError(error?.error.message);
      }
    });


  }
  getBouquetAlacarteExcel() {
    this.swal.Loading();
    if (!this.productType) {
      this.submitted = true;
    } else {
      this.userService.getBouquetSubscriptionExcelReport(this.role, this.username, this.fromdate, this.todate, this.productType, 2)
        .subscribe(
          (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
            console.log(this.type);
            this.swal.Close();
            if (response.status === 200) {
              this.rowData = response.body;
              console.log(this.rowData);
              console.log(this.type);
              const title = (this.type + ' REPORT [FROM DATE: ' + this.fromdate + ' - TO DATE: ' + this.todate + ']').toUpperCase();
              const sub = 'MSO ADDRESS:' + this.msodetails;
              let areatitle = '';
              let areasub = '';
              let header: string[] = [];
              const datas: Array<any> = [];
              // if (this.type == 1) {
              areatitle = 'A1:J2';
              areasub = 'A3:J3';
              // header = ['CHANNEL ID', 'CHANNEL NAME', 'RATE'];
              header = ['S.NO', 'SMARTCARD', 'BOXID', 'PRODUCT ID', 'PRODUCT NAME', 'LOG DATE', 'ACTIVATION DATE', 'EXPIRY DATE', 'ACTIVITY', 'STATUS'];

              this.rowData.forEach((d: any, index: number) => {
                const row = [index + 1, d.smartcard, d.boxid, d.orderid, d.packagename, d.logdate, d.logdate, d.expirydate, d.activity, d.status];
                console.log('type 1 and 4', row);
                datas.push(row);
              });
              this.excelService.generateSuspendBasedExcel(areatitle, header, datas, title, areasub, sub);

              // this.excelService.generateBouquetExcel(areatitle, header, datas, title, areasub, sub);

            } else if (response.status === 204) {
              // this.swal.Success_204();

              const title = (this.type + '  REPORT').toUpperCase();
              const sub = 'MSO ADDRESS:' + this.msodetails;
              let areatitle = '';
              let areasub = '';
              let header: string[] = [];
              const datas: Array<any> = [];
              areatitle = 'A1:J2';
              areasub = 'A3:J3';
              header = ['S.NO', 'SMARTCARD', 'BOXID', 'PRODUCT ID', 'PRODUCT NAME', 'LOG DATE', 'ACTIVATION DATE', 'EXPIRY DATE', 'ACTIVITY', 'STATUS'];
              this.excelService.generateBouquetExcel(areatitle, header, datas, title, areasub, sub);
              this.rowData = [];
            }
          },
          (error) => {
            this.swal.Close();
            this.handleApiError(error);
          }
        );
    }
  }
  getBouquetAlacartePDF() {
    this.swal.Loading();
    if (!this.productType) {
      this.submitted = true;
    } else {
      this.userService.getBouquetSubscriptionPdfReport(this.role, this.username, this.fromdate, this.todate, this.productType, 1)
        .subscribe((x: Blob) => {
          this.swal.Close();
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          link.download = `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].pdf`.toUpperCase();
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
          (error: any) => {
            this.swal.Close();
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
    }
  }

  getTotalOperatorReportDownload(type: number) {
    this.processingSwal();
    this.userService.getBouquetSubscriptionPdfReport(this.role, this.username, this.fromdate, this.todate, this.productType, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `${this.type} REPORT - [FROM DATE: ${this.fromdate} - TO DATE: ${this.todate}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // ------------------------------------------------------------------------------------------------
  handleApiError(error: any) {
    console.log(error);
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else if (error.status === 501) {
      this.swal.Error_501();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
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
      text: error.message || 'There was an issue generating the PDF CAS form report.',
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
