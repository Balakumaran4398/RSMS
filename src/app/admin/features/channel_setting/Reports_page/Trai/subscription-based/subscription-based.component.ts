import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription-based',
  templateUrl: './subscription-based.component.html',
  styleUrls: ['./subscription-based.component.scss']
})
export class SubscriptionBasedComponent implements OnInit {
  type: any;
  packageType: any;
  returndata: any;
  username: any;
  role: any;
  rowData: any;
  msodetails: any;
  productType: any = '';

  operatorNameList: any;
  filteredOperators: any[] = [];
  operatorList: any[] = [];
  selectedOperator: any;
  operatorid: any = 0;
  pagedOperators: any;


  product: any = [
    { lable: "Base", value: 1 },
    { lable: "Addon", value: 2 },
    { lable: "Alacarte", value: 3 },
    { lable: "All", value: 4 },
  ];
  date: any;
  isActive: boolean = false;

  months: any[] = [];
  years: any[] = [];
  Date: any[] = [];

  selectedMonth: any = 0;
  selectedYear: any = 0;
  selectedweek: any = 0;
  isDateDisabled: boolean = true;
  cur_date: any;
  constructor(public dialogRef: MatDialogRef<SubscriptionBasedComponent>, private swal: SwalService, @Inject(MAT_DIALOG_DATA) public data: any, private excelService: ExcelService, public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.type = data.type
    this.getHeaderTitle(this.type);
  }
  ngOnInit(): void {
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
    this.loadOperators();
    this.generateMonths();
    this.generateYears();
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  logValues(): void {
    const formattedDate = this.date ? this.formatDate(this.date) : 'No date selected';
    console.log('Selected Date:', formattedDate);
    console.log('Is Active:', this.isActive);
    this.cur_date = formattedDate;
    console.log(this.cur_date);

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
  onMonthChange() {
    if (this.selectedMonth !== '0') {
      const selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
      this.isDateDisabled = false;
      this.generateDates(selectedMonthName);
    } else {
      this.isDateDisabled = true;
      this.Date = [];
    }
  }
  generateDates(selectedMonthName: string) {
    this.Date = [
      { value: '1', name: '07 ' + selectedMonthName },
      { value: '2', name: '14 ' + selectedMonthName },
      { value: '3', name: '21 ' + selectedMonthName },
      { value: '4', name: 'All' }
    ];
  }

  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  getHeaderTitle(type: string): string {
    switch (type) {
      case 'base_package':
        return 'As on Date Base Package Subscriber';
      case 'addon_package':
        return 'As on Date Addon Package Subscriber';
      case 'alacarte':
        return 'As-on-Date A-la-carte Active/Deactive Subscriber Report';
      case 'date_subscription':
        return 'As on Date Active/Deactive Subscription Report (All Types of Products)';
      default:
        return 'Unknown Type'; // Optional: Handle unexpected types
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.returndata);
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
  }
  loadOperators() {
    this.userService.getOeratorList(this.role, this.username,1).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        return { name: key, value: value };
      });
      console.log(this.filteredOperators);

      this.filteredOperators = this.operatorList;
    });
  }
  onoperatorchange(operator: any): void {
    console.log(operator);
    this.selectedOperator = operator;
    this.operatorid = operator.value;
    console.log(this.operatorid);

    // if (operator.value === 0) {
    //   this.operatorid = 0;
    //   this.selectedOperator = { name: 'ALL Operator', value: 0 };
    // } else {
    //   this.operatorid = operator.value;
    // }
    // this.userService.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
    //   (data: any) => {
    //     console.log(data);
    //     // this.operator_details = data;
    //     this.pagedOperators = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching operator details', error);
    //   }
    // );
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  getWeeklySubscriptionExcel() {
    this.userService.getWeeklyActiveOrDeactiveSubscriptionExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedweek, this.isActive, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            // worksheet.columns = [
            //   { header: 'CUSTOMER NAME', key: 'customername', width: 25 },
            //   { header: 'SMARTCARD', key: 'smartcard', width: 20 },
            //   { header: 'BOX ID', key: 'boxid', width: 20 },
            //   { header: 'CAS', key: 'casname', width: 20 },
            //   { header: 'PACKAGE', key: 'productname', width: 20 },
            //   { header: 'PRODUCT ID', key: 'casproductid', width: 20 },
            //   { header: 'TYPE', key: 'type', width: 20 },
            //   { header: 'SUBSCRIPTION START DATE', key: 'logdate', width: 20 },
            //   { header: 'SUBSCRIPTION END DATE', key: 'expirydate', width: 20 },
            //   // Add other columns here...
            // ];
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['CUSTOMER NAME', 'SMARTCARD', 'BOXID', 'CAS', 'PACKAGE', 'PRODUCT ID', 'TYPE', 'SUBSCRIPTION START DATE', 'SUBSCRIPTION END DATE'];

            this.rowData.forEach((d: any) => {
              const row = [d.customername, d.smartcard, d.boxid, d.casname, d.productname, d.casproductid, d.type, d.logdate, d.expirydate];
              // console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateWeeklySubscriptionExcel(areatitle, header, datas, title, areasub, sub);

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
  getWeeklySubscriptionPDF() {
    this.userService.getWeeklyActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedweek, this.isActive, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  // ============================================================weekly Subscription above=========================

  getBaseSubscriptionExcel() {
    this.userService.getasOnDateBaseActiveOrDeactiveExcelReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:J2';
            areasub = 'A3:J3';
            header = ['S.NO','SUB ID','OPERATOR ID','CUSTOMER NAME', 'SMARTCARD', 'BOXID', 'PACKAGE', 'PRODUCT ID', 'SUBSCRIPTION START DATE', 'SUBSCRIPTION END DATE'];
            this.rowData.forEach((d: any,index: number) => {
              const row = [ index + 1, d.subid,d.operatorid,d.customername, d.smartcard, d.boxid, d.productname, d.orderid, d.logdate, d.expirydate];
              datas.push(row);
            });

            this.excelService.generateBaseSubscriptionExcel(areatitle, header, datas, title, areasub, sub);

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
  getBaseSubscriptionPDF() {
    this.userService.getasOnDateBaseActiveOrDeactivePDFReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  // ====================================================================Base Subscription Above========================
  getAddonSubscriptionExcel() {
    this.userService.getasOnDateAddonActiveOrDeactiveExcelReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:H2';
            areasub = 'A3:H3';
            header = ['OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'PACKAGE', 'PRODUCT ID', 'SUBSCRIPTION START DATE', 'SUBSCRIPTION END DATE'];

            this.rowData.forEach((d: any) => {
              const row = [d.operatorname, d.customername, d.smartcard, d.boxid, d.productname, d.orderid, d.logdate, d.expirydate];
              // console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateAddonSubscriptionExcel(areatitle, header, datas, title, areasub, sub);

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
  getAddonSubscriptionPDF() {
    this.userService.getasOnDateAddonActiveOrDeactivePDFReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }

  // -------------------------------------------------------Alacarte Subscription -----------------------------------
  getAlacarteSubscriptionExcel() {
    this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionExcelReport(this.role, this.username, this.cur_date, this.isActive, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            const title = (this.type + ' REPORT').toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['SMARTCARD', 'BOX ID', 'PRODUCT ID ', 'PRODUCT NAME', 'ACTIVATION DATE', 'EXPIRY DATE'];
            this.rowData.forEach((d: any) => {
              const row = [d.smartcard, d.boxid, d.productid, d.productname, d.logdate, d.expirydate];
              // console.log('type 1 and 4', row);
              datas.push(row);
            });

            this.excelService.generateAlacarteSubscriptionExcel(areatitle, header, datas, title, areasub, sub);

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
  getAlacarteSubscriptionPDF() {
    this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.cur_date, this.isActive, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.type + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
// -------------------------------------------------ALL TYPES-------------------------------------
getAllTypesExcel() {
  this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionExcelReport(this.role, this.username, this.cur_date, this.isActive, 2)
    .subscribe(
      (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
        console.log(this.type);
        if (response.status === 200) {
          this.rowData = response.body;
          console.log(this.type);
          const title = (this.type + ' REPORT').toUpperCase();
          const sub = 'MSO ADDRESS:' + this.msodetails;
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];
          const datas: Array<any> = [];
          // if (this.type == 1) {
          areatitle = 'A1:I2';
          areasub = 'A3:I3';
          header = ['S.NO','SUB ID','OPERATOR NAME','CUSTOMER NAME','SMARTCARD', 'BOX ID','CAS', 'PACKAGE','PRODUCT ID ', 'PRODUCT TYPE', 'SUBSCRIPTION START DATE', 'SUBSCRIPTION END DATE'];
          this.rowData.forEach((d: any) => {
            const row = [d.smartcard, d.boxid, d.productid, d.productname, d.logdate, d.expirydate];
            // console.log('type 1 and 4', row);
            datas.push(row);
          });

          this.excelService.generateAllTypesExcel(areatitle, header, datas, title, areasub, sub);

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
getAllTypesPDF() {
  this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.cur_date, this.isActive, 1)
    .subscribe((x: Blob) => {
      const blob = new Blob([x], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = (this.type + ".pdf").toUpperCase();
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    },
      (error: any) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
}
// ---------------------------------------------------------------------------------------------------------------------------------------
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
