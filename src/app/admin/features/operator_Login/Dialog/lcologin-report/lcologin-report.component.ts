import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/_core/service/swal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-lcologin-report',
  templateUrl: './lcologin-report.component.html',
  styleUrls: ['./lcologin-report.component.scss']
})
export class LcologinReportComponent implements OnInit, AfterViewInit, OnDestroy {
  role: any;
  username: any;

  type: any;
  gridOptions = {
    defaultColDef: {
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData: any;
  columnDefs: any[] = [];

  fromdate: any;
  todate: any;
  today = new Date();

  lcoDeatails: any;
  operatorId: any;
  operatorname: any;
  dateRangeForm: FormGroup;

  lco: string = '';
  area: string = '';
  street: string = '';
  lcoList: Array<{ name: string, value: string }> = [];
  areaList: Array<{ name: string, value: string }> = [];
  streetList: Array<{ name: string, value: string }> = [];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private userService: BaseService, private storageService: StorageService, private location: Location, private swal: SwalService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.type = this.route.snapshot.paramMap.get('id');
    console.log('fgfdgfdgfdg', this.type);
    this.dateRangeForm = this.fb.group({
      fromdate: [new Date()],
      todate: [new Date()]
    });
  }
  ngOnDestroy(): void {
    ($('#Area') as any).select2('destroy');
    ($('#Street') as any).select2('destroy');
  }
  ngAfterViewInit() {
    ($('#area') as any).select2({
      placeholder: 'Select Area',
      allowClear: true
    });
    $('#area').on('change', (event: any) => {
      this.area = event.target.value;
      this.onAreaStatusChange(this.area);
    });
    ($('#street') as any).select2({
      placeholder: 'Select Street',
      allowClear: true
    });
    $('#street').on('change', (event: any) => {
      this.street = event.target.value;
      this.onStreetList(this.street);
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ngOnInit(): void {
    this.onColumnDefs();
    this.operatorIdoperatorId();
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
  }
  onSubscriberStatusChange(type: any) {
    console.log(this.operatorId);
    this.areaList = [];
    this.streetList = [];
    if (this.operatorId) {
      this.userService.getAreaListByOperatorid(this.role, this.username, this.operatorId)
        .subscribe((data: any) => {
          console.log(data);
          this.areaList = Object.keys(data || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
        });
    }
  }


  onAreaStatusChange(type: any) {
    console.log(this.area);
    this.streetList = [];
    if (this.area) {
      this.userService.getStreetListByAreaid(this.role, this.username, this.area)
        .subscribe((data: any) => {
          console.log(data);
          this.streetList = Object.keys(data || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.streetList);
        });
    }
  }
  onStreetList(type: any) {

  }

  goBack(): void {
    this.location.back();
  }
  private onColumnDefs() {

    if (this.type == 'current_active_smartcard' || this.type == 'current_Deactive_smartcard') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorid', width: 250 },
        { headerName: 'SMARTCARD', field: 'operatorname', width: 250 },
        { headerName: 'BOX ID	', field: 'total', width: 200 },
        { headerName: 'PACKAGE NAME	', field: 'transactiongroupname', width: 250 },
        { headerName: 'EXPIRY DATE	', field: 'transaction_date', width: 250 },
        { headerName: 'PACKAGE STATUS	', field: 'address', width: 300 },
      ]
    } else if (this.type == 'box_in_hand') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'SMARTCARD', field: 'operatorname', width: 500 },
        { headerName: 'BOX ID	', field: 'total', width: 500 },
        { headerName: 'ALLOCATION DATE	', field: 'transaction_date', width: 500 },
      ]
    } else if (this.type == 'monthwise_lco_activation_count') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'OPERATOR NAME', field: 'Operator_Name', width: 300 },
        { headerName: 'OPERATOR ID	', field: 'Operator_ID', width: 300 },
        { headerName: 'CONTACT NUMBER', field: 'contact_number1', width: 300 },
        { headerName: 'OPENING COUNT', field: 'opcount', width: 300 },
        { headerName: 'CLOSING COUNT', field: 'ccount', width: 300 },
      ]
    } else if (this.type == 'smartcard_suspend') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', width: 250 },
        { headerName: 'MOBILE NUMBER', field: 'total', width: 170 },
        { headerName: 'SMARTCARD', field: 'transaction_date', width: 200 },
        { headerName: 'BOX ID', field: 'transaction_date', width: 150 },
        { headerName: 'CAS', field: 'transaction_date', width: 150 },
        { headerName: 'PACKAGE', field: 'transaction_date', width: 200 },
        { headerName: 'SUSPEND DATE', field: 'transaction_date', width: 200 },
        { headerName: 'RESUME DATE', field: 'transaction_date', width: 200 },
        { headerName: 'STATUS', field: 'transaction_date', width: 150 },
        { headerName: 'RESON', field: 'transaction_date', width: 200 },
        { headerName: 'NEW EXPIRY DATE', field: 'transaction_date', width: 200 },
      ]
    } else if (this.type == 'expired_smartcard') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', width: 250 },
        { headerName: 'MOBILE NUMBER', field: 'total', width: 200 },
        { headerName: 'SMARTCARD', field: 'transaction_date', width: 200 },
        { headerName: 'BOX ID', field: 'transaction_date', width: 200 },
        { headerName: 'CAS', field: 'transaction_date', width: 150 },
        { headerName: 'PACKAGE', field: 'transaction_date', width: 250 },
        { headerName: 'EXPIRY DATE', field: 'transaction_date', width: 250 },
      ]
    } else if (this.type == 'allocated_smartcard') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', width: 400 },
        { headerName: 'ADDRESS', field: 'total', width: 400 },
        { headerName: 'MOBILE NUMBER', field: 'transaction_date', width: 350 },
        { headerName: 'SMARTCARD', field: 'transaction_date', width: 350 },
      ]
    } else if (this.type == 'areawise_sub') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', width: 400 },
        { headerName: 'ADDRESS', field: 'total', width: 400 },
        { headerName: 'MOBILE NUMBER', field: 'transaction_date', width: 350 },
        { headerName: 'AREA NAME', field: 'transaction_date', width: 350 },
      ]
    } else if (this.type == 'wallet_share') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'DATE', field: 'operatorname', width: 250 },
        { headerName: 'OPERATOR', field: 'total', width: 250 },
        { headerName: 'TYPE', field: 'transaction_date', width: 250 },
        { headerName: 'AMOUNT', field: 'transaction_date', width: 250 },
        { headerName: 'OLD BALANCE', field: 'transaction_date', width: 250 },
        { headerName: 'NEW BALANCE', field: 'transaction_date', width: 250 },
      ]
    } else if (this.type == 'sub_online_recharge_count') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', width: 200 },
        { headerName: 'SMARTCARD', field: 'total', width: 200 },
        { headerName: 'MOBILE NUMBER', field: 'transaction_date', width: 200 },
        { headerName: 'TRANSACTION ID', field: 'transaction_date', width: 200 },
        { headerName: 'STATUS', field: 'transaction_date', width: 150 },
        { headerName: 'DATE', field: 'transaction_date', width: 150 },
        { headerName: 'REMARKS', field: 'transaction_date', width: 200 },
        { headerName: 'OLD BALANCE', field: 'transaction_date', width: 150 },
        { headerName: 'AMOUNT', field: 'transaction_date', width: 150 },
        { headerName: 'NEW BALANCE', field: 'transaction_date', width: 150 },
      ]
    } else if (this.type == 'sub_package_recharge_count') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'operatorname', width: 200 },
        { headerName: 'SMARTCARD', field: 'total', width: 200 },
        { headerName: 'PRODUCT NAME', field: 'transaction_date', width: 200 },
        { headerName: 'ACTION', field: 'transaction_date', width: 200 },
        { headerName: 'TRANSACTION TYPE', field: 'transaction_date', width: 150 },
        { headerName: 'DAYS', field: 'transaction_date', width: 150 },
        { headerName: 'OLD BALANCE', field: 'transaction_date', width: 150 },
        { headerName: 'AMOUNT', field: 'transaction_date', width: 150 },
        { headerName: 'NEW BALANCE', field: 'transaction_date', width: 150 },
        { headerName: 'TRANSACTION DATE', field: 'transaction_date', width: 200 },
        { headerName: 'EXPIRY DATE', field: 'transaction_date', width: 200 },
        { headerName: 'USER AGENT', field: 'transaction_date', width: 200 },
      ]
    } else if (this.type == 'transfer_smartcard') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'SMARTCARD', field: 'total', width: 250 },
        { headerName: 'OLD CUSTOMER NAME', field: 'operatorname', width: 250 },
        { headerName: 'OLD LCO NAME', field: 'transaction_date', width: 250 },
        { headerName: 'TRANSFER DATE', field: 'transaction_date', width: 250 },
        { headerName: 'NEW CUSTOMER NAME', field: 'transaction_date', width: 250 },
        { headerName: 'NEW LCO NAME', field: 'transaction_date', width: 250 },
      ]
    } else if (this.type == 'collection_bill') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'total', width: 200 },
        { headerName: 'SMARTCARD', field: 'operatorname', width: 200 },
        { headerName: 'DUE AMOUNT', field: 'transaction_date', width: 150 },
        { headerName: 'OLD BALANCE', field: 'transaction_date', width: 150 },
        { headerName: 'PAID AMOUNT', field: 'transaction_date', width: 200 },
        { headerName: 'NEW BALANCE', field: 'transaction_date', width: 200 },
        { headerName: 'EXTRA AMOUNT', field: 'transaction_date', width: 200 },
        { headerName: 'DUE DATE', field: 'transaction_date', width: 200 },
        { headerName: 'COLLECTION DATE', field: 'transaction_date', width: 200 },
        { headerName: 'PACKAGES', field: 'transaction_date', width: 200 },
        { headerName: 'BILL TYPE', field: 'transaction_date', width: 200 },
      ]
    } else if (this.type == 'user_recharge') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'CUSTOMER NAME', field: 'total', width: 200 },
        { headerName: 'SMARTCARD', field: 'operatorname', width: 200 },
        { headerName: 'MOBILE NUMBER', field: 'operatorname', width: 200 },
        { headerName: 'PRODUCT NAME', field: 'transaction_date', width: 150 },
        { headerName: 'ACTION', field: 'transaction_date', width: 150 },
        { headerName: 'DAYS', field: 'transaction_date', width: 200 },
        { headerName: 'CUSTOMER AMOUNT', field: 'transaction_date', width: 200 },
        { headerName: 'LCO AMOUNT', field: 'transaction_date', width: 200 },
        { headerName: 'MSO AMOUNT', field: 'transaction_date', width: 200 },
        { headerName: 'LOG DATE', field: 'transaction_date', width: 200 },
        { headerName: 'EXPIRY DATE', field: 'transaction_date', width: 200 },
      ]
    } else if (this.type == 'areawise_subscriber') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: false, checkboxSelection: false, width: 80, filter: false },
        { headerName: 'LCO NAME', field: 'operatorname', width: 250 },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', width: 200 },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', width: 150 },
        { headerName: 'AREA NAME', field: 'areaname', width: 130 },
        { headerName: 'STREET NAME', field: 'streetname', width: 150 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 250 },
        { headerName: 'BOX ID', field: 'boxid', width: 150 },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200 },
      ]
    } 
  }
  getCurrentActReportDownload(event: any) {
    console.log(event);
  }

  getCurrentDeactReportDownload(event: any) {
    console.log(event);
  }
  getBoxinHandReportDownload(event: any) {
    console.log(event);
  }
  getMonthwiseLcoActivationReport(event: any) {
    console.log(event);
  }
  getSmartcardSuspendReport(event: any) {
    console.log(event);
  }
  getExpiredSmartcardReport(event: any) {
    console.log(event);
  }
  getAllocatedSmartcardReport(event: any) {
    console.log(event);
  }
  getAreawiseSubscriberReport(event: any) {
    console.log(event);
  }
  getWalletShareReport(event: any) {
    console.log(event);
  }
  getSubOnlineRechargeReport(event: any) {
    console.log(event);
  }
  getSubPackageRechargeReport(event: any) {
    console.log(event);
  }
  getTransferSmartcardReport(event: any) {
    console.log(event);
  }
  getCollectionBillReport(event: any) {
    console.log(event);
  }
  getUserRechargeReport(event: any) {
    console.log(event);
  }

  getTitle(type: string): string {
    const titles: { [key: string]: string } = {
      current_active_smartcard: 'CURRENT ACTIVE SMARTCARD',
      current_Deactive_smartcard: 'CURRENT DEACTIVE SMARTCARD',
      box_in_hand: 'BOX IN HAND',
      monthwise_lco_activation_count: 'MONTHWISE LCO ACTIVATION COUNT',
      smartcard_suspend: 'SMARTCARD SUSPEND REPORT',
      expired_smartcard: 'EXPIRED SMARTCARD REPORT',
      allocated_smartcard: 'ALLOCATED SMARTCARD ',
      areawise_sub: 'AREAWISE SUBSCRIBER',
      wallet_share: 'WALLET SHARE REPORT',
      sub_online_recharge_count: 'SUBSCRIBER ONLINE RECHARGE REPORT',
      sub_package_recharge_count: 'SUBSCRIBER PACKAGE RECHARGE REPORT',
      transfer_smartcard: 'TRANSFER SMARTCARD REPORT',
      collection_bill: 'COLLECTION BILL REPORT',
      user_recharge: 'USER RECHARGE HISTORY',
      areawise_subscriber: 'AREA WISE SUBSCRIBER REPORT',
    };
    return titles[type] || 'REPORT';
  }
  requiresDatePicker(type: string): boolean {
    return type !== 'box_in_hand' && type !== 'current_active_smartcard' && type !== 'current_Deactive_smartcard' && type !== 'expired_smartcard'
      && type !== 'areawise_sub' && type !== 'areawise_subscriber';
  }
  // getdownloadReport(type: string, format: number) {
  //   const reportFunctions: { [key: string]: (event: number) => void } = {
  //     current_active_smartcard: this.getCurrentActReportDownload,
  //     current_Deactive_smartcard: this.getCurrentDeactReportDownload,
  //     box_in_hand: this.getBoxinHandReportDownload
  //   };

  //   if (reportFunctions[type]) {
  //     reportFunctions[type](format);
  //   }
  // }


  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      if (this.type != 'areawise_subscriber') {
        this.getMonthwiseReport();
      }
      this.onSubscriberStatusChange(this.operatorId);
    })
  }
  getSubscriberBillDownload(type: number) {
    this.swal.Loading()
    this.processingSwal();
    this.userService.getlcoMonthwiseActivationReport(this.role, this.username, this.operatorId, this.fromdate, this.todate, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "MONTHWISE LCO ACTIVATION COUNT REPORT(" + this.operatorname + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "MONTHWISE LCO ACTIVATION COUNT REPORT(" + this.operatorname + ").xlsx", 'application/xlsx');
        }
        this.swal.Close()
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  getAreawiseDownload(type: number) {
    this.swal.Loading()
    this.processingSwal();
    this.userService.getAreaAndStreetWiseReport(this.role, this.username, this.operatorId, this.area, this.street,type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "AREA WISE SUBSCRIBER REPORT COUNT(" + this.operatorname + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "AREA WISE SUBSCRIBER REPORT COUNT(" + this.operatorname + ").xlsx", 'application/xlsx');
        }
        this.swal.Close()
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  getMonthwiseReport() {
    this.userService.getlcoMonthwiseActivationData(this.role, this.username, this.operatorId, this.fromdate, this.todate, 3).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }

  getAreaReport() {
    this.userService.getAreaAndStreetWiseReportList(this.role, this.username, this.operatorId, this.area, this.street,3).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.updateColumnDefs(this.selectedTab);
          this.rowData = response.body;
          console.log(this.rowData);
          // this.swal.Success_200();
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
}
