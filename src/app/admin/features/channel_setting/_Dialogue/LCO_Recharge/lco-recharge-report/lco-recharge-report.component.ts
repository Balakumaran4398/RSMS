import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import Swal from 'sweetalert2';
import { BulkRechargeComponent } from '../bulk-recharge/bulk-recharge.component';
import { MatDialog } from '@angular/material/dialog';
import { NewRechargeComponent } from '../new-recharge/new-recharge.component';
import { RefundComponent } from '../refund/refund.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS: MatDateFormats = {
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

export const MY_FORMATS1: MatDateFormats = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-lco-recharge-report',
  templateUrl: './lco-recharge-report.component.html',
  styleUrls: ['./lco-recharge-report.component.scss'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  //   },

  // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS1 },
  // ],
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,


})
export class LcoRechargeReportComponent implements OnInit {

  maxDate = new Date();
  fromdate: any;
  todate: any;
  selectedTab: any = '1';

  selectedDate: any;
  isDateEnabled: boolean = true;
  isMonthYearEnabled: boolean = false;
  isYearEnabled: boolean = false;
  type: any;

  isCheckboxChecked: boolean = false;
  smartcard: any = 0;
  selectTab(tab: string) {
    this.selectedTab = tab;
    console.log(this.selectedTab);
    this.updateColumnDefs(this.selectedTab);

  }
  // date = new FormControl(moment());
  date: any;
  operatorid: any = 0;
  operatorList: any[] = [];
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  role: any;
  username: any;
  rowData: any[] = [];
  Totalamount: any;
  Date: any[] = [
    { lable: "Datewise", value: 1 },
    { lable: "Monthwise", value: 2 },
    { lable: "Yearwise", value: 3 },
  ];
  months: { value: string, name: string }[] = [];
  years: number[] = [];
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
    },
    { headerName: "OPERATOR NAME", field: 'operatorname', },
    { headerName: "TRANSACTION GROUP TYPE", field: 'transactiongroupname', },
    { headerName: "AMOUNT", field: 'amount', },
    { headerName: "REMARKS1", field: 'transactionremarks' },
    { headerName: "TRANSACTION DATE", field: 'transactiondate' },
    { headerName: "BILL", field: '', filter: false },

  ]

  private showLoading() {
    Swal.fire({
      title: 'Loading...',
      text: 'Fetching data, please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }


  constructor(private userservice: BaseService, private storageservice: StorageService, public dialog: MatDialog, private dateAdapter: DateAdapter<Moment>, private cdr: ChangeDetectorRef) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }
  ngOnInit(): void {
    this.generateMonths();
    this.generateYears();
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

  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
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
  onChangeDateType(selectedValue: any) {
    this.isDateEnabled = false;
    this.isMonthYearEnabled = false;
    this.isYearEnabled = false;
    if (selectedValue == 1) {
      this.isDateEnabled = true;
    } else if (selectedValue == 2) {
      this.isMonthYearEnabled = true;
    } else if (selectedValue == 3) {
      this.isYearEnabled = true;
    }
  }

  LogRechargeReport() {
    console.log(this.isDateEnabled);
    console.log(this.isMonthYearEnabled);
    console.log(this.isYearEnabled);

    if (this.isDateEnabled) {
      const formattedDate = this.formatDate(this.date);
      this.userservice.getRechargeDetailsByDate(this.role, this.username, formattedDate).subscribe((res: any) => {
        this.rowData = res.rechargelist;
        this.Totalamount = res.totalamount;

      });
    } else if (this.isMonthYearEnabled) {
      this.userservice.getRecharegDetailsByYearAndMonth(this.role, this.username, this.years, this.months).subscribe((res: any) => {
        this.rowData = res.rechargelist;
        this.Totalamount = res.totalamount;

      });
    }
    else if (this.isYearEnabled) {
      this.userservice.getRechargeDetailsByYear(this.role, this.username, this.years).subscribe((res: any) => {
        this.rowData = res.rechargelist;
        this.Totalamount = res.totalamount;
      });
    }
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  changeDateFormat(format: MatDateFormats | null) {
    if (format) {
      this.dateAdapter.setLocale('en');
      this.dateAdapter.setLocale('en');
      this.dateAdapter.setLocale({ ...format.display });
    }
  }

  RefundAmount() {
    this.userservice.getRefundListByOperatorIdAndSmartcard(this.role, this.username, this.operatorid, this.smartcard).subscribe((response: any) => {
      Swal.close();
      console.log(response);
      this.rowData = response
      console.log(response);

    },
      (error) => {
        this.handleErrorResponse(error);
      }
    );
  }

  RechargeLog() {
    this.showLoading();
    this.userservice.getRechargeDetailsByFdTdOpid(this.role, this.username, this.fromdate, this.todate, this.operatorid)
      .subscribe(
        (response: any) => {
          Swal.close();
          console.log(response);
          this.rowData = response
          // this.handleSuccessResponse(response);
          console.log(response);
        },
        (error) => {
          this.handleErrorResponse(error);
        }
      );
  }



  private handleSuccessResponse(response: any) {
    if (response && response.status) {
      switch (response.status) {
        case 200:
          if (response.data && response.data.length > 0) {
            this.rowData = response.data;
            this.cdr.detectChanges();  // Force Angular to detect the change
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data successfully loaded!',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Data',
              text: 'No data available in the response.',
              timer: 1500,
              showConfirmButton: false
            });
          }
          break;

      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Response',
        text: 'The response did not contain a valid status code or data.',
      });
    }
  }
  private handleErrorResponse(error: any) {
    Swal.close();  // Close any previous SweetAlert dialogs
    switch (error.status) {
      case 400:
        Swal.fire({
          icon: 'error',
          title: 'Bad Request',
          text: 'The request was invalid. Please check your input.',
        });
        break;

      case 401:
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not authorized to access this resource.',
        });
        break;

      case 404:
        Swal.fire({
          icon: 'error',
          title: 'Not Found',
          text: 'The requested resource was not found.',
        });
        break;

      case 500:
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'An error occurred on the server. Please try again later.',
        });
        break;

      default:
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An unexpected error occurred: ${error.message}`,
        });
        break;
    }
    console.error('Error:', error);  // Log the error for debugging purposes
  }

  private updateColumnDefs(tab: string): void {
    if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "OPERATOR NAME", field: 'operatorname', },
        { headerName: "TRANSACTION GROUP TYPE", field: 'transactiongroupname', },
        { headerName: "AMOUNT", field: 'amount', },
        { headerName: "REMARKS1", field: 'transactionremarks' },
        { headerName: "TRANSACTION DATE", field: 'transactiondate' },
        { headerName: "BILL", field: '', filter: false },
      ]
    } else if (tab === '2') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "OPERATOR NAME", field: 'operatorname', },
        { headerName: "OPERATOR ID", field: 'operatorid', },
        { headerName: "AMOUNT", field: 'amount', },
        { headerName: "REMARKS1", field: 'transactionremarks' },
        { headerName: "TRANSACTION DATE", field: 'transactiondate' },
        { headerName: "OPERATOR ADDRESS	", field: 'address', },
        { headerName: " CONTACT NUMBER", field: 'contactnumber', },
      ]
    } else if (tab === '3') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "OPERATOR NAME", field: 'operatorname', },
        { headerName: "REFUND AMOUNT	", field: 'amount', },
        { headerName: "CURRENT BALANCE	", field: 'balance', },
        { headerName: "REFERENCE ID	", field: 'referenceid' },
        { headerName: "TRANSACTION DATE", field: 'transactiondate' },
        {
          headerName: "REFUND", editable: true, cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(2 85 13)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "28px";
            editButton.addEventListener('click', () => {
              this.openEditDialog(params.data);
            });
            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
      ]
    }
  }

  BulkRecharge() {
    const dialogRef = this.dialog.open(BulkRechargeComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      // data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  NewRecharge() {
    const dialogRef = this.dialog.open(NewRechargeComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      // data: dataToSend
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditDialog(data: any): void {
    console.log(data);

    const dialogRef = this.dialog.open(RefundComponent, {
      width: '500px',
      // height: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }
}




