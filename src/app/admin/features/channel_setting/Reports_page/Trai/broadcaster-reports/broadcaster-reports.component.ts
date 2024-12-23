import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-broadcaster-reports',
  templateUrl: './broadcaster-reports.component.html',
  styleUrls: ['./broadcaster-reports.component.scss']
})
export class BroadcasterReportsComponent implements OnInit {
  type: any;
  returndata: any;
  username: any;
  role: any;
  rowData: any;
  addonlist: any;
  alacartelist: any;
  baselist: any;
  msodetails: any;

  selectedDate: any = 0;
  selectedMonth: any = 0;
  selectedYear: any = 0;

  broadcasterid: any;
  broadcastername: any;
  selectedValue: any;

  months: any[] = [];
  years: any[] = [];
  Date: any[] = [];
  broadcasterList: any[] = [];
  filteredBraoadcasterList: any[] = [];
  searchTerm: any;
  isDateDisabled: boolean = true;

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

  constructor(private route: ActivatedRoute, private swal: SwalService, private excelService: ExcelService, private location: Location,
    public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService) {
    this.allType = this.route.snapshot.paramMap.get('id');
    console.log('dfdsfdsfdsf', this.allType);
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    // this.type = data.type
  }
  onNoClick(): void {
    // this.dialogRef.close(this.returndata);
  }
  ngOnInit(): void {
    this.userService.BroadcasterList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.broadcasterList = data.map((item: any) => ({
        name: item.broadcastername,
        value: item.id,
      }));
    })
    this.generateMonths();
    this.generateYears();
    this.setReportTitle();
    this.onColumnDefs();
  }

  setReportTitle() {
    switch (this.allType) {
      case '1':
        this.reportTitle = 'Monthly Broadcaster Report';
        break;
      case '2':
        this.reportTitle = 'Over All Product Report';
        break;
      case '3':
        this.reportTitle = 'Over All Base Product / Universal Count Report';
        break;
      case '4':
        this.reportTitle = 'Over All Base Product Report';
        break;
      case '5':
        this.reportTitle = 'Monthly Broadcaster Caswise Report';
        break;
      case '6':
        this.reportTitle = 'Channel Aging Report';
        break;
      case '7':
        this.reportTitle = 'Package Aging Report';
        break;
      default:
        this.reportTitle = 'Unknown Report';
    }
  }
  columnDefs = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, width: 90 },
    { headerName: 'PRODUCT NAME', field: 'productname', width: 350 },
    { headerName: 'PRODUCTID', field: 'casproductid', width: 340 },
    { headerName: 'CAS', field: 'casname', width: 340 },
    { headerName: 'SUBS COUNT AS 7TH	', field: 'w1', width: 350 },
    { headerName: 'SUBS COUNT AS 14TH	', field: 'w2', width: 350 },
    { headerName: 'AVERAGE', field: 'avg', width: 350 },
    { headerName: 'MONTH AND YEAR', field: 'monthyear', width: 350 },
  ]
  private onColumnDefs() {
    console.log('colmnDefs', this.allType);

    if (this.allType == '1') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 300 },
        { headerName: 'LOG DATE', field: 'logdate', width: 280 },
        { headerName: 'ACTION', field: 'activity', width: 200 },
        { headerName: 'REMARKS', field: 'remarks', width: 900 },
      ]
    } else if (this.allType == '2') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, width: 90 },
        { headerName: 'PRODUCT NAME', field: 'productname', width: 350 },
        { headerName: 'PRODUCTID', field: 'casproductid', width: 340 },
        { headerName: 'CAS', field: 'casname', width: 340 },
        { headerName: 'SUBS COUNT AS 7TH	', field: 'w1', width: 240 },
        { headerName: 'SUBS COUNT AS 14TH	', field: 'w2', width: 250 },
        { headerName: 'SUBS COUNT AS 21TH	', field: 'w3', width: 250 },
        { headerName: 'AVERAGE', field: 'avg', width: 350 },
        { headerName: 'MONTH AND YEAR', field: 'monthyear', width: 350 },
      ]
    }
    else if (this.allType == '6' || this.allType == '7') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'PRODUCT ID	', field: 'smartcard', width: 150 },
        { headerName: 'PRODUCT NAME', field: 'logdate', width: 200 },
        { headerName: 'CAS', field: 'activity', width: 150 },
        { headerName: '0-30', field: 'remarks', width: 120 },
        { headerName: '31-60', field: 'remarks', width: 120 },
        { headerName: '61-90', field: 'remarks', width: 120 },
        { headerName: '91-120', field: 'remarks', width: 100 },
        { headerName: '121-150', field: 'remarks', width: 100 },
        { headerName: '151-180', field: 'remarks', width: 100 },
        { headerName: '181-210', field: 'remarks', width: 100 },
        { headerName: '211-240', field: 'remarks', width: 100 },
        { headerName: '241-270', field: 'remarks', width: 100 },
        { headerName: '271-300', field: 'remarks', width: 100 },
        { headerName: '301-365', field: 'remarks', width: 100 },
      ]
    } else {
      console.warn('Unknown allType:', this.allType);
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredBraoadcasterList = this.filteredBraoadcaster();
  }
  filteredBraoadcaster(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.broadcasterList;
    }
    return this.broadcasterList.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSelectionFingerPrint(selectedValue: any) {
    console.log(selectedValue);
    this.broadcasterid = selectedValue.value;
    this.broadcastername = selectedValue.name;
    console.log(this.broadcastername);
    console.log(this.broadcasterid);
  }


  generateMonths() {
    this.months = [
      { value: '01', name: 'January' },
      { value: '02', name: 'February' },
      { value: '03', name: 'March' },
      { value: '04', name: 'April' },
      { value: '05', name: 'May' },
      { value: '06', name: 'June' },
      { value: '07', name: 'July' },
      { value: '08', name: 'August' },
      { value: '09', name: 'September' },
      { value: '10', name: 'October' },
      { value: '11', name: 'November' },
      { value: '12', name: 'December' }
    ];
  }
  onMonthChange() {
    if (this.selectedMonth !== '0') {
      const selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
      this.isDateDisabled = false;
      this.generateDates(selectedMonthName);
    } else {
      this.isDateDisabled = true;
      this.Date = [];
    }
  }
  generateDates(selectedMonthName: string) {
    this.Date = [
      { value: '01', name: '07 ' + selectedMonthName },
      { value: '02', name: '14 ' + selectedMonthName },
      { value: '03', name: '21 ' + selectedMonthName },
      { value: '04', name: 'All' }
    ];
  }



  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  goBack(): void {
    this.location.back();
  }

  getExcel() {

  }
  getPDF() {

  }
  // ---------------------------------------Universal report-------------------------

  getUniversalExcel() {
    this.userService.getUniversalExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 2)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.reportTitle);
            const title = (this.reportTitle).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            areatitle = 'A1:H2';
            areasub = 'A3:H3';
            const headers = ['S.NO', 'PACKAGE ID', 'PACKAGE NAME', 'CAS', 'AS ON 07th', 'AS ON 14th', 'AVERAGE', 'MONTH & YEAR'];
            this.rowData.forEach((d: any, index: number) => {
              const row = [index + 1, d.customername, d.mobileno, d.smartcard, d.boxid, d.casname, d.productname, d.createddate];
              datas.push(row);
            });
            this.excelService.generatUniversalExcel(areatitle, headers, datas, title, areasub, sub);
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
  getUniversalPDF() {
    this.userService.getUniversalPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 1)
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
  // ------------------------------------------------OverAll Report-------------------------------------------
  grtOverAllReport() {
    console.log('fdgdfgfdjgkfdj');

    this.userService.getOverAllExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 2)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.addonlist = response.body.addonList;
            this.alacartelist = response.body.alacartePackageList;
            this.baselist = response.body.basePackageList;
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
  // getOverAllExcel() {
  //   this.userService.getOverAllExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 2)
  //     .subscribe(
  //       (response: HttpResponse<any>) => {
  //         if (response.status === 200) {
  //           this.rowData = response.body;
  //           console.log(this.reportTitle);
  //           const title = (this.reportTitle).toUpperCase();
  //           const sub = 'MSO ADDRESS:' + this.msodetails;
  //           const subtitle = this.rowData;
  //           let areatitle = '';
  //           let areasub = '';
  //           let header: string[] = [];
  //           const datas: Array<any> = [];
  //           areatitle = 'A1:H2';
  //           areasub = 'A3:H3';
  //           const headers = ['S.NO', 'PACKAGE ID', 'PACKAGE NAME', 'CAS', 'AS ON 07th', 'AS ON 14th', 'AVERAGE', 'MONTH & YEAR'];
  //           this.rowData.forEach((d: any, index: number) => {
  //             const row = [index + 1, d.customername, d.mobileno, d.smartcard, d.boxid, d.casname, d.productname, d.createddate];
  //             datas.push(row);
  //           });
  //           this.excelService.generatUniversalExcel(areatitle, headers, datas, title, areasub, sub);
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

  getOverAllExcel() {
    this.userService.getOverAllExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 2)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            // this.rowData = response.body.addonList; // Extract addonList
            this.addonlist = response.body.addonList;
            this.alacartelist = response.body.alacartePackageList;
            this.baselist = response.body.basePackageList;

            console.log(this.reportTitle);
            const title = (this.reportTitle).toUpperCase();
            const sub = 'MSO ADDRESS: ' + this.msodetails;

            // Generate the unified Excel report
            this.excelService.generateExcelReport(this.addonlist, this.alacartelist, this.baselist, title, sub);

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

  getOverAllPDF() {
    this.userService.getOverAllPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 1)
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
