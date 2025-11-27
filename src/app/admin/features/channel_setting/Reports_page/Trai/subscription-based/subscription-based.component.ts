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
  castype: any;

  casname: any;
  operatorNameList: any;
  filteredOperators: any[] = [];
  cas: any[] = [];
  operatorList: any[] = [];
  selectedOperator: any;
  operatorid: any;
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
  types: any = [
    { label: "Date", value: 1 },
    { label: "Month & Year", value: 2 },
    { label: "Year", value: 3 },
  ]
  selectedMonth: any = 0;
  selectedYear: any = 0;
  selectType: any = 0;
  selectedweek: any = 0;
  selectedDate: any = 0;
  selectedMonthName: any;

  isDateDisabled: boolean = true;
  submitted: boolean = false;
  cur_date: any;


  dayOfMonth = new Date().getDate();

  isDate: boolean = false;
  isYear: boolean = false;
  isMonthYear: boolean = false;

  currentDate = new Date();
  currentMonth = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
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
    if (this.type == 'castype' || this.type == 'base_package' || this.type == 'addon_package' || this.type == 'alacarte') {
      this.ongetCastype();
    }
  }

  ngOnDestroy(): void {
    ($('#cas') as any).select2('destroy');
    ($('#ltb') as any).select2('destroy');
  }
  ngAfterViewInit() {
    ($('#cas') as any).select2({
      placeholder: 'Select CAS',
      allowClear: true
    });
    $('#cas').on('change', (event: any) => {
      this.castype = event.target.value;
      console.log(this.castype);
      this.onCastype(this.castype);
    });
    ($('#ltb') as any).select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.operatorid = event.target.value;
      console.log(this.operatorid);
      this.onSubscriberStatusChange(this.operatorid);
    });
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

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const isBeforeCurrentYear = this.selectedYear < currentYear;

      if (isBeforeCurrentYear) {
        this.Date = [
          { value: '04', name: 'All', isEnabled: true },
          { value: '01', name: '07 ' + this.selectedMonthName, isEnabled: true },
          { value: '02', name: '14 ' + this.selectedMonthName, isEnabled: true },
          { value: '03', name: '21 ' + this.selectedMonthName, isEnabled: true },
        ];
        this.selectedDate = '04';
      } else {
        this.generateDates(this.selectedMonthName);
        const currentWeek = this.calculateCurrentWeek(currentDate, this.selectedMonth);
        this.selectedDate = currentWeek;
      }
    } else {
      this.isDateDisabled = true;
      this.Date = [];
    }
  }
  onTypeChange(type: any) {
    if (type == 1) {
      this.isDate = true;
      this.isMonthYear = false;
      this.isYear = false;
    } else if (type == 2) {
      this.isDate = false;
      this.isMonthYear = true;
      this.isYear = false;
    } else if (type == 3) {
      this.isDate = false;
      this.isMonthYear = false;
      this.isYear = true;
    }
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
        return 'Unknown Type';
    }
  }
  generateDates(selectedMonthName: string) {
    console.log(selectedMonthName);
    const currentWeek = this.calculateCurrentWeek(this.currentDate, this.currentMonth);
    const isCurrentMonth = this.selectedMonth === this.currentDate.getMonth() + 1;
    const isBeforeCurrentMonth = this.selectedMonth < this.currentDate.getMonth() + 1;
    const isAfterCurrentMonth = this.selectedMonth > this.currentDate.getMonth() + 1;

    if (isAfterCurrentMonth) {
      console.log('11111111');
      this.Date = [];
      return;
    }

    this.Date = [

      {
        value: '04',
        name: 'All',
        isEnabled: isBeforeCurrentMonth,
        cmonth: this.currentMonth,
        cdate: this.dayOfMonth,
        cvalue: 28
      },
      {
        value: '01',
        name: '07 ' + this.selectedMonthName,
        isEnabled: isBeforeCurrentMonth || currentWeek == '01',
        cmonth: this.currentMonth,
        cdate: this.dayOfMonth,
        cvalue: 7
      },
      {
        value: '02',
        name: '14 ' + this.selectedMonthName,
        isEnabled: isBeforeCurrentMonth || currentWeek == '02',
        cmonth: this.currentMonth,
        cdate: this.dayOfMonth,
        cvalue: 14
      },
      {
        value: '03',
        name: '21 ' + this.selectedMonthName,
        isEnabled: isBeforeCurrentMonth || currentWeek == '03',
        cmonth: this.currentMonth,
        cdate: this.dayOfMonth,
        cvalue: 21
      },
    ];
    if (isBeforeCurrentMonth) {
      console.log('222222222');
      this.selectedDate = '04';
      console.log(this.selectedDate);
    }
  }
  calculateCurrentWeek(date: Date, selectedMonth: string) {
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = date.getDate();
    if (currentMonth === selectedMonth) {
      if (currentDay >= 7 && currentDay <= 14) {
        return '01';
      } else if (currentDay >= 15 && currentDay <= 21) {
        return '02';
      } else if (currentDay >= 22 && currentDay <= 29) {
        return '03';
      } else {
        return '04';
      }
    }
    return '04';
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
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        return { name: key, value: value };
      });
      this.filteredOperators = this.operatorList;
    });
  }
  onoperatorchange(operator: any): void {
    this.selectedOperator = operator;
    this.operatorid = operator.value;
  }
  onSubscriberStatusChange(operator: any) {
    console.log(operator);
    this.selectedOperator = operator;
    // this.operatorid = operator;
    console.log(this.operatorid);
    let str = operator;
    let match = str.match(/\(([^)]+)\)/);
    let insideValue = match ? match[1] : null;
    console.log(insideValue);
    this.operatorid = insideValue;
    console.log(this.operatorid);
  }

  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  getWeeklyActiveDeactiveReport(type: number) {
    this.processingSwal();
    this.userService.getWeeklyActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.isActive, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, `WEEKLY  ${this.isActive ? 'Active' : 'Deactive'} SUBCRIPTION REPORT - [ ${this.selectedMonth} -  ${this.selectedMonthName}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `WEEKLY  ${this.isActive ? 'Active' : 'Deactive'} SUBCRIPTION REPORT - [ ${this.selectedMonth} -  ${this.selectedMonthName}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // ============================================================weekly Subscription above=========================
  getBasePackageReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateBaseActiveOrDeactivePDFReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, type, this.castype || 0)
      .subscribe((x: Blob) => {
        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // ====================================================================Base Subscription Above========================


  getAddonPackageReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateAddonActiveOrDeactivePDFReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, type, this.castype || 0)
      .subscribe((x: Blob) => {

        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  // -------------------------------------------------------Alacarte Subscription -----------------------------------
  getAlacartePackageReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.cur_date, this.isActive, type, this.castype || 0)
      .subscribe((x: Blob) => {

        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
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
              const title = (this.type + ' REPORT - [ ' + this.cur_date + ']').toUpperCase();

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
              const title = (this.type + ' REPORT - [' + this.cur_date + ']').toUpperCase();

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
  // getAllTypesPDF() {
  //   if (!this.cur_date) {
  //     this.submitted = true;
  //   } else {
  //     this.swal.Loading();
  //     this.userService.getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(this.role, this.username, this.cur_date, this.isActive, 1, this.castype || 0)
  //       .subscribe((x: Blob) => {
  //         this.swal.Close();
  //         const blob = new Blob([x], { type: 'application/pdf' });
  //         const data = window.URL.createObjectURL(blob);
  //         const link = document.createElement('a');
  //         link.href = data;
  //         // link.download = (this.type + ".pdf").toUpperCase();
  //         link.download = `${this.type} REPORT - [  ${this.cur_date}].pdf`.toUpperCase();

  //         link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //         setTimeout(() => {
  //           window.URL.revokeObjectURL(data);
  //           link.remove();
  //         }, 100);
  //       },
  //         (error: any) => {
  //           this.swal.Close();
  //           Swal.fire({
  //             title: 'Error!',
  //             text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
  //             icon: 'error',
  //             confirmButtonText: 'Ok'
  //           });
  //         });
  //   }
  // }


  // ------------------------------------------------------------------product all--------------------------------
  getAllProductReport(type: number) {
    this.processingSwal();
    this.userService.getasOnDateAllProductActiveOrDeactiveSubscriptionReport(this.role, this.username, this.operatorid, this.cur_date, this.isActive, type)
      .subscribe((x: Blob) => {

        const operatorName = this.selectedOperator?.name || 'ALL OPERATOR';
        if (type == 1) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '}  ${this.type} Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          this.reportMaking(x, `As On Date   ${this.isActive ? 'Active' : 'Deactive '} ${this.type}  Subscription History REPORT - [ ${operatorName} -  ${this.cur_date}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
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
      text: error.message || 'There was a problem generating the form report..',
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
  // -----------------------------------------------------castype-------------------------------------------

  ongetCastype() {
    this.userService.Cas_type(this.role, this.username).subscribe((data: any) => {
      this.cas = data;
      console.log('dfdsfdsfsd', this.cas);
      this.cas = data.map((item: any) => ({
        id: item.id,
        name: item.casname
      }));
      // this.filteredCasList = this.cas;
      console.log(this.cas);

    });
  }
  onCastype(cas: any) {
    console.log(cas);
    // const selectedCas = this.cas.find((c: any) => c.id === +cas);
    // console.log(selectedCas);
    // this.casname = selectedCas ? selectedCas.name : '';
    // console.log(this.casname);
  }
  // ---------------------------------------------------------------CAS TYPE REPORTS--------------------------------------------------
  getCASTypeReport(type: number) {
    console.log(type);
    // this.processingSwal();
    this.userService.getCaswiseFirsttimeActivationReport(this.role, this.username, this.cur_date || 0, this.selectedMonth || 0, this.selectedYear || 0, type, this.selectType, this.operatorid || 0, this.castype || 0)
      .subscribe((x: Blob) => {
        if (type == 1) {
          // this.reportMaking(x, `CAS TYPE REPORT - [ ${this.selectedMonth} -  ${this.selectedMonthName}].pdf`.toUpperCase(), "application/pdf");
          this.reportMaking(x, `CAS TYPE FIRST TIME ACIVATION REPORT.pdf`.toUpperCase(), "application/pdf");
        } else if (type == 2) {
          // this.reportMaking(x, `CAS TYPE REPORT - [ ${this.selectedMonth} -  ${this.selectedMonthName}].xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          this.reportMaking(x, `CAS TYPE FIRST TIME ACIVATION REPORT.xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
      },
        (error: any) => {
          console.log(error?.error.message);

          this.pdfswalError(error?.error.message);
        });
  }
}
