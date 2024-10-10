import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-expiry-details',
  templateUrl: './expiry-details.component.html',
  styleUrls: ['./expiry-details.component.scss']
})
export class ExpiryDetailsComponent {
  maxDate = new Date();
  fromdate: any;
  todate: any;
  username: any;
  role: any;
  operatorid: any;
  format: any = 1;
  format_1: any = 2;
  selectedLcoName: any = 0;
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';

  rowData: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, private excelService: ExcelService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    userservice.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
    })

  }

  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
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
  // Submit() {

  //   this.userservice.getExpirySubscriberByOperator(this.role, this.username, this.selectedLcoName, this.fromdate, this.todate, this.format).subscribe((data: any) => {
  //     console.log(data);
  //     this.rowData = data;
  //   })
  // }
  // Submit_1() {
  //   this.userservice.getExpirySubscriberByOperator(this.role, this.username, this.selectedLcoName, this.fromdate, this.todate, this.format_1).subscribe((data: any) => {
  //     console.log(data);
  //   })
  // }
  exportAsXLSX(): void {

    this.userservice.getExpirySubscriberByOperator(this.role, this.username, this.selectedLcoName, this.fromdate, this.todate, this.format).subscribe((data: any) => {
      this.rowData = data;
    })
    console.log(this.rowData);
    const areatitle = 'A1:I2'
    const areasub = 'A3:I3';
    const title = 'EXPIRY HISTORY REPORT';
    const sub = 'MSO ADDRESS: QC 28, Savaripadayatchi Street Nellithope Puducherry-605005 7708440965 babums238@gmail.com'
    const header = ['LCO NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'MOBILE NO', 'PACKAGE NAME', 'EXPIRY DATE', 'ACTIVATION DATE'];
    const data = this.rowData;
    const datas: Array<any> = [];
    data.forEach((d: any) => {
      console.log(d);

      const row = [d.operatorname, d.customername, d.smartcard, d.boxid, d.address, d.mobileno, d.productname, d.expirydate];
      datas.push(row);
    });
    const cellsize = { a: 20, b: 20, c: 20, d: 28, e: 20 };
    this.excelService.generateIMAGEExcel(areatitle, header, datas, title, cellsize, areasub, sub);
  }
  exportAsXLSX1(): void {

    this.userservice.getExpirySubscriberByOperator(this.role, this.username, this.selectedLcoName, this.fromdate, this.todate, this.format_1).subscribe((data: any) => {
      this.rowData = data;
    })
    console.log(this.rowData);
    const areatitle = 'A1:I2'
    const areasub = 'A3:I3';
    const title = 'EXPIRY HISTORY REPORT';
    const sub = 'MSO ADDRESS: QC 28, Savaripadayatchi Street Nellithope Puducherry-605005 7708440965 babums238@gmail.com'
    const header = ['LCO NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'MOBILE NO', 'PACKAGE NAME', 'EXPIRY DATE', 'ACTIVATION DATE'];
    const data = this.rowData;
    const datas: Array<any> = [];
    data.forEach((d: any) => {
      console.log(d);

      const row = [d.operatorname, d.customername, d.smartcard, d.boxid, d.address, d.mobileno, d.productname, d.expirydate];
      datas.push(row);
    });
    const cellsize = { a: 20, b: 20, c: 20, d: 28, e: 20 };
    this.excelService.generateIMAGEExcel(areatitle, header, datas, title, cellsize, areasub, sub);
  }
}
