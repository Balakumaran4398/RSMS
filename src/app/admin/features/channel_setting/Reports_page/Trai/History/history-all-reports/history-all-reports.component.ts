import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-history-all-reports',
  templateUrl: './history-all-reports.component.html',
  styleUrls: ['./history-all-reports.component.scss']
})
export class HistoryAllReportsComponent implements OnInit {
  allType: any;
  reportTitle: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  gridApi: any;
  rowData: any;
  msodetails: any;
  role: any;
  username: any;

  smartcard: any = null;
  fromdate: any;
  todate: any;
  smartcardid: any;

  date: any;
  cur_date: any;

  constructor(public dialog: MatDialog, public router: Router, private excelService: ExcelService, private location: Location, private route: ActivatedRoute, private swal: SwalService, private userService: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  ngOnInit(): void {


    this.allType = this.route.snapshot.paramMap.get('id');
    console.log('dfdsfdsfdsf', this.allType);
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
    this.setReportTitle();
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    this.logValues('');
    console.log(this.allType);
    this.onColumnDefs();
    if (this.allType == 1) {
      console.log('sdsds', this.allType);
      this.getAllServicereport();
    } else if (this.allType == '3') {
      this.getPairedReport();
    } else if (this.allType == '4') {
      this.getBlockedReport();
    } else if (this.allType == '5') {
      this.getScrollReport();
    } else if (this.allType == '6') {
      this.getMailReport();
    } else if (this.allType == '8') {
      this.getMessageReport();
    } else if (this.allType == '11') {
      this.getSmartcardSuspendReport();
    } else if (this.allType == '12') {
      this.getDatewiseSuspendReport();
    } else if (this.allType == '13') {
      this.getSuspendReport();
    }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  setReportTitle() {
    console.log(this.allType);
    switch (this.allType) {
      case '1':
        this.getAllServicereport();
        this.reportTitle = 'All Service Report';
        break;
      case '2':
        this.reportTitle = 'Total Smartcard List Report';
        break;
      case '3':
        this.reportTitle = 'Paired Smartcard/Boxid Report';
        // this.getPairedReport();
        break;
      case '4':
        this.reportTitle = 'Block List Report';
        // this.getBlockedReport();
        break;
      case '5':
        this.reportTitle = 'Scroll History report';
        // this.getScrollReport();
        break;
      case '6':
        this.reportTitle = 'mail History report';
        // this.getMailReport();
        break;
      case '7':
        this.reportTitle = 'Fingerprint History report';
        break;
      case '8':
        this.reportTitle = 'Message History report';
        // this.getMessageReport();
        break;
      case '9':
        this.reportTitle = 'Network Smartcard Status Count report';
        // this.getMessageReport();
        break;
      case '10':
        this.reportTitle = 'Network Smartcard Active/Deactive Status Count  Report';
        // this.getMessageReport();
        break;
      case '11':
        this.reportTitle = 'As on Suspend Report';
        // this.getMessageReport();
        break;
      case '12':
        this.reportTitle = 'Suspend Report for particular Duration';
        // this.getMessageReport();
        break;
      case '13':
        this.reportTitle = 'Suspend History Report';
        // this.getMessageReport();
        break;
      default:
        this.reportTitle = 'Unknown Report';
    }

  }
  columnDefs = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, width: 90 },
    { headerName: 'SMARTCARD', field: '', width: 350 },
    { headerName: 'LOG DATE', field: '', width: 340 },
    { headerName: 'ACTION', field: '', width: 340 },
    { headerName: 'REMARKS', field: '', width: 350 },
  ]


  private onColumnDefs() {
    console.log('colmnDefs', this.allType);

    if (this.allType == 1) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 300 },
        { headerName: 'LOG DATE', field: 'logdate', width: 280 },
        { headerName: 'ACTION', field: 'activity', width: 200 },
        { headerName: 'REMARKS', field: 'remarks', width: 680 },
      ]
    } else if (this.allType == 3) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SUBSCRIBER ID', field: 'subid', width: 150 },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', width: 150 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 250 },
        { headerName: 'BOX ID', field: 'boxid', width: 200 },
        { headerName: 'ADDRESS', field: 'address', width: 350 },
        { headerName: 'INSTALLED DATE', field: 'createddate', width: 350 },
      ]
    } else if (this.allType == '4') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SUBSCRIBER ID', field: 'subid', width: 150 },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', width: 200 },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 200 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 200 },
        { headerName: 'BOX ID', field: 'boxid', width: 150 },
        { headerName: 'BLOCKED DATE', field: 'broadcastername', width: 200 },
        { headerName: 'CAS', field: 'broadcastername', width: 150 },
        { headerName: 'PACKAGE', field: 'broadcastername', width: 200 },
        { headerName: 'EXPIRY DATE', field: 'broadcastername', width: 200 },
      ]
    } else if (this.allType == '5') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'INTEND ID', field: 'intendid', width: 120 },
        { headerName: 'INTENT TO', field: 'intendto', width: 150 },
        { headerName: 'MESSAGE', field: 'scrollmessage', width: 200 },
        { headerName: 'FONT COLOR	', field: 'scrollcolordisplay', width: 150 },
        { headerName: 'BACKGROUND COLOR	', field: 'scrollbgcolordisplay', width: 150 },
        { headerName: 'FONT SIZE', field: 'fontsize', width: 150 },
        { headerName: 'POSITION', field: 'scrollposition', width: 150 },
        { headerName: 'REPEAT FOR	', field: 'repeatfor', width: 200 },
        { headerName: 'CREATED DATE', field: 'createddate', width: 200 },
      ]
    } else if (this.allType == '6') {
      console.log('colmnDefs', this.allType, '6');
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'INTEND ID', field: 'intendid', width: 200 },
        { headerName: 'INTENT TO', field: 'intendto', width: 200 },
        { headerName: 'TITLE', field: 'mailtitle', width: 200 },
        { headerName: 'SENDER', field: 'sender', width: 200 },
        { headerName: 'MESSAGE', field: 'message', width: 250 },
        { headerName: 'SENT DATE', field: 'sentdate', width: 200 },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200 },
      ]
    } else if (this.allType == '8') {
      console.log('colmnDefs', this.allType, '6');
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'INTEND ID', field: 'intendid', width: 150 },
        { headerName: 'INTENT TO', field: 'intendto', width: 200 },
        { headerName: 'MESSAGE', field: 'messagecontent', width: 200 },
        { headerName: 'FONT COLOR	', field: 'fontcolordisplay', width: 200 },
        { headerName: 'BACKGROUND COLOR	', field: 'bgcolordisplay', width: 150 },
        { headerName: 'REPEAT FOR	', field: 'repeatfor', width: 200 },
        { headerName: 'TRANSPARANCY', field: 'transparency', width: 200 },
        { headerName: 'DURATION', field: 'duration', width: 150 },
        { headerName: 'TIME GAP	', field: 'timegap', width: 150 },
        { headerName: 'CAS', field: 'casname', width: 150 },
        { headerName: 'SEND DATE', field: 'sentdate', width: 200 },
      ]
    } else if (this.allType == '11' || this.allType == '12') {
      console.log('colmnDefs', this.allType, '6');
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'CUSTOMER NAME', field: 'customername', width: 200 },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 200 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 250 },
        { headerName: 'BOX ID	', field: 'boxid', width: 200 },
        { headerName: 'CAS', field: 'casname', width: 150 },
        { headerName: 'PACKAGE', field: 'productname', width: 200 },
        { headerName: 'SUBSCRIPTION END DATE', field: 'createddate', width: 250 },
      ]
    }
    else if (this.allType == '13') {
      console.log('colmnDefs', this.allType, '6');
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'CUSTOMER NAME', field: 'customername', width: 250 },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 200 },
        { headerName: 'STATUS	', field: 'status', width: 150 },
        { headerName: 'SUSPEND DATE', field: 'createddate', width: 150 },
        { headerName: 'RESUME DATE', field: 'updateddate', width: 150 },
        { headerName: 'OLD EXPIRY DATE', field: 'oldexpirydate', width: 150 },
        { headerName: 'NEW EXPIRY DATE', field: 'newexpirydate', width: 150 },
        { headerName: 'REMAINING DAYS', field: 'remainingdays', width: 150 },
        { headerName: 'CAS', field: 'casname', width: 150 },
        { headerName: 'PACKAGE', field: 'productname', width: 300 },
      ]
    }
    else {
      console.warn('Unknown allType:', this.allType);
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  formatDate1(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  logValues(event: any): void {
    const selectedDate: Date = event.value || new Date();
    const formattedDate = this.formatDate1(selectedDate);
    console.log('Selected Date:', formattedDate);
    this.cur_date = formattedDate;
    console.log(this.cur_date);
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

  // ---------------------------------------ALL SERVICE----------------------

  getAllServicereport() {
    console.log('sadsasadsadsadsadsad');

    this.smartcard = this.smartcardid
    // this.swal.Loading();
    this.userService.getAllServiceHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, this.smartcard, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(response);
          if (response.status === 200) {
            this.rowData = response.body;
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
  getAllServiceExcel() {
    // this.swal.Loading();
    this.userService.getAllServiceHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, this.smartcard, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(response);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:E2';
            areasub = 'A3:E3';
            header = ['S.NO', 'SMARTCARD', 'LOG DATE', 'ACTION', 'REMARKS',];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.smartcard, d.logdate, d.activity, d.remarks];
              datas.push(row);
            });
            this.excelService.generateAllServiceExcel(areatitle, header, datas, title, areasub, sub);
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
  getAllServicePDF() {
    // this.swal.Loading();
    this.userService.getAllServiceHistoryPDFReport(this.role, this.username, this.fromdate, this.todate, this.smartcard, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // --------------------------------------------Total Smartcard-----------------
  getTotalExcel() {
    // this.swal.Loading();
    this.userService.getTotalSmartcardExcelReport(this.role, this.username, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:J2';
            areasub = 'A3:J3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'CAS FORM ID', 'MOBILE NO', 'ADDRESS', 'INSTALL ADDRESS', 'EMAIL', 'LANDLINE NO', 'SMARTCARD', 'BOX ID', 'STATUS', 'CREATED DATE', 'USER NAME', 'PASSWORD', 'APP LOCK STATUS', 'PACKAGE NAME'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.subid, d.customername, d.casformid, d.mobileno, d.address, d.installaddress, d.email, d.landline, d.smartcard, d.boxid, d.status, d.createddate, d.username, d.password, d.lockstatus, d.productname];
              datas.push(row);
            });
            this.excelService.generateTotalSmartcardExcel(areatitle, header, datas, title, areasub, sub);
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
  getTotalPDF() {
    // this.swal.Loading();
    this.userService.getTotalSmartcardPDFReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // --------------------------------------Paired-------------------------

  getPairedReport() {
    // this.swal.Loading();
    this.userService.getPairedSmartcardExcelReport(this.role, this.username, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(response);
          if (response.status === 200) {
            this.rowData = response.body;
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
  getPairedExcel() {
    // this.swal.Loading();
    this.userService.getPairedSmartcardExcelReport(this.role, this.username, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:G2';
            areasub = 'A3:G3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'INSTALL DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.subid, d.customername, d.smartcard, d.boxid, d.address, d.createddate];
              datas.push(row);
            });
            this.excelService.generatePairedExcel(areatitle, header, datas, title, areasub, sub);
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
  getPairedPDF() {
    // this.swal.Loading();
    this.userService.getPairedSmartcardPDFReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // -------------------------------Blocked--------------------
  getBlockedReport() {
    // this.swal.Loading();
    this.userService.getBlockSmartcardExcelReport(this.role, this.username, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;

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
  getBlockedExcel() {
    // this.swal.Loading();
    this.userService.getBlockSmartcardExcelReport(this.role, this.username, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:J2';
            areasub = 'A3:J3';
            header = ['S.NO', 'OPERATOR NAME', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'MOBILE NO', 'SMARTCARD', 'BOX ID', 'CAS', 'PACKAGE ID', 'PRODUCT NAME', 'EXPIRY DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.operatorname, d.subid, d.customername, d.mobileno, d.smartcard, d.boxid, d.address, d.casname, d.packageid, d.productname, d.expirydate];
              datas.push(row);
            });
            this.excelService.generateBlockExcel(areatitle, header, datas, title, areasub, sub);
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
  getBlockedPDF() {
    // this.swal.Loading();
    this.userService.getBlockSmartcardPDFReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // --------------------------------------------------------scroll------------------------------------
  getScrollReport() {
    // this.swal.Loading();
    this.userService.getScrollHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;

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
  getScrollExcel() {
    // this.swal.Loading();
    this.userService.getScrollHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:J2';
            areasub = 'A3:J3';
            header = ['S.NO', 'INTEND ID', 'INTEND TO', 'MESSAGE', 'FONT COLOR', 'BACKGROUND COLOR', 'FONT SIZE', 'POSITION', 'REPEAT FOR', 'CREATED DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.intendid, d.intendto, d.scrollmessage, d.scrollcolordisplay, d.scrollbgcolordisplay, d.fontsize, d.scrollposition, d.repeatfor, d.createddate];
              datas.push(row);
            });
            this.excelService.generateScrollExcel(areatitle, header, datas, title, areasub, sub);
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
  getScrollPDF() {
    // this.swal.Loading();
    this.userService.getScrollHistoryPDFReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // ------------------------------------------------------Mail History------------------------------------------
  getMailReport() {
    // this.swal.Loading();
    this.userService.getMailHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;

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
  getMailExcel() {
    // this.swal.Loading();
    this.userService.getMailHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:H2';
            areasub = 'A3:H3';
            header = ['S.NO', 'INTEND ID', 'INTEND TO', 'TITLE', 'SENDER', 'MESSAGE', 'SEND DATE', 'EXPIRY DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.intendid, d.intendto, d.mailtitle, d.sender, d.message, d.sentdate, d.expirydate];
              datas.push(row);
            });
            this.excelService.generateMailExcel(areatitle, header, datas, title, areasub, sub);
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
  getMailPDF() {
    // this.swal.Loading();
    this.userService.getMaillHistoryPDFReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // --------------------------------------------------------Finger print------------------------------------------------
  getFingerprintReport() {
    // this.swal.Loading();
    this.userService.getScrollHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;

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
  getFingerprintExcel() {
    // this.swal.Loading();
    this.userService.getFingerprintHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:G2';
            areasub = 'A3:G3';
            header = ['S.NO', 'ID', 'POSITION', 'FONT COLOR', 'BACKGROUND COLOR', 'FONT SIZE', 'DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.intendid, d.position, d.fontcolordisplay, d.bgcolordisplay, d.fontsize, d.date];
              datas.push(row);
            });
            this.excelService.generatFingerprintExcel(areatitle, header, datas, title, areasub, sub);
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
  getFingerprintPDF() {
    // this.swal.Loading();
    this.userService.getFingerprintPDFReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // -------------------------------------------------------------Message ------------------------------------------------
  getMessageReport() {
    // this.swal.Loading();
    this.userService.getMessageExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;

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
  getMessageExcel() {
    // this.swal.Loading();
    this.userService.getMessageExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            header = ['S.NO', 'INTEND ID', 'INTEND TO', 'MESSAGE', 'FONT COLOR', 'BACKGROUND COLOR', 'REPEAT FOR', 'TRANSPARANCY', 'DURATION', 'TIME GAP', 'CAS', 'SEND DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.intendid, d.intendto, d.messagecontent, d.fontcolordisplay, d.bgcolordisplay, d.repeatfor, d.transparency, d.duration, d.timegap, d.casname, d.sentdate];
              datas.push(row);
            });
            this.excelService.generatMessageExcel(areatitle, header, datas, title, areasub, sub);
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
  getMessagePDF() {
    // this.swal.Loading();
    this.userService.getMessageHistoryPDFReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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
  // ---------------------------------------------------Network smartcard active/deactive status count report--------------------------------------------
  getNetworkSmartcardActiveDeactiveStatusExcel() {
    console.log(this.cur_date);
    this.userService.getNetworkSmartcardStatusCountReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            const activeData = response.body.activecount || [];
            const deactiveData = response.body.deactivecount || [];
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            const headers = ['S.NO', 'TYPE', 'CAS', 'TOTAL COUNT'];
            const dataRows: Array<any[]> = [];
            activeData.forEach((item: any, index: number) => {
              dataRows.push([
                index + 1,
                'Active',
                item.casname,
                item.totalcount,
              ]);
            });
            deactiveData.forEach((item: any, index: number) => {
              dataRows.push([
                activeData.length + index + 1,
                'Deactive',
                item.casname,
                item.totalcount,
              ]);
            });

            const columns = [
              { width: 25 }, // S.NO
              { width: 35 }, // TYPE
              { width: 35 }, // CAS
              { width: 35 }, // TOTAL COUNT
            ];
            this.excelService.generateExcelFile(
              'A1:D2',
              headers,
              dataRows,
              title,
              'A3:D3',
              sub,
              columns,
              'NETWORK SMARTCARD ACTIVE /DEACTIVE STATUS COUNT '
            );
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


  getNetworkSmartcardActiveDeactiveStatusPDF() {
    console.log(this.cur_date);
    this.userService.getNetworkSmartcardCountStatusPDFReport(this.role, this.username, this.cur_date, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = ("NETWORK SMARTCARD ACTIVE /DEACTIVE STATUS COUNT .pdf").toUpperCase();
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
  // ---------------------------------------------------Network smartcard  status count report--------------------------------------------
  getNetworkSmartcardStatusReport() {
    // this.swal.Loading();
    this.userService.getNetworkSmartcardCountReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
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

  getNetworkSmartcardStatusExcel() {
    console.log(this.cur_date);

    this.userService.getNetworkSmartcardCountReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            const datas: Array<any> = [];
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            const headers = ['S.NO', 'ACTIVE COUNT', 'DEACTIVE COUNT', 'TOTAL COUNT', 'ACTIVE SUBSCRIPTION COUNT', 'DEACTIVE SUBSCRIPTION COUNT'];
            datas.push([
              1,
              this.rowData.activecount,
              this.rowData.deactivecount,
              this.rowData.totalcount,
              this.rowData.notexpiry,
              this.rowData.expiry,
            ]);
            this.excelService.generatNetworkSmartcardStatusExcel(areatitle, headers, datas, title, areasub, sub);
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

  getNetworkSmartcardStatusPDF() {
    // this.swal.Loading();
    console.log(this.cur_date);
    this.userService.getNetworkSmartcardCountPDFReport(this.role, this.username, this.cur_date, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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

  // ---------------------------------------------------Network smartcard  status (Operator wise) count report--------------------------------------------
  getNetworkOperatorwiseSmartcardStatusReport() {
    // this.swal.Loading();
    this.userService.getNetworkSmartcardOperatorwiseReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
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

  getNetworkOperatorwiseSmartcardStatusExcel() {
    console.log(this.cur_date);

    this.userService.getNetworkSmartcardOperatorwiseReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = ('OPERATORWISE NETWORK SMARTCARD STATUS COUNT REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            const datas: Array<any> = [];
            areatitle = 'A1:G2';
            areasub = 'A3:G3';
            const headers = ['S.NO', 'OPERATOR', 'ACTIVE COUNT', 'DEACTIVE COUNT', 'ACTIVE SUBSCRIPTION COUNT', 'DEACTIVE SUBSCRIPTION COUNT', 'BLOCK COUNT'];
            this.rowData.operatorlist.forEach((item: any, index: number) => {
              datas.push([
                index + 1, // S.NO
                item.operatorname, // OPERATOR
                item.acount, // ACTIVE COUNT
                item.dcount, // DEACTIVE COUNT
                item.notexpirycount, // ACTIVE SUBSCRIPTION COUNT
                item.expirycount, // DEACTIVE SUBSCRIPTION COUNT
                item.blockcount // BLOCK COUNT
              ]);
            });
            this.excelService.generatNetworkOperatorwiseSmartcardStatusExcel(areatitle, headers, datas, title, areasub, sub);
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

  getNetworkOperatorwiseSmartcardStatusPDF() {
    // this.swal.Loading();
    console.log(this.cur_date);
    this.userService.getNetworkSmartcardOperatorwisePDFReport(this.role, this.username, this.cur_date, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = ("OPERATORWISE NETWORK SMARTCARD STATUS COUNT.pdf").toUpperCase();
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
  // ------------------------------------------------Smartcard suspend------------------------------------
  getSmartcardSuspendReport() {
    // this.swal.Loading();
    this.userService.getAsonDateSuspendReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
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

  getSmartcardSuspendExcel() {
    console.log(this.cur_date);

    this.userService.getAsonDateSuspendReport(this.role, this.username, this.cur_date, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:H2';
            areasub = 'A3:H3';
            const headers = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NO', 'SMARTCARD', 'BOX ID', 'CAS', 'PACKAGE', 'SUBSCRIPTION END DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.customername, d.mobileno, d.smartcard, d.boxid, d.casname, d.productname, d.createddate];
              datas.push(row);
            });
            this.excelService.generatSmartcardSuspendExcel(areatitle, headers, datas, title, areasub, sub);
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

  getSmartcardSuspendPDF() {
    // this.swal.Loading();
    console.log(this.cur_date);
    this.userService.getAsonDateSuspendPDFReport(this.role, this.username, this.cur_date, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = ("SMARTCARD SUSPEND.pdf").toUpperCase();
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
  // ------------------------------------------------ SUSPEND REPORT FOR PARTICULAR DURATION------------------------------------
  getDatewiseSuspendReport() {
    // this.swal.Loading();
    this.userService.getSuspendReportByDurationExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
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

  getDatewiseSuspendExcel() {
    console.log(this.cur_date);

    this.userService.getSuspendReportByDurationExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:H2';
            areasub = 'A3:H3';
            const headers = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NO', 'SMARTCARD', 'BOX ID', 'CAS', 'PACKAGE', 'SUBSCRIPTION END DATE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.customername, d.mobileno, d.smartcard, d.boxid, d.casname, d.productname, d.createddate];
              datas.push(row);
            });
            this.excelService.generatSmartcardSuspendDurationExcel(areatitle, headers, datas, title, areasub, sub);
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

  getDatewiseSuspendPDF() {
    // this.swal.Loading();
    console.log(this.cur_date);
    this.userService.getSuspendReportByDurationPDFReport(this.role, this.username, this.fromdate, this.todate, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.reportTitle + ".pdf").toUpperCase();
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


  // ------------------------------------------------DATE WISE SMARTCARD SUSPEND------------------------------------
  getSuspendReport() {
    // this.swal.Loading();
    this.userService.getSuspendHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, this.smartcard, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
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

  getSuspendExcel() {
    console.log(this.cur_date);

    this.userService.getSuspendHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, this.smartcard, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle ).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            const headers = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NO', 'SMARTCARD', 'STATUS', 'SUSPEND DATE', 'RESUME DATE', 'OLD EXPIRY DATE', 'NEW EXPIRY DATE', 'REMAINING DAYS', 'CAS', 'PACKAGE'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.customername, d.mobileno, d.smartcard, d.status, d.createddate, d.updateddate, d.oldexpirydate, d.newexpirydate, d.remainingdays, d.casname, d.productname];
              datas.push(row);
            });
            this.excelService.generatSuspendExcel(areatitle, headers, datas, title, areasub, sub);
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

  getSuspendPDF() {
    // this.swal.Loading();
    console.log(this.cur_date);
    this.userService.getSuspendHistoryPDFReport(this.role, this.username, this.fromdate, this.todate, this.smartcard, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = ("DATE WISE SMARTCARD SUSPEND.pdf").toUpperCase();
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
  // ------------------------------------------------------------------------------------------------------------------------------------
  goBack(): void {
    this.location.back();
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
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
