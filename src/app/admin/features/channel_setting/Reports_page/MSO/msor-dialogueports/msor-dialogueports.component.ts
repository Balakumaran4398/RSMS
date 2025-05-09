import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

import { AgGridAngular } from 'ag-grid-angular';
import { OperatorService } from 'src/app/_core/service/operator.service';
declare var $: any;
export interface SubscriberData {
  smartcard: string;
  date: string;
  expiryDate: string;
  package: string;
  plan: number;
  amount: number;
}
interface TransactionTotals {
  transaction_date: string;
  cheque: number;
  cash: number;
  account: number;
  online: number;
  detection: number;
  total: number;
}
@Component({
  selector: 'app-msor-dialogueports',
  templateUrl: './msor-dialogueports.component.html',
  styleUrls: ['./msor-dialogueports.component.scss']
})


export class MsorDialogueportsComponent implements OnInit, OnDestroy {
  type: any;
  username: any;
  isspecial = false;
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
    paginationPageSizeSelector: [10, 20, 50],
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

  selectedUser: any = 0;

  public rowSelection: any = "multiple";

  userlist: any[] = [];
  filtereduserlist: any[] = [];

  selectedSubOperator: any = 0;
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
  SUB_selectedOnlineType: any = 3;

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
  filteredOnlineType: any[] = [];

  filteredRechargeType: any[] = [];
  RechargeType: any[] = [
    { label: "Operator", value: 1 },
    { label: "Smartcard", value: 2 },
    { label: "Subscriber", value: 4 },
    { label: "All", value: 3 },
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

  subLcoDetails: any;
  // retailerId: any;
  // subOperatorId: any;

  path: any;

  sublcoDeatails: any;
  retailerId: any;
  subOperatorId: any;


  lcoDeatails: any;
  operatorId: any;
  operatorname: any;
  subscriberid: any;
  subOpid: any;
  constructor(private route: ActivatedRoute, private location: Location,
    public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService, private swal: SwalService, public sublco: OperatorService) {
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
    }
    // else if (this.type == 'online_payment') {
    //   this.getOnline();
    // }
    else if (this.type == 'user_rechargehistory') {
      this.getUserRechargeHistory();
    }
    else if (this.type == 'lco_active_subscription') {
      this.lcowiseActiveSubCount();
    }
    // console.log(sublco);
    // this.lcoDeatails = this.sublco?.lcoDeatails;
    // console.log('lcoDeatails', this.lcoDeatails);

    // // 3. retailerId can be directly accessed from lcoDeatails
    // this.retailerId = this.lcoDeatails?.retailerId;
    // console.log('retailerId', this.retailerId);

    // // 4. subOperatorId is the operatorId inside lcoDeatails
    // this.subOperatorId = this.lcoDeatails?.operatorId;
    // console.log('subOperatorId', this.subOperatorId);;
  }
  getFilteredOnlineType() {
    return this.role === "ROLE_SPECIAL"
      ? this.onlineType.filter(item => item.label !== "SUBSCRIBER")
      : this.onlineType;
  }
  // -----------------------------------------------------------------subscriber bill varaibales-------------------------------

  ngOnInit(): void {
    // this.setReportTitle();
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    this.route.url.subscribe((segments) => {
      const parts = segments.map(seg => seg.path);
      const index = parts.indexOf('msodialogueReports');
      if (index !== -1 && index + 1 < parts.length) {
        this.path = parts[index + 1];
        console.log('Extracted Value:', this.path);
      } else {
        console.log('lco_recharge not found in URL');
      }
    });
    this.onColumnDefs();
    this.generateMonths();
    this.generateYears();
    this.operatorList();
    this.onRechargeType(this.selectedRechargeType);
    this.onOnlineType(this.selectedOnlineType)
    this.onDateChange();
    this.onModelList();
    if (this.path == 'user_rechargehistory') {
      this.getUserRechargeHistory();
    }

    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    }
    if (this.role == 'ROLE_SUBLCO') {
      this.subLCOdetails();

    }
    if (this.role == 'ROLE_SUBSCRIBER') {
      this.getSubscriberDetails();
      this.filterOnlineTypeByRole();

    }
    this.filterRechargeOptions();
    // this.setRechargeTypesBasedOnRole();
    this.filterUserAgent();

    console.log('sublco in ngOnInit', this.sublco);

    this.subLcoDetails = this.sublco?.lcoDeatails;
    console.log('subLcoDetails', this.subLcoDetails);

    this.retailerId = this.subLcoDetails?.retailerId;
    console.log('retailerId', this.retailerId);

    this.subOperatorId = this.subLcoDetails?.operatorId;
    console.log('subOperatorId', this.subOperatorId);
  }

  // setRechargeTypesBasedOnRole() {
  //   this.currentRechargeTypes = this.role === 'ROLE_SUBSCRIBER' ? this.RechargeType1 : this.RechargeType;
  // }
  getMonthwisePaymentCollectionData() {
    this.swal.Loading();
    this.userService.getMonthwisePaymentCollectionData(this.role, this.username, this.selectedMonth, this.selectedYear, 3).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
      this.swal.Close();
    })
  }
  getSubscriberDetails() {
    this.userService.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('22222222');
      this.lcoDeatails = data;
      console.log('SUBSCRIBER DETAILS', this.lcoDeatails);
      this.subscriberid = this.lcoDeatails.subid;
      this.subOpid = this.lcoDeatails.operatorid;
      console.log('this.subscriberid', this.subscriberid);
      console.log('this.subscriberid', this.subOpid);


    })
  }
  filterOnlineTypeByRole() {

    if (this.role == 'ROLE_SUBSCRIBER') {
      this.filteredOnlineType = this.onlineType.filter(item => item.value == 3);
      this.selectedOnlineType = 3;
    } else {
      this.filteredOnlineType = [...this.onlineType];
    }
  }

  filterRechargeOptions() {
    if (this.role == 'ROLE_SUBSCRIBER') {
      this.filteredRechargeType = this.RechargeType.filter(type => type.value == 4);
      this.selectedRechargeType = 4;
    } else if (this.role != 'ROLE_SUBSCRIBER') {
      this.filteredRechargeType = this.RechargeType.filter(type => type.value != 4);
    } else {
      this.filteredRechargeType = this.RechargeType.filter(type => type.value != 4);
    }
  }

  filteredUserAgent: any[] = [];
  filterUserAgent() {
    this.filteredUserAgent = this.role === 'ROLE_OPERATOR'
      ? this.UserAgent.filter(agent => agent.label !== 'MSO')
      : this.UserAgent;
  }

  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.onSubscriberStatusChange(this.operatorId)
    })
  }
  subLCOdetails() {
    this.userService.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('111111111111111');
      this.lcoDeatails = data;
      this.subOperatorId = this.lcoDeatails?.operatorid;
      this.retailerId = this.lcoDeatails?.retailerid;
      console.log(this.retailerId);
      console.log(this.subOperatorId);
    })
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
      if (this.role == 'ROLE_OPERATOR') {
        this.onSublcochange(this.operatorId);
      } else {
        this.onSublcochange(this.selectedSubLcoName);
      }
    });

  }
  onDateChange() {
    if (this.type == 'online_payment' || this.type == 'online_payment_special') {
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
    this.onColumnDefs();
  }
  onMonthChange(event: any) {
    if (this.selectedMonth !== '0') {
      this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
    }
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
    this.userService.getModelList(this.role, this.username).subscribe((data: any) => {
      this.model = data;
      this.modelname = data.modelname;
      console.log(this.modelname);

    })
  }
  onChangeDateType(selectedValue: any) {
    if (selectedValue == 0) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
      // this.fromdate = 0;
      // this.todate = 0;
    } else if (selectedValue == 1) {
      this.isDateEnabled = true;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
      // this.fromdate = 0;
      // this.todate = 0;
    } else if (selectedValue == 2) {
      this.isMonthYearEnabled = true;
      this.isDateEnabled = false;
      this.isYearEnabled = false;
      // this.fromdate = 0;
      // this.todate = 0;
    } else if (selectedValue == 3) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = true;
      // this.fromdate = 0;
      // this.todate = 0;
    }
  }
  onChangeDateType1(selectedValue: any) {
    if (selectedValue == 2) {
      this.isDateEnabled = true;
      this.isMonthYearEnabled = false;
      this.isYearEnabled = false;
      // this.fromdate = 0;
      // this.todate = 0;
    } else if (selectedValue == 1) {
      this.isDateEnabled = false;
      this.isMonthYearEnabled = true;
      this.isYearEnabled = true;
      // this.fromdate = 0;
      // this.todate = 0;
    }
  }

  onChangeLcoTransferType(selectedValue: any) {
    if (selectedValue == 1) {
      this.isDateEnabled = false;
      this.isLcoOperator = true;
      this.isLcoSmartcard = false;
      this.smartcard1 = 0;
      this.rowData = [];
      // this.fromdate = 0;
      // this.todate = 0;
    } else if (selectedValue == 2) {
      this.isDateEnabled = false;
      this.isLcoOperator = false;
      this.isLcoSmartcard = true;
      this.rowData = [];
      // this.fromdate = 0;
      // this.todate = 0;
      this.selectedOperator.value = 0;
    } else if (selectedValue == 3) {
      this.isDateEnabled = true;
      this.isLcoOperator = false;
      this.isLcoSmartcard = false;
      this.rowData = [];
      this.smartcard1 = 0;
      // this.fromdate = 0;
      // this.todate = 0;
      this.selectedOperator.value = 0;
    }
  }
  rechargeOperatorValue: any;
  onRechargeType(selectedValue: any) {
    console.log(selectedValue);

    this.rechargeOperatorValue = selectedValue;
    if (selectedValue == 1) {
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
    } else if (selectedValue == 4) {
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
    this.columnDefs2 = this.rechargeOperatorValue == 3
      ? [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90, filter: false },
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
    this.onlinePayment();

    if (selectedValue == 1) {
      this.rowData = [];
      this.isSmartcard = false;
      this.isOperator = true;
      this.isSubLCO = false;
      // this.fromdate = 0;
      // this.todate = 0;
      this.selectedOperator.value;
      this.selectedLcoName = 0;
      this.selectedSubLcoName = 0;
      setTimeout(() => {
        $('#operator').val(this.selectedLcoName).trigger('change');
      }, 100);
      this.smartcard = '';

    } else if (selectedValue == 2) {
      this.rowData = [];
      this.isSmartcard = false;
      this.isOperator = true;
      this.isSubLCO = true;
      this.selectedOperator.value;
      this.selectedLcoName;
      this.selectedSubLcoName;
      // setTimeout(() => {
      $('#operator').val(this.selectedLcoName).trigger('change');
      $('#subLco').val(this.selectedSubLcoName).trigger('change');
      // }, 100);
    } else if (selectedValue == 3) {
      this.rowData = [];
      this.isSmartcard = true;
      this.isOperator = false;
      this.isSubLCO = false;
      // this.fromdate = 0;
      // this.todate = 0;
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
  }

  filterUsers(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filtereduserlist = this.userlist.filter(sub =>
      sub.name.toLowerCase().includes(filterValue)
    );
  }

  filterSubLco(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredSubLcoList = this.sublco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
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
    this.filteredSubLcoList = [];
    this.userService.getAllSublcoList(this.role, this.username, event)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200 && response.body) { // Ensure the body exists
            this.sublco_list = response.body.map((item: any) => ({
              operatorId: item.retailerId,
              retailerName: item.retailerName,
            }));
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
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value || this.operatorId || 0;
    this.selectedSubLcoName = 0;
    if (this.type == 'recharge_deduction_excluding') {

    } else if (this.type == 'lcoinvoice') {
    }
    else {
      this.subLcoList(this.selectedOperator.value || this.operatorId || 0)
    }
    if (selectedOperator.value === 0) {
      console.log("Selected: All Operator (Value: 0)");
      this.selectedLcoName = selectedOperator.value;
    } else {
      console.log("Selected:", selectedOperator.name, "(Value:", selectedOperator.value, ")");
    }
  }
  onSubscriberLcoChange(selectedOperator: any) {
    this.selectedLco = selectedOperator;
    this.selectedLco = selectedOperator.name;
    this.selectedLcoName = selectedOperator.value || this.operatorId;
    this.selectedSubLcoName = '';

  }
  onSublcochange(selectedOperator: any) {
    this.selectedSubOperator = selectedOperator;
    this.selectedSubLcoName = selectedOperator.operatorId;
  }
  onOperatorStatusChange(selectedOperator: any) {
    if (selectedOperator.value === 0) {
      this.selectedLcoName = 0;
      this.selectedOperator = selectedOperator;
    } else {
      this.selectedLcoName = 0;
    }
  }
  onOperatorBandwidth(selectedOperator: any) {
    if (selectedOperator.value === -1) {
      this.selectedLcoName = -1;
      this.selectedOperator = selectedOperator;
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
    } else {
      this.selectedSubLcoName = 0;
    }
  }
  // -------------------------------------------------------------
  private onColumnDefs() {
    if (this.type == 'walletShare') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90, filter: false },
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
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
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
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
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
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 70, filter: false },
        { headerName: 'LCO ID', field: 'operatorid', width: 80 },
        { headerName: 'LCO NAME', field: 'operatorname', width: 250 },
        { headerName: 'PAYMENT MODE', field: 'packagename', width: 230 },
        // { headerName: 'ORDER ID	', field: 'boxid', width: 150 },
        { headerName: 'TRANSACTION ID', field: 'transactionid', width: 150 },
        { headerName: 'TRANSACTION DATE', field: 'transactiondate', width: 250 },
        { headerName: 'REMARKS', field: 'transactionremarks', width: 200 },
        { headerName: 'TYPE', field: 'transactiongroupname', width: 200 },
        { headerName: 'AMOUNT', field: 'total', width: 150, cellStyle: { textAlign: 'center', color: 'green' } },
      ]
    }
    else if (this.type == 'monthly_datewise') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'DATE', field: 'transaction_date', width: 200 },
        { headerName: 'CHEQUE', field: 'cheque', width: 250, cellStyle: { textAlign: 'center' }, },
        { headerName: 'CASH', field: 'cash', width: 220, cellStyle: { textAlign: 'center', color: 'green' }, },
        { headerName: 'ACCOUNT	', field: 'account', width: 200, cellStyle: { textAlign: 'center' } },
        { headerName: 'ONLINE', field: 'online', width: 200 },
        { headerName: 'DEDUCTION', field: 'detection', width: 200 },
        { headerName: 'TOTAL', field: 'total', width: 200 },
      ]
    }
    else if (this.type == 'user_rechargehistory') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90, filter: false },
        { headerName: 'OPERATOR NAME', field: 'operatorname', cellStyle: { textAlign: 'left' }, width: 300, },
        { headerName: 'CUSTOMER NAME', field: 'customername', cellStyle: { textAlign: 'left' }, width: 200 },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', cellStyle: { textAlign: 'center' }, width: 200 },
        { headerName: 'SMARTCARD', field: 'smartcard', cellStyle: { textAlign: 'center', color: 'green' }, width: 250 },
        { headerName: 'PRODUCT NAME	', field: 'packagename', cellStyle: { textAlign: 'center' }, width: 250 },
        { headerName: 'ACTION', field: 'action', width: 100 },
        { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 250 },
        { headerName: 'LCO AMOUNT', field: 'lcocommission', width: 200 },
        { headerName: 'MSO AMOUNT', field: 'msoamount', width: 200 },
        { headerName: 'LOG DATE', field: 'logdate', width: 200 },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200 },
      ]
    } else if (this.type == 'lco_active_subscription') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90, filter: false },
        { headerName: 'OPERATOR ID', field: 'operatorname', },
        { headerName: 'OPERATOR NAME', field: 'operatorname', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', cellStyle: { textAlign: 'center' }, },
        { headerName: 'AREA NAME', field: 'areaname', cellStyle: { textAlign: 'left', color: 'green' }, },
        { headerName: 'LCO INVENTORY', field: 'lcoend', cellStyle: { textAlign: 'center' } },
        { headerName: 'SUBSCRIBER INVENTORY', field: 'subscriberend', cellStyle: { textAlign: 'center' } },
        { headerName: 'ACTIVE', field: 'active', cellStyle: { textAlign: 'center' } },
        { headerName: 'EXPIRY', field: 'expiry', cellStyle: { textAlign: 'center' } },
        { headerName: 'TOTAL', field: 'total', cellStyle: { textAlign: 'center' } },
      ]
    }
    else if (this.type == 'lcowiseExpiryCountDiff') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false, headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'OPERATOR ID', field: 'operator_id', cellStyle: { textAlign: 'center' } },
        { headerName: 'OPERATOR NAME', field: 'name', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'AREA NAME', field: 'area', },
        { headerName: 'ACTIVE COUNT', field: 'active', cellStyle: { textAlign: 'center' } },
        { headerName: 'EXPIRY COUNT', field: 'deactive', cellStyle: { textAlign: 'center' } },
        { headerName: `EXPIRY COUNT ${this.selectedMonthName}`, field: 'expiryfrom', cellStyle: { textAlign: 'center' } },
        { headerName: `EXPIRY COUNT ${this.selectedDateMonthName}`, field: 'expiryto', cellStyle: { textAlign: 'center' } },
        { headerName: 'DIFFERENCE', field: 'difference', cellStyle: { textAlign: 'center' } },
      ]
    }
    else if (this.type == 'total_lco') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false, headerCheckboxSelection: false,
          checkboxSelection: false, width: 90
        },
        { headerName: 'LCO NAME', field: 'Operator_Name', filter: false, cellStyle: { textAlign: 'left', }, },
        { headerName: 'LCO ID', field: 'Operator_ID', filter: false, cellStyle: { textAlign: 'center', }, },
        { headerName: 'AREA', field: 'Area', filter: false, cellStyle: { textAlign: 'left', }, },
        { headerName: 'ADDRESS', field: 'address', cellStyle: { textAlign: 'left', }, },
        { headerName: 'PINCODE', field: 'pincode', filter: false, cellStyle: { textAlign: 'center' } },
        { headerName: 'MOBILE NUMBER', field: 'Contact_Number1', cellStyle: { textAlign: 'center' }, filter: false, },
        { headerName: 'USER ID', field: 'user_id', filter: false, cellStyle: { textAlign: 'left', }, },
      ]
    } else if (this.type == 'lco_transfer_details') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 90, filter: false },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 250, },
        { headerName: 'OLD CUSTOMER NAME', field: 'oldcustomername', width: 230, },
        { headerName: 'NEW CUSTOMER NAME', field: 'newcustomername', cellStyle: { textAlign: 'left', color: 'green', }, width: 250, },
        { headerName: 'OLD OPERATOR	', field: 'oldoperatorname', cellStyle: { textAlign: 'left' }, width: 300, },
        { headerName: 'NEW OPERATOR	', field: 'newoperatorname', cellStyle: { textAlign: 'left', color: 'green', width: 300, }, },
        { headerName: 'LOG DATE', field: 'logdate', cellStyle: { textAlign: 'center' }, width: 250, },
      ]
    } else if (this.type == 'subscriber_bill') {
      this.columnDefs = [
        { headerName: 'SMARTCARD', field: 'referenceid', filter: false },
        { headerName: 'DATE', field: 'transactiondate', filter: false },
        { headerName: 'EXPIRY DATE', field: 'expirydate', cellStyle: { textAlign: 'center', }, filter: false },
        { headerName: 'PACKAGE', field: 'packagename', filter: false },
        { headerName: 'PLAN', field: 'days', filter: false, cellStyle: { textAlign: 'center' }, },
        { headerName: 'AMOUNT', field: 'customeramount', cellStyle: { textAlign: 'center' }, filter: false, },
      ]
    } else if (this.type == 'sublco_offline') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false, headerCheckboxSelection: false, checkboxSelection: false, width: 90 },
        { headerName: 'RETAILER ID', field: 'retailerid', cellStyle: { textAlign: 'center', }, },
        { headerName: 'RETAILER NAME', field: 'retailername', },
        { headerName: 'AMOUNT	', field: 'lcoamount', cellStyle: { textAlign: 'center', }, filter: false },
        { headerName: 'OPERATOR NAME', field: 'operatorname', },
        { headerName: 'LOG DATE', field: 'transactiondate', filter: false, cellStyle: { textAlign: 'center' }, },
        { headerName: 'MOBILE', field: 'contact', cellStyle: { textAlign: 'center' }, },
        { headerName: 'REMARKS', field: 'transactionremarks', cellStyle: { textAlign: 'center' }, },
      ]
    } else if (this.type == 'unpair_smartcard') {
      this.columnDefs = [
        { headerName: 'CUSTOMER NAME', field: 'referenceid', },
        { headerName: 'AREA ID', field: 'transactiondate', },
        { headerName: 'CUSTOMER NO', field: 'expirydate', cellStyle: { textAlign: 'center', }, },
        { headerName: 'OPERATOR NAME', field: 'packagename', },
        { headerName: 'SMARTCARD', field: 'days', cellStyle: { textAlign: 'center' }, },
        { headerName: 'PACKAGE NAME', field: 'customeramount', cellStyle: { textAlign: 'center' }, },
        { headerName: 'ACTION', field: 'customeramount', cellStyle: { textAlign: 'center' }, },
        { headerName: 'TRANSACTION TYPE', field: 'customeramount', cellStyle: { textAlign: 'center' }, },
        { headerName: 'DAYS', field: 'customeramount', cellStyle: { textAlign: 'center' }, filter: false, },
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
  formatDate1(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  cur_date: any;
  getFromDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
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
    this.swal.Loading();
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
    if (this.role == 'ROLE_SUBLCO') {
      this.swal.Loading();
      this.userService.getRechargeHistory(this.role, this.username, this.selectedRechargeType, this.subOperatorId, this.fromdate, this.todate, 0, 4,
        this.retailerId, 3, 0).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log(response);
              this.rowData = response.body;
              const rowCount = this.rowData.length;
              if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
                this.gridOptions.paginationPageSizeSelector.push(rowCount);
              }
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
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      console.log(this.subOpid);
      this.swal.Loading();
      this.userService.getRechargeHistory(this.role, this.username, this.selectedRechargeType, this.subOpid, this.fromdate, this.todate, 0, 5,
        0, 3, this.subscriberid).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log(response);
              this.rowData = response.body;
              const rowCount = this.rowData.length;
              if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
                this.gridOptions.paginationPageSizeSelector.push(rowCount);
              }
              // this.swal.Success_200();
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
    else {
      this.smartcard = this.smartcardChange(this.smartcard);
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistory(this.role, this.username, this.selectedRechargeType, this.selectedOperator.value || this.operatorId || 0, this.fromdate, this.todate, this.smartcard, this.useragent,
        this.selectedSubLcoName, 3, 0
      ).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
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
  }

  getRechargeExcel() {
    if (this.role == 'ROLE_SUBLCO') {
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.subOperatorId, this.fromdate, this.todate, 0, 4, this.retailerId, 2, 0
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
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.subOpid, this.fromdate, this.todate, 0, 5, 0, 2, this.subscriberid
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
    } else {

      this.smartcard = this.smartcardChange(this.smartcard);
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.selectedOperator.value || this.operatorId || 0, this.fromdate, this.todate, this.smartcard, this.useragent,
        this.selectedSubLcoName, 2, 0
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
    }
  }
  getRerchargePdf() {
    if (this.role == 'ROLE_SUBLCO') {
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.subOperatorId, this.fromdate, this.todate, 0, 4, this.retailerId, 1, 0
      )
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
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
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.subOpid, this.fromdate, this.todate, 0, 5, 0, 1, this.subscriberid
      )
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
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
    }
    else {
      this.smartcard = this.smartcardChange(this.smartcard);
      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userService.getRechargeHistoryReport(this.role, this.username, this.selectedRechargeType, this.selectedOperator.value || this.operatorId || 0, this.fromdate, this.todate, this.smartcard, this.useragent,
        this.selectedSubLcoName, 1, 0
      )
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
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
    }
  }
  // -----------------------------------------------------------Online history report----------------------




  getOnline() {

    if (this.role == 'ROLE_SUBLCO') {
      this.userService.getOnlinePaymentHistory(
        this.role,
        this.username,
        this.fromdate,
        this.todate,
        this.subOperatorId,
        this.retailerId,
        this.smartcard || 0,
        2,
        3,
        this.isspecial, 0
      ).subscribe(
        (res: any) => {
          this.swal.success_1(res?.message);
          this.rowData = res;
          console.log(this.rowData);
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          this.swal.Close();
        },
        (err) => {
          this.swal.Error(err?.error?.message || err?.error);
          this.rowData = [];
        }
      );
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      this.userService.getOnlinePaymentHistory(
        this.role,
        this.username,
        this.fromdate,
        this.todate,
        this.subOperatorId || this.subOpid,
        this.retailerId || 0,
        this.smartcard || 0,
        3,
        3,
        this.isspecial,
        this.subscriberid
      ).subscribe(
        (res: any) => {
          this.swal.success_1(res?.message);
          this.rowData = res;
          console.log(this.rowData);
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          this.swal.Close();
        },
        (err) => {
          this.swal.Error(err?.error?.message || err?.error);
          this.rowData = [];
        }
      );
    } else {
      if (Number(this.selectedOnlineType) === 1) {
        // if (!this.selectedOperator?.value && !this.operatorId) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Validation Error",
        //     text: "Please select an Online Type.",
        //   });
        //   return;
        // }
        if ((this.selectedOperator?.value === undefined || this.selectedOperator?.value === null) &&
          (this.operatorId === undefined || this.operatorId === null)) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please select an Online Type.",
          });
          return;
        }
      } else if (Number(this.selectedOnlineType) === 2) {
        // this.handleSublcoSelection();

        // if (!this.selectedOperator?.value && !this.operatorId ) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Validation Error",
        //     text: "Please select an Operator.",
        //   });
        //   return;
        // }

        if ((this.selectedOperator?.value === undefined || this.selectedOperator?.value === null) &&
          (this.operatorId === undefined || this.operatorId === null)) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please select an Operator.",
          });
          return;
        }
        this.selectedSubLcoName;

      } else if (Number(this.selectedOnlineType) === 3) {
        // this.selectedOperator.value = '0';
        this.selectedOperator = { value: '0' };
        this.selectedSubLcoName = '0';
      }

      this.smartcard = this.smartcardChange(this.smartcard);


      Swal.fire({
        title: "Processing",
        text: "Please wait while the report is being generated...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });

      if (this.role == 'ROLE_SPECIAL') {
        if (this.type == 'online_payment_special') {
          this.isspecial = true
        }
      } else {
        this.isspecial = false
      }
      this.userService.getOnlinePaymentHistory(
        this.role,
        this.username,
        this.fromdate,
        this.todate,
        this.selectedOperator?.value || this.operatorId || 0,
        this.selectedSubLcoName || 0,
        this.smartcard,
        this.selectedOnlineType,
        3,
        this.isspecial, 0
      ).subscribe(
        (res: any) => {
          this.swal.success_1(res?.message);
          this.rowData = res;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          this.swal.Close();
        },
        (err) => {
          this.swal.Error(err?.error?.message || err?.error);
          this.rowData = [];
        }
      );
    }
  }




  handleOperatorSelection() {
    if (!this.selectedOperator?.value) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select an Online Type.",
      });
      return;
    }
    this.selectedSubLcoName = "0";
    this.smartcard = "0";
  }

  handleSublcoSelection() {
    if (!this.selectedOperator?.value) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select an Operator.",
      });
      return;
    }
    if (!this.selectedSubLcoName) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a Sub LCO.",
      });
      return;
    }
  }

  handleSubscriberSelection() {
    this.selectedOperator.value = { value: "0" };
    this.selectedSubLcoName = "0";
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
    if (this.role == 'ROLE_SPECIAL') {
      if (this.type == 'online_payment_special') {
        console.log('123sdfsdfdsfdsf');
        this.isspecial = true
      }
    } else {
      this.isspecial = false
    }
    if (this.role == 'ROLE_SUBLCO') {
      this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate, this.subOperatorId, this.retailerId, this.smartcard || 0, 2, 2, this.isspecial, 0)
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
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate, this.subOpid || this.subOpid,
        this.retailerId || 0, this.smartcard || 0, 3, 2, this.isspecial, this.subscriberid)
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
    } else {
      this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value || this.operatorId || 0, this.selectedSubLcoName, this.smartcard, this.selectedOnlineType, 2, this.isspecial, 0)
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
    }


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
    if (this.role == 'ROLE_SPECIAL') {
      if (this.type == 'online_payment_special') {
        this.isspecial = true
      }
    } else {
      this.isspecial = false
    }
    if (this.role == 'ROLE_SUBLCO') {
      this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate,
        this.subOperatorId, this.retailerId, this.smartcard || 0, 2, 1, this.isspecial, 0)
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
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate,
        this.subOperatorId || this.subOpid, this.retailerId || 0, this.smartcard || 0, 3, 1, this.isspecial, this.subscriberid)
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
    } else {
      this.userService.getOnlinePaymentHistoryReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value || this.operatorId || 0, this.selectedSubLcoName, this.smartcard, this.selectedOnlineType, 1, this.isspecial, 0)
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
    }
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
    this.swal.Loading();
    this.userService.getExcluding(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedStatus, this.selectedOperator.value, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
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
    this.swal.Loading();
    this.userService.getExcludingReport(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedStatus, this.selectedOperator.value, type
    )
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, this.type + '  ' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx", 'application/xlsx');
        }
        this.swal.Close();
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });

  }
  // ================================================MSO LCOWISE SUBSCRIPTION COUNT===============================

  lcowiseActiveSubCount() {
    this.swal.Loading();
    this.userService.getLcowiseActiveSubCount(this.role, this.username, this.selectedOperator.value, this.selectedlcoModel, 3, this.batch, this.selectedlcocas).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          // this.swal.Success_200();
          this.swal.Close();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.swal.Close();
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
    this.swal.Loading();

    this.userService.getIncluding(this.role, this.username, this.fromdate, this.todate, this.selectedMonth, this.selectedYear, this.selectedDateType, this.selectedType,
      this.selectedAmount, this.selectedOperator.value || 0, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
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
    this.swal.Loading();
    this.userService.getWalletShareReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value || this.operatorId || 0, 3)
      .subscribe((res: any) => {
        this.rowData = res;
        const rowCount = this.rowData.length;
        if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
          this.gridOptions.paginationPageSizeSelector.push(rowCount);
        }
        this.swal.Close();
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getWalletReportDownload(type: number) {
    this.processingSwal();
    this.swal.Loading();
    this.userService.getWalletShareReportDownload(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value || this.operatorId || 0, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Wallet_Share_Report(" + this.fromdate + "-" + this.todate + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Wallet_Share_Report(" + this.fromdate + "-" + this.todate + ").xlsx", 'application/xlsx');
        }
        this.swal.Close();
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
    this.swal.Loading()
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
        this.swal.Close()
        const rowCount = this.rowData.length;
        if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
          this.gridOptions.paginationPageSizeSelector.push(rowCount);
        }
        console.log(this.rowData);
        console.log(this.subscriberBill);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

  }

  getSubscriberBillDownload(type: number) {
    this.swal.Loading()
    this.processingSwal();
    this.userService.getSubscriberBillDownload(this.role, this.username, this.selectedMonth, this.selectedYear, type, this.smartcard)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Subscriber_Recharge_Details(" + this.smartcard + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Subscriber_Recharge_Details(" + this.smartcard + ").xlsx", 'application/xlsx');
        }
        this.swal.Close()
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
    this.swal.Loading();

    this.userService.getLcowiseExpirySubCount(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 3
    ).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log(response);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          this.swal.Success_200();
          this.swal.Close()
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.swal.Close()
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
    this.swal.Loading();
    this.userService.getUserRecharegeHistory(this.role, this.username, this.fromdate, this.todate, this.selectedUser ? this.selectedUser.value : 0, 3)
      .subscribe((res: any) => {
        console.log('322');
        console.log(res);
        this.rowData = res;
        const rowCount = this.rowData.length;
        if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
          this.gridOptions.paginationPageSizeSelector.push(rowCount);
        }
        this.swal.Close();
      }, (err) => {
        this.swal.Error(err?.error?.message);
        this.swal.Close();
      });
  }

  getUserRechargeHistoryDownload(type: number) {
    this.processingSwal();
    this.swal.Loading();
    this.userService.getUserRecharegeHistoryDownload(this.role, this.username, this.fromdate, this.todate, this.selectedUser ? this.selectedUser.value : 0, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Subscriber_Recharge_History(" + this.selectedUser.name + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Subscriber_Recharge_History(" + this.selectedUser.name + ").xlsx", 'application/xlsx');
        }
        this.swal.Close();
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
    console.log(error);

    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error?.message || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok',
      timer: 2000,
      timerProgressBar: true,
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
      this.userService.getCasFormActivationReport(this.role, this.username, this.smartcard, type)
        .subscribe((x: Blob) => {
          if (type == 1) {
            this.reportMaking(x, this.type + '  ' + this.smartcard + ".pdf", 'application/pdf');
          }
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            // this.pdfswalError(error?.error?.message);
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
            const rowCount = this.rowData1.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
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
    if (this.isLcoSmartcard) {
      this.userService.getLcoTransferReport(this.role, this.username, this.smartcard1 || 0, this.selectedOperator.value || this.operatorId || 0, 0, 0, 3)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log(response);
              this.rowData = response.body;
              const rowCount = this.rowData.length;
              if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
                this.gridOptions.paginationPageSizeSelector.push(rowCount);
              }
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
            this.handleApiError(error?.error?.message, error?.status);
          }
        );
    } else {
      this.userService.getLcoTransferReport(this.role, this.username, this.smartcard1 || 0, this.selectedOperator.value || this.operatorId || 0, this.fromdate, this.todate, 3)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log(response);
              this.rowData = response.body;
              const rowCount = this.rowData.length;
              if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
                this.gridOptions.paginationPageSizeSelector.push(rowCount);
              }
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
            this.handleApiError(error?.error?.message, error?.status);
          }
        );
    }


  }

  getLcoTransferReportDownload(type: number) {
    this.processingSwal();

    if (this.isLcoSmartcard) {
      this.userService.getLcoTransferReportDownload(this.role, this.username, this.smartcard1, this.selectedOperator.value || this.operatorId || 0, 0, 0, type)
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
    } else {
      this.userService.getLcoTransferReportDownload(this.role, this.username, this.smartcard1, this.selectedOperator.value || this.operatorId || 0, this.fromdate, this.todate, type)
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
  }
  // ================================================ SUB LCO OFFLINE DETAILS REPORT===============================

  getSubLcoOfflineDetailsReport() {
    this.swal.Loading();
    this.userService.getsubLcoOfflineReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, this.selectedSubLcoName, 3)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log(response);
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
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
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
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
        const rowCount = this.rowData.length;
        if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
          this.gridOptions.paginationPageSizeSelector.push(rowCount);
        }
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

      this.columnDefs3 = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
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

      this.columnDefs3 = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
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

      this.columnDefs3 = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
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

