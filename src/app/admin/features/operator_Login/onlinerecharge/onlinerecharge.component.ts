import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var EasebuzzCheckout: any;
@Component({
  selector: 'app-onlinerecharge',
  templateUrl: './onlinerecharge.component.html',
  styleUrls: ['./onlinerecharge.component.scss']
})
export class OnlinerechargeComponent implements OnInit {

  role: any;
  username: any;
  amount: any ;
  operatorid: any;
  transResponse: any;
  easebuzzData: any;
  balanceclass!: String;
  walletbalance = 0;
  curcode: any;
  currency: any;
  recenthistory: any;
  displayedColumns: string[] = ['creationdate', 'amount'];
  rowDataOnline: any[] = [];
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

  dateRangeForm: FormGroup;

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


  mode: any;
  access_key: any;
  apikey: any;
  gatewaymode: any;

  operatorDetails: any;

  constructor(
    // private pdfService: PdfService,
    // private notify: NotificationService,
    private userservice: BaseService,
    private storageService: StorageService,
    // private dateFormatService: DateConvertService,
    private excelService: ExcelService,
    private observer: BreakpointObserver,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private swal: SwalService,
    private fb: FormBuilder,
    // private loader: LoaderService

  ) {
    this.amountControl = new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{0,9}$'),
    ]);

    // this.clienttype = this.token.getProviderType();
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();

    this.dateRangeForm = this.fb.group({
      fromdate: [new Date('2024-03-01')], // Set default start date
      todate: [new Date('2024-03-15')] // Set default end date
    })

  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ngOnInit(): void {
    this.getOperatorDetails();

    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    this.dateRangeForm.patchValue({
      fromdate: this.fromdate,
      todate: this.todate
    });
    this.getOnline();
  }


  onGridReady(params: { api: any }) {
    this.gridApi = params.api;
    this.getData('0000-00-00', '0000-00-00');
  }

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


  //...................................Payment Gateway Download......................................
  onLoadPage() {
    console.log("888");

    // this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    // }, 3000);
    // console.log(this.gateWayMode.gateway.gatewayname);

    // if (this.gateWayMode.gateway.gatewayname == 'EBUZZ') {
    this.makeEaseBuzzPayment();
    // } 
    // else if (this.gateWayMode.gateway.gatewayname == 'AGGREPAY') {
    //   this.goPaymentAgree();
    // }
  }
  getOperatorDetails() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorDetails = data;
      this.operatorid = data.operatorid;
      console.log(this.operatorid);
      this.getGatewayDetails(this.operatorid);
    })
  }
  getGatewayDetails(op_id: any) {
    console.log(this.operatorid);

    this.userservice.getLcoPaymentGatewayDetails(this.role, this.username, op_id).subscribe((res: any) => {
      console.log(res);
      this.apikey = res.apikey;
      // this.access_key = res.apikey;
      this.gatewaymode = res.mode;
      console.log(this.gatewaymode);

    })
  }

  makeEaseBuzzPayment() {

    this.userservice.lcoOnlineInitialRequest(this.role, this.username, this.amount || 0, this.operatorid).subscribe((res: any) => {
      this.transResponse = res;
      console.log(res);
      this.easebuzzData = this.transResponse.data;
      // this.swal.success(res?.message);
      if (res.status == '1') {
        // const dialogData = new LoadingDialogModel('100');
        // const dialogRef = this.dialog.open(LoadingComponent, {
        //   maxWidth: '800px',
        //   disableClose: true,
        //   data: dialogData,
        //   panelClass: 'loading-style',
        // });
        // console.log(res);

        // let url = "https://pay.easebuzz.in/pay/" + res.data;
        // let url = this.gateWayMode.baseurl + res.data;
        // baseurl
        // this.openChildWindow(url);

        if (this.gatewaymode == 'LIVE') {
          this.mode = 'prod';
        } else {
          this.mode = 'test';
        }


        var easebuzzCheckout = new EasebuzzCheckout(
          // this.gateWayMode.apikey,
          // this.mode
          this.apikey,
          this.mode,);
        console.log("hhhh", this.apikey);
        console.log(this.easebuzzData);

        var options = {
          // access_key: res.data,
          access_key: this.easebuzzData,
          onResponse: (response: any) => {
            // dialogRef.close();
            console.log('wsedasdsad', response);
            if (response.status) {
              this.swal.Loading();
              this.userservice
                // .lcoOnlineFailurelRecharge(response, false, "0", "wallet")
                .lcoOnlineFailurelRecharge(this.role, this.username, response.amount, this.operatorid, response.txnid, response.status, response.hash)
                // .subscribe((res: any) => {
                //   console.log(res);
                //   // const dialogRef = this.dialog.open(PaymentStatusComponent, {
                //   //   data: res,
                //   //   minWidth: '360px',
                //   //   panelClass: 'paymentstatus'
                //   // });
                //   this.swal.Close();
                // }, err => {
                //   console.log(err);
                //   // this.iconRedirect(this.transResponse.txnid, 'wallet', false);
                // });
                .subscribe((res: any) => {
                  this.swal.success(res?.message);
                }, (err) => {
                  this.swal.Error(err?.error?.message);
                });
            } else {
              // this.iconRedirect(this.transResponse.txnid, 'wallet', false);
            }
          },
          theme: '#123456',
        };
        console.log("0000000000000000000");
        console.log();

        easebuzzCheckout.initiatePayment(options);
        console.log("hhh21h", this.easebuzzData);

        // dialogRef.afterClosed().subscribe((dialogResult) => {
        //   if (dialogResult === 1) {
        //     this.getWalletInfo();
        //     this.getData(this.fromdate, this.todate);
        //   }
        // });
      } else {
        alert(res.data);
      }
      // });
    }, (err) => {
      console.log(err)
      this.swal.Error(err?.error?.message);
    });
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
  getOnline() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.getOnlinePaymentHistory(this.role, this.username, this.fromdate, this.todate, this.operatorid, 0, 0, 1, 3)
      .subscribe((res: any) => {
        this.swal.success_1(res?.message);
        this.rowDataOnline = res;
        this.swal.Close(); ``
      }, (err) => {
        this.swal.Error(err?.error?.message);
        // this.handleApiError(err.error.message, err);
        this.rowDataOnline = [];
        this.swal.Close();
      });




  }

  // -------------------------------------------column-------------------------

  columnDefsOnline = [
    {
      headerName: 'S.No',
      lockPosition: true,
      valueGetter: 'node.rowIndex+1',
      cellClass: 'locked-col',
      width: 90,
      suppressNavigable: true,
      sortable: false,
      filter: false,
    },

    // { headerName: 'OPERATOR NAME', field: 'operatorname', width: 250 },
    // { headerName: 'ORDER ID', field: 'orderid', width: 250, cellStyle: { textAlign: 'center' }, },
    // { headerName: 'AMOUNT', field: 'amount', width: 220, cellStyle: { textAlign: 'center', color: 'green' }, },
    // { headerName: 'STATUS	', field: 'status', width: 200, cellStyle: { textAlign: 'center' } },
    // { headerName: 'RESPONSE', field: 'response', width: 200 },
    // { headerName: 'TRANSACTION DATE', field: 'logdate', width: 200 },

    {
      // headerName: 'Refresh',
      headerName: 'OPERATOR NAME',
      field: 'operatorname',
      width: 180,
      // cellRendererFramework: RefreshComponent,
    },
    { headerName: "TORDER ID", field: 'orderid', width: 150 },
    { headerName: "AMOUNT", field: 'amount', width: 100 },

    {
      headerName: 'STATUS',
      field: 'status',
      width: 150,

    },
    { headerName: "RESPONSE", field: 'response', width: 150 },
    // { headerName: "Paymenttype Id", field: 'paymenttypeid', width: 150 },
    {
      headerName: 'TRANSACTION DATE',
      field: 'logdate',
      width: 200,

    },
    {
      headerName: 'REMARKS',
      field: 'remarks',
      width: 150,
      cellStyle: this.statusStyleResponse,
    },


    // {
    //   // headerName: 'Refresh',
    //   headerName: 'TRANSACTION ID',
    //   field: 'wallet',
    //   width: 150,
    //   // cellRendererFramework: RefreshComponent,
    // },
    // { headerName: "TRANSACTION START TIME", field: 'starttime', width: 200 },
    // { headerName: "TRANSACTION END TIME", field: 'endtime', width: 200 },

    // {
    //   headerName: 'AMOUNT',
    //   field: 'amount',
    //   width: 150,

    // },
    // { headerName: "TRANSACTION STATUS", field: 'status', width: 150 },
    // // { headerName: "Paymenttype Id", field: 'paymenttypeid', width: 150 },
    // {
    //   headerName: 'WALLET',
    //   field: 'status',
    //   width: 100,
    //   cellStyle: (params: { value: string }) => {
    //     if (params.value === 'Initiated') {
    //       //mark police cells as red
    //       return { color: '#e39a1b' };
    //     } else if (params.value === 'pending' || params.value === 'pending') {
    //       return { color: '#8A2BE2' };
    //     }
    //     return { color: '#e31ba7' };
    //   },
    // },
    // {
    //   headerName: 'REMARKS',
    //   field: 'remarks',
    //   width: 120,
    //   cellStyle: this.statusStyleResponse,
    // },



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

