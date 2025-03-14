import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-expiry-details',
  templateUrl: './expiry-details.component.html',
  styleUrls: ['./expiry-details.component.scss']
})
export class ExpiryDetailsComponent implements OnInit, OnDestroy {
  maxDate = new Date();
  fromdate: any;
  todate: any;
  username: any;
  role: any;
  operatorid: any = 0;
  format: any = 1;
  format_1: any = 2;
  selectedLcoName: any = 0;
  selectedOperator: any;
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';
  searchText: any = '';
  filteredOperators: any[] = [];
  showDropdown: boolean = false;
  operatorList: any[] = [];
  operatorname: any;
  lconame: any;
  rowData: any;
  msodetails: any;
  dateRangeForm: FormGroup;
  constructor(private userservice: BaseService, private fb: FormBuilder, private storageservice: StorageService, private swal: SwalService, private cdr: ChangeDetectorRef, private excelService: ExcelService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    userservice.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
    })
    this.operatorlist();
    this.dateRangeForm = this.fb.group({
      fromdate: [new Date('2024-03-01')], // Set default start date
      todate: [new Date('2024-03-15')] // Set default end date
    });
  }
  ngOnDestroy(): void {
    ($('#operator') as any).select2('destroy');
  }

  ngOnInit(): void {
    this.userservice.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());

    console.log(this.fromdate);
    console.log(this.todate);
    // this.dateRangeForm.patchValue({
    //   fromdate: new Date(),
    //   todate: new Date()
    // })
    this.dateRangeForm.patchValue({
      fromdate: this.fromdate,
      todate: this.todate
    })
    //     this.dateRangeForm.get('fromdate').set(this.fromdate);
    // this.dateRangeForm.get('todate').set(this.todate);
  }
  ngAfterViewInit() {
    $('#operator').select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      this.operatorname = event.target.value;
      this.selectOperator1(this.operatorname);
    });
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 2).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
      this.filteredOperators = this.operatorList;
    })

  }



  filterOperators() {
    if (this.operatorname) {
      this.filteredOperators = this.operatorList.filter(operator =>
        operator.name.toLowerCase().includes(this.operatorname.toLowerCase())
      );
    } else {
      this.filteredOperators = this.operatorList;
    }

  }

  selectOperator(id: string, name: any) {
    this.showDropdown = false;
    this.operatorid = id;
    this.operatorname = name;
  }
  selectOperator1(event: any) {
    console.log(event);

    this.showDropdown = false;
    this.operatorid = event;
    this.operatorname = event;
    console.log(this.operatorid);
    console.log(this.operatorname);

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
    console.log(this.operatorid);

    this.cdr.detectChanges();
    this.swal.Loading();
    this.userservice.getExpirySubscriberByOperator(this.role, this.username, this.operatorid, this.fromdate, this.todate, this.format)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.rowData);
            const areatitle = 'A1:J2'
            const areasub = 'A3:J3';
            const title = `From Date: ${this.fromdate} To Date: ${this.todate} EXPIRY HISTORY REPORT - FORMAT 1`;
            const sub = 'MSO ADDRESS: ' + this.msodetails;
            const header = ['S.NO', 'LCO NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'MOBILE NO', 'PACKAGE NAME', 'EXPIRY DATE', 'ACTIVATION DATE'];
            const data = this.rowData;
            const datas: Array<any> = [];
            data.forEach((d: any, index: number) => {
              const row = [index + 1, d.operatorname, d.customername, d.smartcard, d.boxid, d.address, d.mobileno, d.productname, d.expirydate, d.activationdate];
              datas.push(row);
            });
            const cellsize = { a: 20, b: 20, c: 20, d: 28, e: 20 };
            this.excelService.generateIMAGEExcel(areatitle, header, datas, title, cellsize, areasub, sub);
            this.swal.Close();
          } else if (response.status === 204) {
            // this.swal.Success_204();
            this.swal.Loading();
            this.rowData = response.body;
            console.log(this.rowData);
            const areatitle = 'A1:J2'
            const areasub = 'A3:J3';
            const title = `From Date: ${this.fromdate} To Date: ${this.todate} EXPIRY HISTORY REPORT - FORMAT 1`;
            const sub = 'MSO ADDRESS: ' + this.msodetails;
            const header = ['S.NO', 'LCO NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'MOBILE NO', 'PACKAGE NAME', 'EXPIRY DATE', 'ACTIVATION DATE'];
            const data = this.rowData;
            const datas: Array<any> = [];

            const cellsize = { a: 20, b: 20, c: 20, d: 28, e: 20 };
            this.excelService.generateIMAGEExcel(areatitle, header, datas, title, cellsize, areasub, sub);
            this.rowData = [];
            this.swal.Close();
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }
  exportAsXLSX1(): void {
    this.cdr.detectChanges();
    this.swal.Loading();
    this.userservice.getExpirySubscriberByOperator(this.role, this.username, this.operatorid, this.fromdate, this.todate, this.format_1).subscribe(
      (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
        if (response.status === 200) {
          this.rowData = response.body;
          const areatitle = 'A1:L2'
          const areasub = 'A3:L3';
          const title = `From Date: ${this.fromdate} To Date: ${this.todate}EXPIRY HISTORY REPORT - FORMAT `;
          const sub = 'MSO ADDRESS:' + this.msodetails;
          const header = ['S.NO', 'LCO NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'MOBILE NO', 'PACKAGE NAME', 'EXPIRY DATE', 'AREA ID', 'CUSTOMER NO', 'ACTIVATION DATE'];
          const data = this.rowData;
          const datas: Array<any> = [];
          data.forEach((d: any, index: number) => {
            const row = [index + 1, d.operatorname, d.customername, d.smartcard, d.boxid, d.address, d.mobileno, d.productname, d.expirydate, d.areaid, d.customerno, d.activationdate];
            datas.push(row);
          });
          const cellsize = { a: 20, b: 20, c: 20, d: 28, e: 20, f: 20 };
          this.excelService.generateIMAGEExcel1(areatitle, header, datas, title, cellsize, areasub, sub);
          this.swal.Close();
        } else if (response.status === 204) {
          this.swal.Loading();
          this.rowData = response.body;
          const areatitle = 'A1:L2'
          const areasub = 'A3:L3';
          const title = `From Date: ${this.fromdate} To Date: ${this.todate}EXPIRY HISTORY REPORT - FORMAT `;
          const sub = 'MSO ADDRESS:' + this.msodetails;
          const header = ['S.NO', 'LCO NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'ADDRESS', 'MOBILE NO', 'PACKAGE NAME', 'EXPIRY DATE', 'AREA ID', 'CUSTOMER NO', 'ACTIVATION DATE'];
          const data = this.rowData;
          const datas: Array<any> = [];

          const cellsize = { a: 20, b: 20, c: 20, d: 28, e: 20 };
          this.excelService.generateIMAGEExcel1(areatitle, header, datas, title, cellsize, areasub, sub);
          this.rowData = [];
          this.swal.Close();
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
}
