import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { HttpResponse } from '@angular/common/http';
import { SwalService } from 'src/app/_core/service/swal.service';

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

  selectedDate: any;
  isDateEnabled: boolean = false;
  isMonthYearEnabled: boolean = false;
  isYearEnabled: boolean = false;
  type: any = '0';
  selectedTab: any = '1';


  selectedMonth: any = 0;
  selectedYear: any = 0;


  isCheckboxChecked: boolean = false;
  smartcard: any;
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
  rowData: any;
  Totalamount: any;
  selectedDateType: number = 0;
  Date: any[] = [
    // { lable: "", value: 0 },
    { lable: "Datewise", value: 1 },
    { lable: "Monthwise", value: 2 },
    { lable: "Yearwise", value: 3 },
  ];
  // month: any= '0';
  // year: any= '0';
  months: any[] = [];
  years: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  @ViewChild('agGrid') agGrid: any;
  showDropdown: boolean = false;
  operatorname: any = 'Select Filter';
  filteredOperators: any[] = [];
  operator_details: any = [];

  columnDefs: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, public dialog: MatDialog, private dateAdapter: DateAdapter<Moment>, private cdr: ChangeDetectorRef) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.operatorList
    })
  }
  ngOnInit(): void {
    this.generateMonths();
    this.generateYears();
    this.getrefundData('');
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
    // const startYear = 2012;
    // const currentYear = new Date().getFullYear();
    // for (let year = startYear; year <= currentYear; year++) {
    //   this.years.push(year);
    // }
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    this.years = []; // Initialize the array

    // Push years in descending order from currentYear to startYear
    for (let year = currentYear; year >= startYear; year--) {
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
    if (selectedValue == 0) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
    } else if (selectedValue == 1) {
      this.isDateEnabled = true;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
    } else if (selectedValue == 2) {
      this.isMonthYearEnabled = true;
      this.isDateEnabled = false;
      this.isYearEnabled = false;
    } else if (selectedValue == 3) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = true;
    }
  }
  // operatorlist() {
  //   this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
  //     console.log(data);
  //     this.operatorList = Object.keys(data).map(key => {
  //       const value = data[key];
  //       const name = key;
  //       return { name: name, value: value };
  //     });
  //     this.filteredOperators = this.operatorList
  //   })
  // }
  selectTab(tab: string) {
    console.log('dsfsdfdsf', tab);
    this.operatorid = '';
    this.operatorname = '';

    this.selectedTab = tab;
    this.rowData = [];
    if (this.agGrid) {
      let newRowData;

      if (this.selectedTab === '1') {
        newRowData = this.getrefundData('1');
      } else if (this.selectedTab === '2') {
        newRowData = this.getLogrechargeReport('2');
      } else if (this.selectedTab === '3') {
        newRowData = this.getRechargeLog('3');
      }
      this.agGrid.api.setRowData(newRowData);
    }
  }
  filterOperators() {
    console.log(this.operatorname);

    if (this.operatorname) {
      console.log(this.filteredOperators);
      this.filteredOperators = this.operatorList.filter(operator =>
        operator.name.toLowerCase().includes(this.operatorname.toLowerCase())
      );
      console.log(this.filteredOperators);
    }

  }
  selectOperator(value: string, name: any) {

    console.log(this.filteredOperators);
    this.showDropdown = false;
    this.operatorid = value;
    this.operatorname = name;
    this.onoperatorchange({ value });
    this.selectoperatorList();
  }

  onoperatorchange(event: any) {

    if (this.operatorid === 'ALL Operator') {
      this.operatorid = 0;
    }
    this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        console.log(data);
        this.operator_details = data;
        console.log(this.operator_details);
      },
      (error) => {
        console.error('Error fetching operator details', error);
      }
    );
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  getrefundData(event: any) {
    this.userservice.getRechargeDetailsByFdTdOpid(this.role, this.username, this.fromdate, this.todate, 0)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.updateColumnDefs(this.selectedTab);
            // this.swal.Success_200();
          } else if (response.status === 204) {
            // this.swal.Success_204();
            this.rowData = [];
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
    return [this.rowData];

  }
  getLogrechargeReport(event: any) {
    this.updateColumnDefs(this.selectedTab);
    return [this.rowData];
  }
  getRechargeLog(event: any) {
    this.updateColumnDefs(this.selectedTab);
    return [this.rowData];
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  RefundAmount() {
    this.rowData = [];
    this.swal.Loading();
    this.userservice.getRefundListByOperatorIdAndSmartcard(this.role, this.username, this.operatorid, this.smartcard)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
            this.rowData = response.body;
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.swal.Success_204();
          }
        },
        (error) => {
          if (error.status === 400) {
            this.swal.Error_400();
          } else if (error.status === 500) {
            this.swal.Error_500();
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );

  }
  selectoperatorList() {
    this.rowData = [];
    this.swal.Loading();
    this.userservice.getRefundListByOperatorId(this.role, this.username, this.operatorid, 'false')
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
            this.rowData = response.body;
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.swal.Success_204();
          }
        },
        (error) => {
          if (error.status === 400) {
            this.swal.Error_400();
          } else if (error.status === 500) {
            this.swal.Error_500();
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );

  }

  LogRechargeReport() {
    this.rowData = [];
    if (this.isDateEnabled) {
      const formattedDate = this.formatDate(this.date);
      this.userservice.getRechargeDetailsByDate(this.role, this.username, formattedDate)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              const responseBody = response.body;
              if (responseBody) {
                this.rowData = responseBody.rechargelist;
                this.Totalamount = responseBody.totalamount;
                console.log(this.rowData);
                this.swal.Success_200();
                this.updateColumnDefs(this.selectedTab);
              } else {
                Swal.fire('Error', 'Response body is empty', 'error');
              }
            } else if (response.status === 204) {
              this.swal.Success_204();
            }
          },
          (error) => {
            this.handleApiError(error);
          }
        );
    } else if (this.isMonthYearEnabled) {
      this.userservice.getRecharegDetailsByYearAndMonth(this.role, this.username, this.selectedYear, this.selectedMonth)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              const responseBody = response.body;
              if (responseBody) {
                this.rowData = responseBody.rechargelist;
                this.Totalamount = responseBody.totalamount;
                console.log(this.rowData);
                this.swal.Success_200();
                this.updateColumnDefs(this.selectedTab);
              } else {
                Swal.fire('Error', 'Response body is empty', 'error');
              }
            } else if (response.status === 204) {
              this.swal.Success_204();
            }
          },
          (error) => {
            this.handleApiError(error);
          }
        );
    }
    else if (this.isYearEnabled) {
      this.userservice.getRechargeDetailsByYear(this.role, this.username, this.selectedYear)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              const responseBody = response.body;
              if (responseBody) {
                this.rowData = responseBody.rechargelist;
                this.Totalamount = responseBody.totalamount;
                console.log(this.rowData);
                this.swal.Success_200();
              } else {
                Swal.fire('Error', 'Response body is empty', 'error');
              }
            } else if (response.status === 204) {
              this.swal.Success_204();
            }
          },
          (error) => {
            this.handleApiError(error);
          }
        );

    }
  }
  RechargeLog() {
    this.rowData = [];
    this.swal.Loading();

    this.userservice.getRechargeDetailsByFdTdOpid(this.role, this.username, this.fromdate || null, this.todate || null, this.operatorid)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.updateColumnDefs(this.selectedTab);
            this.swal.Success_200();
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



  handleApiError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }


  private updateColumnDefs(tab: string): void {
    if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
        },
        { headerName: "OPERATOR NAME", field: 'operatorname', },
        { headerName: "TRANSACTION GROUP TYPE", field: 'transactiongroupname', },
        { headerName: "AMOUNT", field: 'lcoamount', },
        { headerName: "REMARKS", field: 'transactionremarks' },
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
        { headerName: "AMOUNT", field: 'lcoamount', },
        { headerName: "REMARKS", field: 'transactionremarks' },
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
        { headerName: "CURRENT BALANCE	", field: 'currentbalance', },
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




