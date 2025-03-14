import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lcologin-report',
  templateUrl: './lcologin-report.component.html',
  styleUrls: ['./lcologin-report.component.scss']
})
export class LcologinReportComponent implements OnInit {
  role: any;
  username: any;

  type: any;
  gridOptions = {
    defaultColDef: {


    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData: any[] = [];
  columnDefs: any[] = [];

  fromdate: any;
  todate: any;
  today = new Date();
  constructor(private route: ActivatedRoute, private userService: BaseService, private storageService: StorageService, private location: Location,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.type = this.route.snapshot.paramMap.get('id');
    console.log(this.type);
  }

  ngOnInit(): void {
    this.onColumnDefs();
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
        { headerName: 'OPERATOR NAME', field: 'operatorname', width: 300 },
        { headerName: 'OPERATOR ID	', field: 'total', width: 300 },
        { headerName: 'CONTACT NUMBER', field: 'transaction_date', width: 300 },
        { headerName: 'OPENING COUNT', field: 'transaction_date', width: 300 },
        { headerName: 'CLOSING COUNT', field: 'transaction_date', width: 300 },
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
    };
    return titles[type] || 'REPORT';
  }
  requiresDatePicker(type: string): boolean {
    return type !== 'box_in_hand' && type !== 'current_active_smartcard' && type !== 'current_Deactive_smartcard' && type !== 'expired_smartcard'
      && type !== 'areawise_sub';
  }
  downloadReport(type: string, format: number) {
    const reportFunctions: { [key: string]: (event: number) => void } = {
      current_active_smartcard: this.getCurrentActReportDownload,
      current_Deactive_smartcard: this.getCurrentDeactReportDownload,
      box_in_hand: this.getBoxinHandReportDownload
    };

    if (reportFunctions[type]) {
      reportFunctions[type](format);
    }
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
}
