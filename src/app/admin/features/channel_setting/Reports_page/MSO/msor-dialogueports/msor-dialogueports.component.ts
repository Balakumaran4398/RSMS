import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LogarithmicScale } from 'chart.js';
import { AgGridAngular } from 'ag-grid-angular';
declare var $: any;
export interface SubscriberData {
  smartcard: string;
  date: string;
  expiryDate: string;
  package: string;
  plan: number;
  amount: number;
}

@Component({
  selector: 'app-msor-dialogueports',
  templateUrl: './msor-dialogueports.component.html',
  styleUrls: ['./msor-dialogueports.component.scss']
})


export class MsorDialogueportsComponent implements OnInit, OnDestroy {
  type: any;
  username: any;
  role: any;
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

  selectedDate: any;
  selectedDateType: any = '';

  selectedMonth: any = 0;
  selectedYear: any = 0;
  selectedType: any = 3;
  selectedStatus: any = 3;
  selectedAmount: any = 4;

  smartcard: any;
  smartcard1: any;
  useragent: any = 0;

  filteredOperators: any[] = [];
  filteredSubLcoList: any[] = [];
  lco_list: any[] = [];
  sublco_list: any[] = [];
  selectedOperator: any;
  selectedLco: any
  selectedOperator1: any

  selectedUser: any

  public rowSelection: any = "multiple";

  userlist: any[] = [];
  filtereduserlist: any[] = [];

  selectedSubOperator: any;
  selectedLcoName: any = 0;
  selectedSubLcoName: any = 0;
  submitted: boolean = false;

  isSmartcard: boolean = false;
  isOperator: boolean = false;
  isRechargeOperator: boolean = false;
  isUseragent: boolean = false;
  isSubLCO: boolean = false;
  selectedRechargeType: any = 1;
  isDateEnabled: boolean = false;
  isMonthYearEnabled: boolean = false;
  isYearEnabled: boolean = false;


  today = new Date();
  selectedOnlineType: any = 1;

  showDropdown: boolean = true;
  subscriberList: any[] = [];
  subscriber: any;


  LcoTransfer: any[] = [
    { label: "LCO", value: 1 },
    { label: "SMARTCARD", value: 2 },
    { label: "DATE", value: 3 },
  ];
  Date: any[] = [
    { label: "Datewise", value: 1 },
    { label: "Monthwise", value: 2 },
    // { label: "Yearwise", value: 3 },
  ];
  Date1: any[] = [
    { label: "Datewise", value: 2 },
    { label: "Monthwise", value: 1 },
    // { label: "Yearwise", value: 3 },
  ];
  RechargeType: any[] = [
    { label: "Operator", value: 1 },
    { label: "Smartcard", value: 2 },
    { label: "All", value: 3 },
  ]

  TypeIncluding: any[] = [
    { label: "ALL", value: 3 },
    { label: "RECHARGE", value: 1 },
    { label: "DEDUCTION", value: 6 },
  ];
  TypeExcluding: any[] = [
    { label: "ALL", value: 3 },
    { label: "RECHARGE", value: 1 },
    { label: "DEDUCTION", value: 6 },
  ];
  UserAgent: any[] = [

    { label: "MSO", value: 1 },
    { label: "LCO APP", value: 2 },
    { label: "LCO WEB", value: 3 },
    { label: "SUB LCO", value: 4 },
    { label: "SUBSCRIBER", value: 5 },
  ];
  Status: any[] = [
    { label: "ALL", value: 3 },
    { label: "ONLINE", value: 1 },
    { label: "OFFLINE", value: 2 },
  ]
  onlineType: any[] = [
    { label: "OPERATOR", value: 1 },
    { label: "SUBLCO", value: 2 },
    { label: "SUBSCRIBER", value: 3 },

  ]
  Amount: any[] = [
    { label: "CHEQUE", value: 0 },
    { label: "CASH", value: 1 },
    { label: "ACCOUNT TRANSFER", value: 2 },
    { label: "ONLINE", value: 3 },
    { label: "ALL", value: 4 },
  ]
  casList: any[] = [
    { label: "RCAS", value: 1 },
    { label: "ALL CAS", value: 0 },

  ]
  date: any;
  months: any[] = [];
  years: any[] = [];

  fromdate: any;
  todate: any;
  rowData: any[] = []
  rowData1: any[] = []
  columnDefs: any[] = []
  columnDefs2: any[] = []
  columnDefs3: any[] = []
  columnDefslcoExpiry: any[] = []

  gridApi: any;
  // --------------------lcowiseactive report-----------
  selectedlcocas: any = '0';
  selectedlcoModel: any = '0';
  batch: boolean = false;

  selectedLcotransfer: any = '';
  isLcoOperator: boolean = false;
  isLcoSmartcard: boolean = false;
  // ---------------Model List---------------------------------
  modelname: any;
  model: any;
  currentMonth: any;
  // --------------------------------------------
  selectedMonthName: any;
  selectedDateMonthName: any;
  constructor(private route: ActivatedRoute, private location: Location,
    public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService, private swal: SwalService) {
    this.type = this.route.snapshot.paramMap.get('id');
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(this.type);
    this.selectedOperator = { name: 'All Operator', value: 0 };
    this.selectedOperator1 = { name: 'All Operator', value: 0 };
    this.selectedLcoName = this.selectedOperator.name;
    this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
    console.log('selectedDate', this.selectedDate);

    if (this.type == 'total_lco') {
      this.getTotalOperatorReport();
    } else {

    }
  }

  // -----------------------------------------------------------------subscriber bill varaibales-------------------------------





  ngOnInit(): void {
    // this.setReportTitle();
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());

    this.onColumnDefs();
    this.generateMonths();
    this.generateYears();
    this.operatorList();
    // this.subLcoList('')
    this.onRechargeType(this.selectedRechargeType);

    this.onOnlineType(this.selectedOnlineType)
    console.log(this.selectedRechargeType);
    console.log(this.selectedOnlineType);

    this.onDateChange();


    this.onModelList();

    // this.onGridReady1();




  }
  ngOnDestroy(): void {
    ($('#operator') as any).select2('destroy');
    ($('#subLco') as any).select2('destroy');
  }
  ngAfterViewInit() {
    $('#operator').select2({
      placeholder: 'Select a Operator',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      this.selectedLcoName = event.target.value;
      this.onSubscriberStatusChange(this.selectedLcoName);
    });
    $('#subLco').select2({
      placeholder: 'Select Sub Lco',
      allowClear: true
    });
    $('#subLco').on('change', (event: any) => {
      this.selectedSubLcoName = event.target.value;
      this.onSublcochange(this.selectedSubLcoName);
    });

  }
  onDateChange() {
    if (this.type == 'online_payment') {
      this.getToDate(null);
      this.getFromDate(null);
      this.getOnline();
      this.isOperator = true;
    } else {
      this.isOperator = false
    }
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
  getMonthNameFromDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthObject = this.months.find(m => m.value === month);
    return monthObject ? monthObject.name : '';
  }

  logValues(event: any): void {
    this.selectedDate = event.target.value;
    this.selectedDateMonthName = this.getMonthNameFromDate(this.selectedDate);
    console.log('Selected Date:', this.selectedDate);
    console.log('Selected Month:', this.selectedDateMonthName);
    this.onColumnDefs();
  }
  onMonthChange(event: any) {
    if (this.selectedMonth !== '0') {
      this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
    }
    console.log(this.selectedMonthName);
    this.checkDataForBill();
    this.onColumnDefs();
  }
  getSelectedDateMonth(): string {
    return this.selectedDateMonthName || '';
  }
  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }

  onModelList() {
    this.userService.getModelList(this.username, this.role).subscribe((data: any) => {
      this.model = data;
      this.modelname = data.modelname;
    })
  }
  onChangeDateType(selectedValue: any) {
    if (selectedValue == 0) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
      this.fromdate = 0;
      this.todate = 0;
    } else if (selectedValue == 1) {
      this.isDateEnabled = true;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
      this.fromdate = 0;
      this.todate = 0;
    } else if (selectedValue == 2) {
      this.isMonthYearEnabled = true;
      this.isDateEnabled = false;
      this.isYearEnabled = false;
      this.fromdate = 0;
      this.todate = 0;
    } else if (selectedValue == 3) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = true;
      this.fromdate = 0;
      this.todate = 0;
    }
  }
  onChangeDateType1(selectedValue: any) {
    if (selectedValue == 2) {
      this.isDateEnabled = true;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
      this.fromdate = 0;
      this.todate = 0;
    } else if (selectedValue == 1) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = true;
      this.isYearEnabled = true;
      this.fromdate = 0;
      this.todate = 0;
    }
  }

  onChangeLcoTransferType(selectedValue: any) {
    if (selectedValue == 1) {
      this.isDateEnabled = false;
      this.isLcoOperator = true;
      this.isLcoSmartcard = false;
      this.smartcard1 = 0;
      this.fromdate = 0;
      this.todate = 0;
    } else if (selectedValue == 2) {
      this.isDateEnabled = false;
      this.isLcoOperator = false;
      this.isLcoSmartcard = true;
      this.fromdate = 0;
      this.todate = 0;
      this.selectedOperator.value = 0;
    } else if (selectedValue == 3) {
      this.isDateEnabled = true;
      this.isLcoOperator = false;
      this.isLcoSmartcard = false;
      this.smartcard1 = 0;
      this.fromdate = 0;
      this.todate = 0;
      this.selectedOperator.value = 0;
    }
  }
  rechargeOperatorValue: any;
  onRechargeType(selectedValue: any) {
    console.log(selectedValue);
    this.rechargeOperatorValue = selectedValue;
    console.log(this.rechargeOperatorValue);


    if (selectedValue == 1) {
      console.log('dfsfdsfdsf', this.isOperator);
      this.isSmartcard = false;
      this.isRechargeOperator = true;
      this.isUseragent = true;
      this.isSubLCO = false;

      this.selectedLcoName = 0;
      this.selectedSubLcoName = 0;
      this.useragent = 0;
      this.smartcard = '';
    } else if (selectedValue == 2) {
      this.isSmartcard = true;
      this.isRechargeOperator = false;
      this.isUseragent = true;
      this.isSubLCO = false;
      // this.fromdate = 0;
      // this.todate = 0;
      this.selectedLcoName = 0;
      this.selectedSubLcoName = 0;
      this.useragent = 0;
      this.smartcard = '';
    } else if (selectedValue == 3) {
      this.isSmartcard = false;
      this.isRechargeOperator = true;
      this.isUseragent = false;
      this.isSubLCO = false;

      // this.fromdate = 0;
      // this.todate = 0;
      this.selectedLcoName = 0;
      this.selectedSubLcoName = 0;
      this.useragent = 0;
      this.smartcard = '';

    } else {
      return
    }
    console.log(this.rechargeOperatorValue);
    this.columnDefs2 = this.rechargeOperatorValue == 3
      ? [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'CUSTOMER NAME', field: 'customername', width: 150 },
        { headerName: 'AREA ID', field: 'dummyarea', width: 150, cellStyle: { textAlign: 'center' } },
        { headerName: 'CUSTOMER NO', field: 'customerno', width: 150, cellStyle: { textAlign: 'center' } },
        { headerName: 'SMARTCARD', field: 'referenceid', width: 200 },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 150 },
        { headerName: 'ACTION', field: 'remarks2', width: 150 },
        { headerName: 'TRANSACTION TYPE', field: 'remarks', width: 150, cellStyle: { textAlign: 'center' } },
        { headerName: 'DAYS', field: 'days', width: 120, cellStyle: { textAlign: 'center' } },
        { headerName: 'DISOLDBALANCE', field: 'disoldbalance', width: 120, cellStyle: { textAlign: 'center' } },
        { headerName: 'DISAMOUNT', field: 'disamount', width: 120, cellStyle: { textAlign: 'center' } },
        { headerName: 'DISCURRENTBALANCE', field: 'disnewbalance', width: 120, cellStyle: { textAlign: 'center' } },
        { headerName: 'SUBLCOOLDBALANCE', field: 'sublcooldbalance', width: 120, cellStyle: { textAlign: 'center' } },
        { headerName: 'SUBLCOAMOUNT', field: 'sublcoamount', width: 120, cellStyle: { textAlign: 'center' } },
        { headerName: 'SUBLCONEWBALANCE', field: 'sublconewbalance', width: 120, cellStyle: { textAlign: 'center' } },
        {
          headerName: 'BEFORE BALANCE', field: 'oldbalance', width: 150, cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        {
          headerName: 'LCO AMOUNT', field: 'lcoamount', width: 150, cellStyle: { textAlign: 'center', color: 'green' },
          valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        {
          headerName: 'AFTER BALANCE', field: 'currentbalance', width: 150, cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        { headerName: 'TRANSACTION DATE', field: 'transactiondate', width: 150 },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 150 },
        {
          headerName: 'USER AGENT', field: 'useragent', width: 150,
          valueGetter: (params: any) => {
            const useragent = params.data.useragent || '';
            const remarks1 = params.data.remarks1 || '';
            const operatorname = params.data.operatorname || '';
            return `${useragent} -[( ${operatorname})-( ${remarks1})]`;
          },
        },
        { headerName: 'ADDRESS', field: 'address', width: 150 },
        { headerName: 'AREA NAME', field: 'areaname', width: 150 },
        { headerName: 'COMMENT', field: 'comment', width: 150 },
      ]
      : [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'CUSTOMER NAME', field: 'customername', width: 150 },
        { headerName: 'AREA ID', field: 'dummyarea', width: 150, cellStyle: { textAlign: 'center' } },
        { headerName: 'CUSTOMER NO', field: 'customerno', width: 150, cellStyle: { textAlign: 'center' } },
        { headerName: 'SMARTCARD', field: 'referenceid', width: 200 },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 150 },
        { headerName: 'ACTION', field: 'remarks2', width: 150 },
        { headerName: 'TRANSACTION TYPE', field: 'remarks', width: 150, cellStyle: { textAlign: 'center' } },
        { headerName: 'DAYS', field: 'days', width: 120, cellStyle: { textAlign: 'center' } },
        {
          headerName: 'BEFORE BALANCE', field: 'oldbalance', width: 150, cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        // { headerName: 'LCO AMOUNT', field: 'lcoamount', width: 150, cellStyle: { textAlign: 'center', color: 'green' } },
        {
          headerName: 'LCO AMOUNT', field: 'lcoamount', width: 150, cellStyle: { textAlign: 'center', color: 'green' },
          valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        {
          headerName: 'AFTER BALANCE', field: 'currentbalance', width: 150, cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        { headerName: 'TRANSACTION DATE', field: 'transactiondate', width: 150 },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 150 },
        {
          headerName: 'USER AGENT', field: 'useragent', width: 150,
          valueGetter: (params: any) => {
            const useragent = params.data.useragent || '';
            const remarks1 = params.data.remarks1 || '';
            const operatorname = params.data.operatorname || '';
            return `${useragent} -[( ${operatorname})-( ${remarks1})]`;
          },
        },
        { headerName: 'ADDRESS', field: 'address', width: 150 },
        { headerName: 'AREA NAME', field: 'areaname', width: 150 },
        { headerName: 'COMMENT', field: 'comment', width: 150 },
      ];
  }

  onUserAgentType(selectedValue: any) {
    console.log(selectedValue);

    if (selectedValue == 1) {
      this.isSubLCO = false;
    } else if (selectedValue == 2) {
      this.isSubLCO = false;
    } else if (selectedValue == 3) {
      this.isSubLCO = false;
    } else if (selectedValue == 4) {
      this.isSubLCO = true;
    } else if (selectedValue == 5) {
      this.isSubLCO = false;
    }
  }


  onOnlineType(selectedValue: any) {
    this.selectedOnlineType = selectedValue;
    console.log(selectedValue);
    console.log('ONLINE PAYMENT');
    this.onlinePayment();
    if (selectedValue == 1) {
      this.isSmartcard = false;
      this.isOperator = true;
      this.isSubLCO = false;
      this.fromdate = 0;
      this.todate = 0;
      this.selectedLcoName = 0;
      console.log(this.selectedLcoName)
      this.selectedSubLcoName = 0;
      // setTimeout(() => {
      $('#operator').val(this.selectedLcoName).trigger('change');
      // }, 100);
      // this.smartcard = '';
    } else if (selectedValue == 2) {
      this.isSmartcard = false;
      this.isOperator = true;
      this.isSubLCO = true;
      this.fromdate = 0;
      this.todate = 0;
      this.selectedLcoName = 0;
      this.selectedSubLcoName = 0;
      // setTimeout(() => {
      $('#operator').val(this.selectedLcoName).trigger('change');
      $('#subLco').val(this.selectedSubLcoName).trigger('change');
      // }, 100);
    } else if (selectedValue == 3) {
      this.isSmartcard = true;
      this.isOperator = false;
      this.isSubLCO = false;
      this.fromdate = 0;
      this.todate = 0;
      this.selectedLcoName = 0;
      this.selectedSubLcoName = 0;
      // setTimeout(() => {
      $('#operator').val(this.selectedLcoName).trigger('change');
      // }, 100);
    }
  }
  // ------------------------------------------------------------------------------------------
  operatorList() {
    this.userService.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.lco_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.lco_list;
    })
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);

  }

  filterUsers(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filtereduserlist = this.userlist.filter(sub =>
      sub.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);

  }

  filterSubLco(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredSubLcoList = this.sublco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredSubLcoList);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  displaysublco(operator: any): string {
    return operator ? operator.name : '';
  }

  displayUser(user: any): string {
    return user ? user.name : '';
  }






  // ========================================================================
  subLcoList(event: any) {
    console.log(event);

    this.filteredSubLcoList = [];

    this.userService.getAllSublcoList(this.role, this.username, event)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200 && response.body) { // Ensure the body exists
            this.sublco_list = response.body.map((item: any) => ({
              operatorId: item.retailerId,
              retailerName: item.retailerName,
            }));
            console.log(this.sublco_list);

            this.filteredSubLcoList = this.sublco_list;
          } else if (response.status === 204) {
            // this.swal.Success_204();
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
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;

    this.selectedSubLcoName = 0;
    // if (this.type == 'online_payment') {
    //   this.subLcoList(this.selectedOperator)
    // } else 
    if (this.type == 'recharge_deduction_excluding') {

    } else if (this.type == 'lcoinvoice') {

    }
    else {
      this.subLcoList(this.selectedOperator.value)
    }
  }
  onSubscriberLcoChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedLco = selectedOperator;
    this.selectedLco = selectedOperator.name;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
    console.log(this.selectedLco);
    console.log(this.type);
    console.log(this.selectedOperator);

    this.selectedSubLcoName = '';

  }
  onSublcochange(selectedOperator: any) {
    console.log(selectedOperator);
    // this.filteredSubLcoList = [];

    this.selectedSubOperator = selectedOperator;
    this.selectedSubLcoName = selectedOperator.operatorId;
    console.log(this.selectedSubLcoName);
  }
  onOperatorStatusChange(selectedOperator: any) {
    if (selectedOperator.value === 0) {
      this.selectedLcoName = 0;
      this.selectedOperator = selectedOperator;
      console.log(this.selectedOperator);

    } else {
      this.selectedLcoName = 0;
    }
  }
  onOperatorBandwidth(selectedOperator: any) {
    if (selectedOperator.value === -1) {
      this.selectedLcoName = -1;
      this.selectedOperator = selectedOperator;
      console.log(this.selectedOperator);

    } else {
      this.selectedLcoName = 0;
    }
  }

  onUserChange(selecteduser: any) {
    this.selectedUser = selecteduser;
  }
  onSublcoChange(selectedOperator: any) {
    if (selectedOperator.value === 0) {
      this.selectedSubLcoName = 0;
      this.selectedSubOperator = selectedOperator;
      console.log(this.selectedOperator);

    } else {
      this.selectedSubLcoName = 0;
    }
  }
  // -------------------------------------------------------------
  private onColumnDefs() {
    console.log('1111111111111111111');

    if (this.type == 'walletShare') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'DATE', field: 'logdate', Flex: 1 },
        { headerName: 'SHARED AMOUNT	', field: 'amount', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' } },
        {
          headerName: 'FROM OPERATOR	', field: 'activity', width: 500, cellRenderer: (params: { data: { fromopname: string; fromopoldbalance: number; fromopnewbalance: number; }; }) => {
            return `
            <div>
              <strong style="color:#6f6f6f">${params.data.fromopname}</strong><br>
              <span>Old Balance:  <b style="color:#ef3333"> ₹ ${params.data.fromopoldbalance}</b></span><br>
              <span>New Balance:  <b style="color:#239b28"> ₹ ${params.data.fromopnewbalance}</b></span>
            </div>
          `;
          }
        },
        {
          headerName: 'TO OPERATOR	', field: 'activity', width: 500, cellRenderer: (params: { data: { toopname: string; toopoldbalance: number; toopnewbalance: number; }; }) => {
            return `
            <div>
              <strong style="color:#6f6f6f">${params.data.toopname}</strong><br>
              <span>Old Balance: <b style="color:#ef3333"> ₹${params.data.toopoldbalance}</b></span><br>
              <span>New Balance: <b style="color:#239b28"> ₹${params.data.toopnewbalance}</b></span>
            </div>
          `;
          }
        },
      ]
    } else if (this.type == 'recharge_deduction_excluding') {
      if (this.selectedOperator.value == 0) {
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80 },
          { headerName: 'LCO ID', field: 'operatorid', width: 150 },
          { headerName: 'LCO NAME', field: 'operatorname', width: 200 },
          { headerName: 'TOTAL	', field: 'total', width: 200 },
          { headerName: 'TYPE	', field: 'transactiongroupname', width: 250 },
          { headerName: 'LOG DATE	', field: 'transaction_date', width: 250 },
          { headerName: 'ADDRESS	', field: 'address', width: 300 },
          { headerName: 'MOBILE', field: 'contactnumber', width: 200 },
        ]
      } else {
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80 },
          { headerName: 'LCO ID', field: 'operatorid', width: 150 },
          { headerName: 'LCO NAME', field: 'operatorname', width: 200 },
          { headerName: 'TOTAL	', field: 'total', width: 200 },
          { headerName: 'TYPE	', field: 'transactiongroupname', width: 200 },
          { headerName: 'LOG DATE	', field: 'transactiondate', width: 250 },
          { headerName: 'ADDRESS	', field: 'address', width: 300 },
          { headerName: 'MOBILE', field: 'contactnumber', width: 200 },
        ]
      }

    } else if (this.type == 'recharge_deduction_including') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 70 },
        { headerName: 'LCO ID', field: 'operatorid', width: 80 },
        { headerName: 'LCO NAME', field: 'operatorname', width: 250 },
        { headerName: 'PAYMENT MODE', field: 'packagename', width: 230 },
        // { headerName: 'ORDER ID	', field: 'boxid', width: 150 },
        { headerName: 'TRANSACTION ID', field: 'transactionid', width: 150 },
        { headerName: 'TRANSACTION DATE', field: 'transactiondate', width: 250 },
        { headerName: 'REMARKS', field: 'transactionremarks', width: 200 },
        { headerName: 'TYPE', field: 'transactiongroupname', width: 200 },
        // { headerName: 'TRANSACTION DATE	', field: 'transaction_date', width: 350 },
        { headerName: 'AMOUNT', field: 'total', width: 150, cellStyle: { textAlign: 'center', color: 'green' } },
      ]
    }

    // else if (this.type == 'online_payment') {
    //   this.columnDefs = [
    //     { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
    //     { headerName: 'OPERATOR NAME', field: 'operatorname', width: 250 },
    //     { headerName: 'ORDER ID', field: 'orderid', width: 250, cellStyle: { textAlign: 'center' }, },
    //     { headerName: 'AMOUNT', field: 'amount', width: 220, cellStyle: { textAlign: 'center', color: 'green' }, },
    //     { headerName: 'STATUS	', field: 'status', width: 200, cellStyle: { textAlign: 'center' } },
    //     { headerName: 'RESPONSE', field: 'response', width: 200 },
    //     { headerName: 'TRANSACTION DATE', field: 'logdate', width: 200 },
    //     {
    //       headerName: "RE STATUS",
    //       editable: true,
    //       cellRenderer: (params: any) => {
    //         const replaceButton = document.createElement('button');
    //         replaceButton.style.marginRight = '5px';
    //         replaceButton.style.cursor = 'pointer';
    //         replaceButton.style.fontSize = '12px';
    //         replaceButton.style.padding = '0px 15px';
    //         replaceButton.style.fontWeight = 'bold';
    //         replaceButton.style.height = '38px';
    //         replaceButton.style.background = 'linear-gradient(rgb(255, 217, 70), rgb(225, 167, 92))';
    //         replaceButton.style.color = 'rgb(104, 102, 102)';
    //         replaceButton.style.border = '1px solid rgb(255, 220, 138)';
    //         // replaceButton.style.marginTop = '3%';
    //         replaceButton.innerText = 'Refresh';

    //         replaceButton.addEventListener('mouseenter', () => {
    //           replaceButton.style.color = 'white';
    //         });
    //         replaceButton.addEventListener('mouseleave', () => {
    //           replaceButton.style.color = 'rgb(104, 102, 102)';
    //         });
    //         replaceButton.addEventListener('click', () => {
    //           // this.openEditDialog(params.data);
    //           this.refreshData(params.data);
    //         });
    //         if (params.data.status === "success") {
    //           replaceButton.disabled = true;
    //           replaceButton.style.cursor = 'not-allowed';
    //           replaceButton.style.background = 'linear-gradient(rgb(251 234 170), rgb(229 200 164))';
    //         }
    //         const div = document.createElement('div');
    //         div.appendChild(replaceButton);
    //         return div;
    //         // } else {
    //         //   return '';
    //         // }
    //       }
    //     }
    //   ]
    // }
    else if (this.type == 'user_rechargehistory') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'OPERATOR NAME', field: 'operatorname', flex: 1 },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', flex: 1 },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'SMARTCARD', field: 'smartcard', flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, },
        { headerName: 'PRODUCT NAME	', field: 'packagename', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'ACTION', field: 'action', flex: 1 },
        { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', flex: 1 },
        { headerName: 'LCO AMOUNT', field: 'lcocommission', flex: 1 },
        { headerName: 'MSO AMOUNT', field: 'msoamount', flex: 1 },
        { headerName: 'LOG DATE', field: 'logdate', flex: 1 },
        { headerName: 'EXPIRY DATE', field: 'expirydate', flex: 1 },
      ]
    } else if (this.type == 'lco_active_subscription') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'OPERATOR ID', field: 'operatorname', flex: 1 },
        { headerName: 'OPERATOR NAME', field: 'operatorname', flex: 1 },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'AREA NAME', field: 'areaname', flex: 1, cellStyle: { textAlign: 'left', color: 'green' }, },
        { headerName: 'LCO INVENTORY', field: 'lcoend', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'SUBSCRIBER INVENTORY', field: 'subscriberend', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'ACTIVE', field: 'active', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'EXPIRY', field: 'expiry', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'TOTAL', field: 'total', flex: 1, cellStyle: { textAlign: 'center' } },
      ]
    }
    else if (this.type == 'lcowiseExpiryCountDiff') {
      console.log('selected month', this.selectedMonthName);
      console.log('selected month', this.selectedDateMonthName);
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false, headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'OPERATOR ID', field: 'operator_id', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'OPERATOR NAME', field: 'name', flex: 1 },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', flex: 1 },
        { headerName: 'AREA NAME', field: 'area', flex: 1 },
        { headerName: 'ACTIVE COUNT', field: 'active', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'EXPIRY COUNT', field: 'deactive', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: `EXPIRY COUNT ${this.selectedMonthName}`, field: 'expiryfrom', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: `EXPIRY COUNT ${this.selectedDateMonthName}`, field: 'expiryto', flex: 1, cellStyle: { textAlign: 'center' } },
        { headerName: 'DIFFERENCE', field: 'difference', flex: 1, cellStyle: { textAlign: 'center' } },
      ]
    }
    else if (this.type == 'total_lco') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false, headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'LCO NAME', field: 'Operator_Name', flex: 1, filter: false, cellStyle: { textAlign: 'left', }, },
        { headerName: 'LCO ID', field: 'Operator_ID', flex: 1, filter: false, cellStyle: { textAlign: 'center', }, },
        { headerName: 'AREA', field: 'Area', flex: 1, filter: false, cellStyle: { textAlign: 'left', }, },
        { headerName: 'ADDRESS', field: 'address', flex: 1, cellStyle: { textAlign: 'left', }, },
        { headerName: 'PINCODE', field: 'pincode', flex: 1, filter: false, cellStyle: { textAlign: 'center' } },
        { headerName: 'MOBILE NUMBER', field: 'Contact_Number1', flex: 1, cellStyle: { textAlign: 'center' }, filter: false, },
        { headerName: 'USER ID', field: 'user_id', flex: 1, filter: false, cellStyle: { textAlign: 'left', }, },
      ]
    } else if (this.type == 'lco_transfer_details') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'SMARTCARD', field: 'smartcard', flex: 1, },
        { headerName: 'OLD CUSTOMER NAME', field: 'oldcustomername', flex: 1, },
        { headerName: 'NEW CUSTOMER NAME', field: 'newcustomername', flex: 1, cellStyle: { textAlign: 'left', color: 'green', }, },
        { headerName: 'OLD OPERATOR	', field: 'oldoperatorname', flex: 1, cellStyle: { textAlign: 'left' }, },
        { headerName: 'NEW OPERATOR	', field: 'newoperatorname', flex: 1, cellStyle: { textAlign: 'left', color: 'green', }, },
        { headerName: 'LOG DATE', field: 'logdate', flex: 1, cellStyle: { textAlign: 'center' }, },
      ]
    } else if (this.type == 'subscriber_bill') {
      this.columnDefs = [
        { headerName: 'SMARTCARD', field: 'referenceid', flex: 1, filter: false },
        { headerName: 'DATE', field: 'transactiondate', flex: 1, filter: false },
        { headerName: 'EXPIRY DATE', field: 'expirydate', flex: 1, cellStyle: { textAlign: 'center', }, filter: false },
        { headerName: 'PACKAGE', field: 'packagename', flex: 1, filter: false },
        { headerName: 'PLAN', field: 'days', flex: 1, filter: false, cellStyle: { textAlign: 'center' }, },
        { headerName: 'AMOUNT', field: 'customeramount', flex: 1, cellStyle: { textAlign: 'center' }, filter: false, },
      ]
    } else if (this.type == 'sublco_offline') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false, headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'RETAILER ID', field: 'retailerid', flex: 1, cellStyle: { textAlign: 'center', }, },
        { headerName: 'RETAILER NAME', field: 'retailername', flex: 1, },
        { headerName: 'AMOUNT	', field: 'lcoamount', flex: 1, cellStyle: { textAlign: 'center', }, filter: false },
        { headerName: 'OPERATOR NAME', field: 'operatorname', flex: 1, },
        { headerName: 'LOG DATE', field: 'transactiondate', flex: 1, filter: false, cellStyle: { textAlign: 'center' }, },
        { headerName: 'MOBILE', field: 'contact', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'REMARKS', field: 'transactionremarks', flex: 1, cellStyle: { textAlign: 'center' }, },
      ]
    } else if (this.type == 'unpair_smartcard') {
      this.columnDefs = [
        { headerName: 'CUSTOMER NAME', field: 'referenceid', flex: 1, },
        { headerName: 'AREA ID', field: 'transactiondate', flex: 1, },
        { headerName: 'CUSTOMER NO', field: 'expirydate', flex: 1, cellStyle: { textAlign: 'center', }, },
        { headerName: 'OPERATOR NAME', field: 'packagename', flex: 1, },
        { headerName: 'SMARTCARD', field: 'days', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'PACKAGE NAME', field: 'customeramount', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'ACTION', field: 'customeramount', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'TRANSACTION TYPE', field: 'customeramount', flex: 1, cellStyle: { textAlign: 'center' }, },
        { headerName: 'DAYS', field: 'customeramount', flex: 1, cellStyle: { textAlign: 'center' }, filter: false, },
      ]
    } else if (this.type == 'lcoinvoice') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true, },
        { headerName: "GST	", field: 'extra1', width: 300 },  // Jeya Akka Change panna sonnanga Operator name nu ulla dha GST nu
        { headerName: "INVOICE NO	", field: 'invoiceNo', width: 200 },
        { headerName: "INVOICE DATE	", field: 'invoiceDate', width: 300 },
        { headerName: "BASE", field: 'baseAmount', width: 250 },
        { headerName: "ADDON", field: 'addonBase', width: 200 },
        { headerName: "ALACARTE", field: 'alacarteBase', width: 250 },
      ]
    }

  }




  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // getFromDate(event: any) {
  //   var date = new Date();
  //   if (event != null && event != undefined) {
  //     date = new Date(event.value);
  //   }
  //   const formattedDate = this.formatDate(date);
  //   this.fromdate = formattedDate;

  //   this.cdr.detectChanges();


  // }
  // getToDate(event: any) {

  //   var date = new Date();
  //   if (event != null && event != undefined) {
  //     date = new Date(event.value);
  //   }
  //   this.todate = this.formatDate(date);
  //   console.log(this.todate);
  //   this.cdr.detectChanges();


  // }
  formatDate1(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  cur_date: any;
  // logValues(event: any): void {
  //   const selectedDate: Date = event.value || new Date();
  //   const formattedDate = this.formatDate1(selectedDate);
  //   console.log('Selected Date:', formattedDate);
  //   this.cur_date = formattedDate;
  //   console.log(this.cur_date);
  // }

  // getFromDate(event: any) {
  //   console.log(event.value);
  //   const date = new Date(event.value).getDate();
  //   const month = new Date(event.value).getMonth() + 1;
  //   const year = new Date(event.value).getFullYear();
  //   this.fromdate = year + "-" + month + "-" + date
  //   console.log(this.fromdate);

  // }
  // getToDate(event: any) {
  //   const date = new Date(event.value).getDate();
  //   const month = new Date(event.value).getMonth() + 1;
  //   const year = new Date(event.value).getFullYear();
  //   this.todate = year + "-" + month + "-" + date
  //   console.log(this.todate);
  // }
  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }
  goBack(): void {
    this.location.back();
  }
  // ------------------------------------------------------integration---------------------------------------------
  // -----------------------------------------------monthwisePaymentCollection-----------------------------------------------------------
  monthwisePaymentCollectionExcel() {
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    // this.swal.Loading();
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getMonthwisePaymentCollection(this.role, this.username, this.selectedMonth, this.selectedYear, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = (this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  monthwisePaymentCollectionPdf() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    // this.swal.Loading();
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getMonthwisePaymentCollection(this.role, this.username, this.selectedMonth, this.selectedYear, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = (this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  // -----------------------------------------------------------Recharge history report----------------------

  smartcardChange(smartcard: any) {
    if (this.smartcard == null || this.smartcard == undefined || this.smartcard == '') {
      return 0
    } else {
      return smartcard;
    }
  }
  getRecharge() {
    this.smartcard = this.smartcardChange(this.smartcard);
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }

    });
    // this.swal.Loading();
    this.userService.getRechargeHistory(this.role, this.username, this.selectedRechargeType, this.selectedOperator.value, this.fromdate, this.todate, this.smartcard, this.useragent,
      this.selectedSubLcoName, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          // this.fromdate = '';
          // this.todate = '';
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
        Swal.close();
      },
      (error) => {
        this.handleApiError(error.error.message, error.status);
      }
    );
  }

  getRechargeExcel() {
    this.smartcard = this.smartcardChange(this.smartcard);
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }

    });
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.selectedOperator.value, this.fromdate, this.todate, this.smartcard, this.useragent,
      this.selectedSubLcoName, 2
    )
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = ("RECHARGE HISTORY REPORT.xlsx").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
    // this.fromdate = '';
    // this.todate = '';
  }
  getRerchargePdf() {

    this.smartcard = this.smartcardChange(this.smartcard);

    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.selectedOperator.value, this.fromdate, this.todate, this.smartcard, this.useragent,
      this.selectedSubLcoName, 1
    )
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        // link.download = ("SUB ONLINE REPORT.pdf").toUpperCase();
        link.download = ("RECHARGE HISTORY REPORT.pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
    // this.fromdate = '';
    // this.todate = '';
  }
  // -----------------------------------------------------------Online history report----------------------

  getOnline() {
    this.smartcard = this.smartcardChange(this.smartcard);
    console.log(this.selectedSubLcoName);
    console.log(this.selectedOperator);

    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }

    });
    this.userService.getOnlinePaymentHistory(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, this.selectedSubLcoName, this.smartcard, this.selectedOnlineType, 3)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.rowData = response.body;
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.swal.Success_204();
            this.rowData = [];
          }
          Swal.close();
        },
        (error) => {
          this.handleApiError(error.error.message, error.status);
        }
      );
  }

  getOnlineExcel() {

    this.smartcard = this.smartcardChange(this.smartcard);

    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }

    });
    this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, this.selectedSubLcoName, this.smartcard, this.selectedOnlineType, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = ("SUB ONLINE REPORT.xlsx").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
    // this.fromdate = '';
    // this.todate = '';
  }
  getOnlinePdf() {
    this.smartcard = this.smartcardChange(this.smartcard);

    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    console.log('dfdsfdsfdsfdsf', event);
    this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, this.selectedSubLcoName, this.smartcard, this.selectedOnlineType, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = ("SUB ONLINE REPORT.pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
    // this.fromdate = '';
    // this.todate = '';
  }
  // ------------------------------------------------------------------------------------------------------------------
  getExcluding() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    this.onColumnDefs();
    this.processingSwal();

    this.userService.getExcluding(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedStatus, this.selectedOperator.value, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          // this.fromdate = '';
          // this.todate = '';
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
        Swal.close();
      },
      (error) => {
        this.handleApiError(error.error.message, error.status);
      }
    );
  }

  getExcludingReportDownload(type: number) {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    this.processingSwal();
    this.userService.getExcludingReport(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedStatus, this.selectedOperator.value, type
    )
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });

  }
  // ================================================MSO LCOWISE SUBSCRIPTION COUNT===============================

  lcowiseActiveSubCount() {

    // this.swal.Loading();
    this.userService.getLcowiseActiveSubCount(this.role, this.username, this.selectedOperator.value, this.selectedlcoModel, 3, this.batch, this.selectedlcocas).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          // this.swal.Success_200();

        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        console.log(error);

        this.handleApiError(error?.error.message, error.status);
        this.rowData = [];
      }
    );
  }


  lcowiseActiveSubCountReport(type: number) {
    // if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
    //   this.submitted = true;
    // }
    this.processingSwal();
    this.userService.getLcowiseActiveSubCountReport(this.role, this.username, this.selectedOperator.value, this.selectedlcoModel, 2, this.batch, this.selectedlcocas).subscribe(
      (x: Blob) => {
        if (type == 2) {
          this.reportMaking(x, this.type + '  ' + this.selectedOperator.name + ".xlsx", 'application/xlsx');
        }
      },
      (error: any) => {
        this.pdfswalError(error?.error.message);
      });
  }
  // ================================================including report===============================

  getIncluding() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    // this.swal.Loading();

    this.userService.getIncluding(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedAmount, this.selectedOperator.value || 0, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error.error.message, error.status);
      }
    );
  }

  getIncludeReportDownload(type: number) {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    this.processingSwal();
    this.userService.getIncludingReport(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedAmount, this.selectedOperator.value || 0, type
    )
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // ================================================RefreshData===============================
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  refreshData(event: any) {
    console.log(event);
    let transactionid = event.orderid;
    this.userService.getrefreshData(this.role, this.username, event.operatorid, event.userid, transactionid, this.selectedOnlineType)
      .subscribe((res: any) => {
        this.swal.success_1(res?.message || res?.responce);
        if (this.agGrid && this.agGrid.api) {
          this.updateRowData(transactionid, res?.updatedData);
        } else {
          console.error("AgGrid API is not initialized yet.");
        }
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

    setTimeout(() => {
      this.getOnline()
    }, 2000);

  }
  updateRowData(transactionid: string, updatedData: any) {
    const rowNode = this.agGrid.api.getRowNode(transactionid);
    if (rowNode) {
      rowNode.setData(updatedData);
    }
  }
  // ================================================walletshare===============================

  getWalletreport() {
    this.userService.getWalletShareReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, 3)
      .subscribe((res: any) => {
        this.rowData = res;
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getWalletReportDownload(type: number) {
    this.processingSwal();
    this.userService.getWalletShareReportDownload(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Wallet_Share_Report(" + this.fromdate + "-" + this.todate + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Wallet_Share_Report(" + this.fromdate + "-" + this.todate + ").xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // ================================================walletshare===============================
  total: number = 0;
  subscriberBill: any;
  bill: any;
  sub_id: any;
  sub_name: any;
  sub_mobileno: any;
  op_id: any;
  op_name: any;
  op_mobileno: any;
  getSubscriberBill() {
    this.userService.getSubscriberBill(this.role, this.username, this.selectedMonth, this.selectedYear, 2, this.smartcard)
      .subscribe((res: any) => {
        this.subscriberBill = res;
        this.bill = this.subscriberBill.billNo
        this.sub_id = this.subscriberBill?.subscriber?.id
        this.sub_name = this.subscriberBill?.subscriber?.customername
        this.sub_mobileno = this.subscriberBill?.subscriber?.mobileno
        this.op_id = this.subscriberBill?.operator?.operatorid
        this.op_name = this.subscriberBill?.operator?.operatorname
        this.op_mobileno = this.subscriberBill?.operator?.contactnumber1
        this.total = this.subscriberBill?.totalCustomerAmount;
        this.rowData = this.subscriberBill?.rechargeList;


        console.log(this.rowData);
        console.log(this.subscriberBill);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

  }

  getSubscriberBillDownload(type: number) {
    this.processingSwal();
    this.userService.getSubscriberBillDownload(this.role, this.username, this.selectedMonth, this.selectedYear, type, this.smartcard)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Subscriber_Recharge_Details(" + this.smartcard + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Subscriber_Recharge_Details(" + this.smartcard + ").xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  isshowpdf: boolean = true;
  checkDataForBill() {
    if (this.smartcard != null && this.smartcard != '' && this.smartcard != undefined && this.selectedMonth != null && this.selectedMonth != 0 && this.selectedMonth != undefined && this.selectedYear != null && this.selectedYear != 0 && this.selectedYear != undefined) {
      this.isshowpdf = false;
    } else {
      this.isshowpdf = true;
    }
  }
  // ================================================Lco Wise Expiry Count Report===============================

  getLcowiseExpiryCount() {
    console.log(this.selectedDate)
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    // this.swal.Loading();

    this.userService.getLcowiseExpirySubCount(this.role, this.username, this.selectedYear, this.selectedMonth, this.selectedDate, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error.error.message, error.status);
      }
    );
  }

  getLcowiseExpiryCountReport(type: number) {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    }
    this.processingSwal();
    this.userService.getLcowiseExpirySubCountReport(this.role, this.username, this.selectedYear, this.selectedMonth, this.selectedDate, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + '-' + this.selectedDate + ".pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + '-' + this.selectedDate + ".xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // ================================================userrechargehistory===============================

  getUserRechargeHistory() {
    this.userService.getUserRecharegeHistory(this.role, this.username, this.fromdate, this.todate, this.selectedUser.value, 3)
      .subscribe((res: any) => {
        console.log(res);
        this.rowData = res;
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

  }

  getUserRechargeHistoryDownload(type: number) {
    this.processingSwal();
    this.userService.getUserRecharegeHistoryDownload(this.role, this.username, this.fromdate, this.todate, this.selectedUser.value, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Subscriber_Recharge_History(" + this.selectedUser.name + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Subscriber_Recharge_History(" + this.selectedUser.name + ").xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // -----------------------------------------------------------------------------------------------------------------------------
  handleApiError(error: any, status: number) {
    console.log(status);

    if (status === 400) {
      this.swal.Custom_Error_400(error);
    } else if (status === 500) {
      this.swal.Error_500();
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

  // -----------------------------------------CUSTOMER ACTIVATION FORM------------------------------------------------------------------------------------


  getCustomerActivationform(type: number) {
    if (!this.smartcard) {
      this.submitted = true;
    } else {
      this.processingSwal();
      this.userService.getIncludingReport(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
        this.selectedAmount, this.selectedOperator.value || 0, type
      )
        .subscribe((x: Blob) => {
          if (type == 1) {
            this.reportMaking(x, this.type + '  ' + this.smartcard + ".pdf", 'application/pdf');
          }
        },
          (error: any) => {
            this.pdfswalError(error?.error.message);
          });
    }
  }
  // ---------------------------------------casform actvation----------------

  onsubscriberlist(value: any) {
    this.showDropdown = true;
    this.userService.getSearchDetailsSubscriber(this.role, this.username, value).subscribe(
      (data: any) => {
        if (!data || Object.keys(data).length === 0) {
          this.subscriberList = [];
          return;
        }
        this.subscriber = data;
        this.subscriberList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
        this.subscriberList.sort((a: any, b: any) => {
          if (a.value > b.value) return 1;
          if (a.value < b.value) return -1;
          return 0;
        });
        if (this.subscriberList.length === 0) {
          console.log('No matching data after sorting');
          Swal.fire({
            title: 'No Matching Results',
            text: 'No subscribers match your search criteria.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        }

        console.log(this.subscriberList);
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.getsmartcardlistbysubid.searchname
            || 'An error occurred while fetching subscriber details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  onSmartcardlist(value: any) {
    this.showDropdown = true;
    this.userService.getSearchSmartcardData(this.role, this.username, value).subscribe(
      (data: any) => {
        if (!data || Object.keys(data).length === 0) {
          this.subscriberList = [];
          return;
        }
        this.subscriber = data;
        this.subscriberList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
        this.subscriberList.sort((a: any, b: any) => {
          if (a.value > b.value) return 1;
          if (a.value < b.value) return -1;
          return 0;
        });
        if (this.subscriberList.length === 0) {
          console.log('No matching data after sorting');
          Swal.fire({
            title: 'No Matching Results',
            text: 'No subscribers match your search criteria.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        }

        console.log(this.subscriberList);
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.getsmartcardlistbysubid.searchname
            || 'An error occurred while fetching subscriber details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  goToSubscriberDashboard(lcomember: any) {
    this.smartcard = lcomember.value;
    console.log('Selected value:', this.smartcard);
    // const targetUrl = `/admin/subscriber-full-info/${this.lcomember}//dashoard`;

    // if (this.router.url === targetUrl) {
    //   window.location.reload();
    // } else {
    //   this.router.navigate([targetUrl]).then(() => {
    //     console.log('Navigated to:', targetUrl);
    //     window.location.reload();
    //   });
    // }
    this.showDropdown = false;
  }


  getCasformActivation(type: number) {
    if (!this.smartcard) {
      this.submitted = true;
    } else {
      this.processingSwal();
      this.userService.getCasFormActivationReport(this.role, this.username, this.smartcard, type
      )
        .subscribe((x: Blob) => {
          if (type == 1) {
            this.reportMaking(x, this.type + '  ' + this.smartcard + ".pdf", 'application/pdf');
          }
        },
          (error: any) => {
            this.pdfswalError(error?.error.message);
          });
    }
  }
  // ================================================TOTAL LCO REPORT===============================

  getTotalOperatorReport() {
    this.userService.getTotalOperatorReport(this.role, this.username, 3)
      // .subscribe((res: any) => {
      //   console.log(res);
      //   this.rowData = res;
      // }, (err) => {
      //   this.swal.Error(err?.error?.message);
      // });
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.rowData1 = response.body;
            // this.fromdate = '';
            // this.todate = '';
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.swal.Success_204();
            this.rowData1 = [];
          }
          Swal.close();
        },
        (error) => {
          this.handleApiError(error.error.message, error.status);
        }
      );
  }

  getTotalOperatorReportDownload(type: number) {
    this.processingSwal();
    this.userService.getTotalOperatorReportDownload(this.role, this.username, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Total Lco report.pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Total Lco report .xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // ================================================ LCO TRANSFER DETAILS REPORT===============================

  getLcoTransferReport() {
    this.submitted = true;
    this.userService.getLcoTransferReport(this.role, this.username, this.smartcard1 || 0, this.selectedOperator.value, this.fromdate, this.todate, 3)
      // .subscribe((res: any) => {
      //   // console.log(res);
      //   this.rowData = res;
      // }, (err) => {
      //   this.swal.Error(err?.error?.message);
      // });
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.rowData = response.body;
            // this.fromdate = '';
            // this.todate = '';
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.rowData = [];
            this.swal.Success_204();
          }
          Swal.close();
        },
        (error) => {
          this.handleApiError(error.error.message, error.status);
        }
      );
  }

  getLcoTransferReportDownload(type: number) {
    this.processingSwal();
    this.userService.getLcoTransferReportDownload(this.role, this.username, this.smartcard1, this.selectedOperator.value, this.fromdate, this.todate, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Lco Transfer Details report.pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Lco Transfer Details report .xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // ================================================ SUB LCO OFFLINE DETAILS REPORT===============================

  getSubLcoOfflineDetailsReport() {
    this.userService.getsubLcoOfflineReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, this.selectedSubLcoName, 3)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.rowData = response.body;
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.rowData = [];
            this.swal.Success_204();
          }
          Swal.close();
        },
        (error) => {
          this.handleApiError(error.error.message, error.status);
        }
      );
  }

  getSubLcoOfflinerDetailsDownload(type: number) {
    this.processingSwal();
    this.userService.getsubLcoOfflineDownload(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, this.selectedSubLcoName, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Sub LCO Offline Payment History (" + this.fromdate + "-" + this.todate + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Sub LCO Offline Payment History (" + this.fromdate + "-" + this.todate + ").xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // =========================================================lcoInvoice===========================

  onGridReady1() {
    this.userService.getAllOperatorInvoiceBillByMonthYear(this.role, this.username, this.selectedMonth || null, this.selectedYear || null)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.rowData = response.body;
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.rowData = [];
            this.swal.Success_204();
          }
          Swal.close();
        },
        (error) => {
          this.handleApiError(error.error.message, error.status);
        }
      );
  }

  submit() {
    // this.swal.Loading();
    this.rowData = [];
    this.userService.generateOperatorInvoiceBill(this.role, this.username, this.selectedMonth || null, this.selectedYear || null)

      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        this.rowData = res;
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }



  getLcoInvoiceReport(type: number) {
    this.swal.Loading();
    this.submitted = true;
    console.log(this.selectedLcoName);
    console.log(this.selectedOperator);

    this.userService.getLcoInvoiceDetails(this.role, this.username, this.selectedOperator, this.selectedMonth || null, this.selectedYear || null, type).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();

          if (type == 1) {
            this.reportMaking(x, 'OPERATOR WISE GST FILE' + this.selectedMonthName + '-' + this.selectedYear + ".pdf", 'application/pdf');
          } else if (type == 2) {
            this.reportMaking(x, 'OPERATOR WISE GST FILE' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx", 'application/xlsx');
          }
        },
        error: (error: any) => {
          this.swal.Close();
          this.pdfswalError(error?.error.message);
        }
      });


  }

  onlinePayment() {
    console.log('Selected Online Type:', this.selectedOnlineType);

    if (this.selectedOnlineType == 1) {
      console.log('fgdsfjhdsjfkhdsjkf');

      this.columnDefs3 = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'OPERATOR NAME', field: 'operatorname', width: 250 },
        { headerName: 'ORDER ID', field: 'orderid', width: 250, cellStyle: { textAlign: 'center' } },
        { headerName: 'AMOUNT', field: 'amount', width: 220, cellStyle: { textAlign: 'center', color: 'green' } },
        { headerName: 'STATUS', field: 'status', width: 200, cellStyle: { textAlign: 'center' } },
        { headerName: 'RESPONSE', field: 'response', width: 200 },
        { headerName: 'TRANSACTION DATE', field: 'logdate', width: 200 },
        { headerName: "RE STATUS", editable: true, cellRenderer: this.createRefreshButton.bind(this) }
      ];
    }
    if (this.selectedOnlineType == 2) {
      console.log('435345435');

      this.columnDefs3 = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'OPERATOR NAME', field: 'operatorname', width: 250 },
        { headerName: 'RETAILER NAME', field: 'retailername', width: 250 },
        { headerName: 'ORDER ID', field: 'orderid', width: 250, cellStyle: { textAlign: 'center' } },
        { headerName: 'AMOUNT', field: 'amount', width: 220, cellStyle: { textAlign: 'center', color: 'green' } },
        { headerName: 'STATUS', field: 'status', width: 200, cellStyle: { textAlign: 'center' } },
        { headerName: 'RESPONSE', field: 'response', width: 200 },
        { headerName: 'TRANSACTION DATE', field: 'logdate', width: 200 },
        { headerName: "RE STATUS", editable: true, cellRenderer: this.createRefreshButton.bind(this) }
      ];
    }

    if (this.selectedOnlineType == 3) {
      console.log('43jhjk');

      this.columnDefs3 = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'OPERATOR NAME', field: 'operatorname', width: 250 },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', width: 250 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 250 },
        { headerName: 'ORDER ID', field: 'orderid', width: 250, cellStyle: { textAlign: 'center' } },
        { headerName: 'AMOUNT', field: 'amount', width: 220, cellStyle: { textAlign: 'center', color: 'green' } },
        { headerName: 'STATUS', field: 'status', width: 200, cellStyle: { textAlign: 'center' } },
        { headerName: 'RESPONSE', field: 'response', width: 200 },
        { headerName: 'TRANSACTION DATE', field: 'logdate', width: 200 },
        { headerName: "RE STATUS", editable: true, cellRenderer: this.createRefreshButton.bind(this) }
      ];

    }
  }


  createRefreshButton(params: any) {
    const button = document.createElement('button');
    button.innerText = 'Refresh';
    button.style.cssText = `
      margin-right: 5px;
      cursor: pointer;
      font-size: 12px;
      padding: 0px 15px;
      font-weight: bold;
      height: 38px;
      background: linear-gradient(rgb(255, 217, 70), rgb(225, 167, 92));
      color: rgb(104, 102, 102);
      border: 1px solid rgb(255, 220, 138);
    `;

    button.addEventListener('mouseenter', () => button.style.color = 'white');
    button.addEventListener('mouseleave', () => button.style.color = 'rgb(104, 102, 102)');
    button.addEventListener('click', () => this.refreshData(params.data));

    if (params.data.status === "success") {
      button.disabled = true;
      button.style.cursor = 'not-allowed';
      button.style.background = 'linear-gradient(rgb(251 234 170), rgb(229 200 164))';
    }

    const div = document.createElement('div');
    div.appendChild(button);
    return div;
  }
}

