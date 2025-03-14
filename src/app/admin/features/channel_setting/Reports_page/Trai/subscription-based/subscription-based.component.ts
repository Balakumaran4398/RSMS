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
  selectedMonthName: any;

  isDateDisabled: boolean = true;
  submitted: boolean = false;
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
      this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
      this.isDateDisabled = false;
      this.generateDates(this.selectedMonthName);
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
    this.userService.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
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

 
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
 

  getWeeklyActiveDeactiveReport(type: number) {
    this.processingSwal();
    this.userService.getWeeklyActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedweek, this.isActive, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, `WEEKLY  ${this.isActive ? 'Active' : 'Deactive'} SUBCRIPTION REPORT - [YEAR : ${this.selectedMonth} - MONTH : ${this.selectedMonthName}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `WEEKLY  ${this.isActive ? 'Active' : 'Deactive'} SUBCRIPTION REPORT - [YEAR : ${this.selectedMonth} - MONTH : ${this.selectedMonthName}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // ============================================================weekly Subscription above=========================

  


  getBasePackageReport(type: number) {
    this.processingSwal();
    console.log(this.operatorid)

    this.userService.getasOnDateBaseActiveOrDeactivePDFReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, type)
      .subscribe((x: Blob) => {
        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }


  // ====================================================================Base Subscription Above========================
  

  getAddonPackageReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateAddonActiveOrDeactivePDFReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, type)
      .subscribe((x: Blob) => {

        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // -------------------------------------------------------Alacarte Subscription -----------------------------------
  


  getAlacartePackageReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.cur_date, this.isActive, type)
      .subscribe((x: Blob) => {
       
        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // -------------------------------------------------ALL TYPES-------------------------------------
  getAllTypesExcel() {
    if (!this.cur_date) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionExcelReport(this.role, this.username, this.cur_date, this.isActive, 2)
        .subscribe(
          (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
            console.log(this.type);
            if (response.status === 200) {
              this.rowData = response.body;
              console.log(this.type);
              // const title = (this.type + ' REPORT').toUpperCase();
              const title = (this.type + ' REPORT - [ DATE : ' + this.cur_date + ']').toUpperCase();

              const sub = 'MSO ADDRESS:' + this.msodetails;
              let areatitle = '';
              let areasub = '';
              let header: string[] = [];
              const datas: Array<any> = [];
              areatitle = 'A1:L2';
              areasub = 'A3:L3';
              header = ['S.NO', 'SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS', 'PACKAGE', 'PRODUCT ID ', 'PRODUCT TYPE', 'SUBSCRIPTION START DATE', 'SUBSCRIPTION END DATE'];
              this.rowData.forEach((d: any, index: number) => {
                const row = [index + 1, d.smartcard, d.boxid, d.productid, d.productname, d.logdate, d.expirydate];
                datas.push(row);
              });

              this.excelService.generateSuspendBasedExcel(areatitle, header, datas, title, areasub, sub);

            } else if (response.status === 204) {
              this.rowData = response.body;
              console.log(this.type);
              // const title = (this.type + ' REPORT').toUpperCase();
              const title = (this.type + ' REPORT - [ DATE : ' + this.cur_date + ']').toUpperCase();

              const sub = 'MSO ADDRESS:' + this.msodetails;
              let areatitle = '';
              let areasub = '';
              let header: string[] = [];
              const datas: Array<any> = [];
              areatitle = 'A1:L2';
              areasub = 'A3:L3';
              header = ['S.NO', 'SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS', 'PACKAGE', 'PRODUCT ID ', 'PRODUCT TYPE', 'SUBSCRIPTION START DATE', 'SUBSCRIPTION END DATE'];
              this.excelService.generateSuspendBasedExcel(areatitle, header, datas, title, areasub, sub);
              this.rowData = [];
            }
          },
          (error) => {
            this.swal.Close();
            this.handleApiError(error);
          }
        );
    }
  }
  getAllTypesPDF() {
    if (!this.cur_date) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.cur_date, this.isActive, 1)
        .subscribe((x: Blob) => {
          this.swal.Close();
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.type + ".pdf").toUpperCase();
          link.download = `${this.type} REPORT - [ DATE : ${this.cur_date}].pdf`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
          (error: any) => {
            this.swal.Close();
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
    }
  }


  // ------------------------------------------------------------------product all--------------------------------
  getAllProductReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateAllProductActiveOrDeactiveSubscriptionReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, type)
      .subscribe((x: Blob) => {
 
        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [LCO : ${operatorName} - DATE : ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
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
}
