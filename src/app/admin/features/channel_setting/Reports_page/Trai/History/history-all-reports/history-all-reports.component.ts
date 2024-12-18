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

    this.onColumnDefs();
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    // this.getAllServicereport();
    // this.getPairedReport();
    // this.getBlockedReport();
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  setReportTitle() {
    switch (this.allType) {
      case '1':
        this.reportTitle = 'All Service Report';
        break;
      case '2':
        this.reportTitle = 'Total Smartcard List Report';
        break;
      case '3':
        this.reportTitle = 'Paired Smartcard/Boxid Report';
        break;
      case '4':
        this.reportTitle = 'Block List Report';
        break;
      case '5':
        this.reportTitle = 'Scroll History report';
        break;
      case '6':
        this.reportTitle = 'mail History report';
        break;
      case '7':
        this.reportTitle = 'Fingerprint History report';
        break;
      case '8':
        this.reportTitle = 'Message History report';
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

    if (this.allType == '1') {
      console.log('colmnDefs', this.allType, '1');
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 300 },
        { headerName: 'LOG DATE', field: 'logdate', width: 280 },
        { headerName: 'ACTION', field: 'activity', width: 200 },
        { headerName: 'REMARKS', field: 'remarks', width: 900 },
      ]
    } else if (this.allType == '3') {
      console.log('colmnDefs', this.allType, '3');

      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SUBSCRIBER ID', field: 'subid', width: 200 },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', width: 200 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 300 },
        { headerName: 'BOX ID', field: 'boxid', width: 250 },
        { headerName: 'ADDRESS', field: 'address', width: 350 },
        { headerName: 'INSTALLED DATE', field: 'createddate', width: 350 },
      ]
    } else if (this.allType == '4') {
      console.log('colmnDefs', this.allType, '4');

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
      console.log('colmnDefs', this.allType, '5');

      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'INTEND ID', field: 'intendid', width: 150 },
        { headerName: 'INTENT TO', field: 'intendto', width: 200 },
        { headerName: 'MESSAGE', field: 'scrollmessage', width: 200 },
        { headerName: 'FONT COLOR	', field: 'scrollcolordisplay', width: 200 },
        { headerName: 'BACKGROUND COLOR	', field: 'scrollbgcolordisplay', width: 150 },
        { headerName: 'FONT SIZE', field: 'fontsize', width: 200 },
        { headerName: 'POSITION', field: 'scrollposition', width: 150 },
        { headerName: 'REPEAT FOR	', field: 'repeatfor', width: 200 },
        { headerName: 'CREATED DATE', field: 'createddate', width: 200 },
      ]
    }
    else {
      console.warn('Unknown allType:', this.allType);
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  // ---------------------------------------ALL SERVICE----------------------
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
  getAllServicereport() {
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
            const title = (this.reportTitle).toUpperCase();
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
            const title = (this.reportTitle).toUpperCase();
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
            const title = (this.reportTitle).toUpperCase();
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
  getScrollExcel() {
    // this.swal.Loading();
    this.userService.getScrollHistoryExcelReport(this.role, this.username, this.fromdate, this.todate, 2)
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
  // ------------------------------------------------------------------------------------------------
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
