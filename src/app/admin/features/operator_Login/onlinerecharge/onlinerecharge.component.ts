import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-onlinerecharge',
  templateUrl: './onlinerecharge.component.html',
  styleUrls: ['./onlinerecharge.component.scss']
})
export class OnlinerechargeComponent {
  balanceclass!: String;
  walletbalance = 0;
  curcode: any;
  currency: any;
  recenthistory: any;
  displayedColumns: string[] = ['creationdate', 'amount'];
  rowDataOnline: any;
  amountControl!: FormControl;

  loading = false;
  gridApi: any;
  gateWayMode: any;
  rowData: any;

  payGroup!: FormGroup;

  clienttype: any;
  dateRange: any;

  date1: any;
  fromdate: any;
  todate: any;
  fdate: any;
  tdate: any;
  today: any;

  gridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      width: 180,
      floatingFilter: true,
    },
    pagination: true,
  };

  constructor(
    // private pdfService: PdfService,
    // private notify: NotificationService,
    private userservice: BaseService,
    private token: StorageService,
    // private dateFormatService: DateConvertService,
    private excelService: ExcelService,
    private observer: BreakpointObserver,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    // private loader: LoaderService

  ) {
    this.amountControl = new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{0,9}$'),
    ]);

    // this.clienttype = this.token.getProviderType();

  }

  onGridReady(params: { api: any }) {
    this.gridApi = params.api;
    this.getData('0000-00-00', '0000-00-00');
  }

  //...................................Payment Gateway Download......................................
  onLoadPage() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    console.log(this.gateWayMode.gateway.gatewayname);

    // if (this.gateWayMode.gateway.gatewayname == 'EBUZZ') {
    //   this.makeEaseBuzzPayment();
    // } else if (this.gateWayMode.gateway.gatewayname == 'AGGREPAY') {
    //   this.goPaymentAgree();
    // }
  }

  //...................................Search Filter Table.....................................
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }

  getData(fromdate: any, todate: any) {
    // this.load();

    // this.userservice
    //   .getOnlineRechargeList(
    //     this.token.getUserRole(),
    //     fromdate,
    //     todate
    //   )
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.rowDataOnline = data;
    //     this.onlineTransList = data;
    //   });
    // this.userservice
    //   .getWalletUpdateLogForOperator(fromdate, todate)
    //   .subscribe((datas) => {
    //     this.rowData = datas;
    //     this.history = datas;
    //   });
  }


  statusStyleResponse(params: { value: string }) {
    // console.log(params.value);
    if (
      params.value == 'Transaction Successful' ||
      params.value == 'Transaction successful'
    ) {
      return { color: 'green' };
    } else if (params.value == 'Transaction Failed') {
      return {
        color: 'red',
      };
    } else {
      return { color: '#8A2BE2' };
    }
  }


  // -------------------------------------------column-------------------------

  columnDefsOnline = [
    {
      headerName: 'S.No',
      lockPosition: true,
      valueGetter: 'node.rowIndex+1',
      cellClass: 'locked-col',
      width: 60,
      suppressNavigable: true,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Refresh',
      field: 'wallet',
      width: 90,
      // cellRendererFramework: RefreshComponent,
    },
    // { headerName: "LCO Name", field: 'username', width: 120 },
    // { headerName: "Role", field: 'role', width: 100 },

    {
      headerName: 'Amount',
      field: 'amount',
      width: 100,
      // valueFormatter: (params: { data: { amount: any } }) =>
      //   Formatter(params.data.amount, this.currency),
    },
    // { headerName: "Gateway Id", field: 'gatewayid', width: 120 },
    // { headerName: "Paymenttype Id", field: 'paymenttypeid', width: 150 },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellStyle: (params: { value: string }) => {
        if (params.value === 'Initiated') {
          //mark police cells as red
          return { color: '#e39a1b' };
        } else if (params.value === 'pending' || params.value === 'pending') {
          return { color: '#8A2BE2' };
        }
        return { color: '#e31ba7' };
      },
    },
    {
      headerName: 'Responce Message',
      field: 'resmsg',
      width: 150,
      cellStyle: this.statusStyleResponse,
    },
    {
      headerName: 'Error Message',
      field: 'errormsg',
      width: 200,
      cellStyle: { color: 'red' },
    }, {
      headerName: 'Remark',
      field: 'remark',
      width: 200,
    },
    { headerName: 'Transaction Date', field: 'tstarttime' },
    { headerName: 'Order Id', field: 'orderid' },
  ];


  //...................................Table ColumnDefs Rupee Symble.....................................
  amountFormatter(walletbalance: any, sign: any) {
    var amount: number = +walletbalance;
    var sansDec = amount.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  Formatter(cost: any, sign: any) {
    var amount: number = +cost;
    var sansDec = amount.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }
  amountFormatter1(cost: any, sign: any, fsign: any) {
    var old: number = cost.data.oldbalance * 100;
    var newb: number = cost.data.newbalance * 100;
    // console.log(old > newb);

    if (old > newb) {
      var amount: number = +cost.data.amount;
      var sansDec = amount.toFixed(2);
      var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return fsign + `${formatted}`;
    } else var amount: number = +cost.data.amount;
    var sansDec = amount.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  onDateSelected(event: any) {
    // this.dateFormatService.convertDateFormat(
    //   this.dateRange.value.fromdate._d,
    //   this.dateRange.value.todate._d
    // );
    // this.fromdate = this.dateFormatService.fromdate;
    // this.todate = this.dateFormatService.todate;
    // // this.load();
    // this.loader.showLoader();
    // this.getData(this.fromdate, this.todate);
    // this.loader.hideLoader();
  }


  //...................................Excel Dowmload.....................................
  exportExcel() {
    // this.load();
    // const areasub = 'A1:H1';
    // const areatitle = 'A2:H3';
    // const title = this.token.getUserRole() + ' WALLET HISTORY';
    // this.fdate = this.fromdate;
    // this.tdate = this.todate;
    // if (this.fdate === undefined && this.tdate === undefined) {
    //   this.fdate = 'NA';
    //   this.tdate = 'NA';
    // }
    // const header = [
    //   'Wallect Updated Date',
    //   'Old Balance',
    //   'Amount',
    //   'New Balance',
    //   'Recharge Type',
    //   'Wallet Update Type',
    //   'Reference Id',
    //   'Payment Type',
    // ];
    // // const data = this.history;
    // const datas: Array<any> = [];
    // data.forEach((d: any) => {
    //   const row = [
    //     d.creationdate,
    //     d.oldbalance,
    //     d.amount,
    //     d.newbalance,
    //     d.rechargetypename,
    //     d.walletupdatetypename,
    //     d.referenceid,
    //     d.paymenttypename,
    //   ];
    //   datas.push(row);
    // });
    // const cellsize = {
    //   a: 30,
    //   b: 20,
    //   c: 15,
    //   d: 15,
    //   e: 15,
    //   f: 30,
    //   g: 35,
    //   h: 20,
    //   i: 20,
    //   j: 20,
    //   k: 20,
    //   l: 20,
    //   m: 20,
    //   n: 15,
    //   o: 30,
    //   p: 15,
    //   q: 25,
    //   r: 15,
    //   s: 20,
    //   t: 15,
    //   u: 15,
    // };
    // this.excelService.generateExcel(
    //   areasub,
    //   areatitle,
    //   header,
    //   datas,
    //   title,
    //   this.fdate,
    //   this.tdate,
    //   cellsize
    // );
  }

  exportPdf() {
    // console.log(this.listUser);
    this.load();

    // const title = this.token.getUserRole() + ' WALLET HISTORY';
    let Fields = [
      'Payment user',
      'Old Balance',
      'Amount',
      'New Balance',
      'Recharge Type',
      'Wallet Update Type',
      'Reference Id',
      'status',
      'Wallect Updated Date'
    ];
    let dataFields = [
      'paymentbyusername',
      'oldbalance',
      'amount',
      'newbalance',
      'rechargetypename',
      'walletupdatetypename',
      'referenceid',
      'status',
      'creationdate'
    ];
    let column_width = ['15%', '9%', '8%', '9%', '8%', '15%', '15%', '8%', '15%']
    this.fdate = this.fromdate;
    this.tdate = this.todate;
    if (this.fdate === undefined && this.tdate === undefined) {
      this.fdate = 'NA';
      this.tdate = 'NA';
    }
    // this.pdfService.generatePDFSP(
    //   'download',
    //   this.history,
    //   title,
    //   Fields,
    //   dataFields, column_width,
    //   this.fdate,
    //   this.tdate
    // );
  }

  load() {
    // const dialogData = new LoadingDialogModel('1'); // 4 is not available
    // const dialogRef = this.dialog.open(LoadingComponent, {
    //   maxWidth: '1000px',
    //   disableClose: true,
    //   data: dialogData,
    //   panelClass: 'loading-style',
    // });
  }
  //...................................AG Grid Table.....................................
  columnDefs = [
    {
      headerName: 'S.No',
      lockPosition: true,
      valueGetter: 'node.rowIndex+1',
      cellClass: 'locked-col',
      width: 60,
      suppressNavigable: true,
      sortable: false,
      filter: false,
    },
    { headerName: 'Wallect Updated Date', field: 'creationdate', width: 170 },
    {
      headerName: 'Old Balance',
      field: 'oldbalance',
      width: 130,
      // valueFormatter: (params: { data: { oldbalance: any } }) =>
      //   amountFormatter(params.data.oldbalance, this.currency),
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 130,
      // valueFormatter: (params: { data: { amount: any } }) =>
      //   amountFormatter1(params, '+' + this.currency, '-' + this.currency),
      // cellStyle: this.amountstatusStyle,
    },
    {
      headerName: 'New Balance',
      field: 'newbalance',
      width: 130,
     
    },
    { headerName: 'Customer Name', field: 'username', width: 150 },
    { headerName: 'Recharge Type', field: 'rechargetypename', width: 130 },
    {
      headerName: 'Wallet Update Type',
      field: 'walletupdatetypename',
      width: 200,
    },
    { headerName: 'Reference Id', field: 'referenceid', width: 170 },
    {
      headerName: 'Status Type',
      field: 'status',
      width: 130,
      // cellStyle: this.statusStyle,
    },
    // { headerName: "Payment Type", field: 'paymenttypename', width: 130 }
  ];



}

class requestBody {
  amount: String = '0';
  username: String = '';
  role: String = '';
  returnurl: String = '';
  locaterurl: String = '';
  planid: String = '';
  remark: String = '';
  title: String = '';

  //...................................Table ColumnDefs Rupee Symble.....................................
 amountFormatter(walletbalance: any, sign: any) {
  var amount: number = +walletbalance;
  var sansDec = amount.toFixed(2);
  var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + `${formatted}`;
}

 Formatter(cost: any, sign: any) {
  var amount: number = +cost;
  var sansDec = amount.toFixed(2);
  var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + `${formatted}`;
}
amountFormatter1(cost: any, sign: any, fsign: any) {
  var old: number = cost.data.oldbalance * 100;
  var newb: number = cost.data.newbalance * 100;
  // console.log(old > newb);

  if (old > newb) {
    var amount: number = +cost.data.amount;
    var sansDec = amount.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return fsign + `${formatted}`;
  } else var amount: number = +cost.data.amount;
  var sansDec = amount.toFixed(2);
  var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + `${formatted}`;
}
  
}

