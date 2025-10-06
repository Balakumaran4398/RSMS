import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-broadcaster-reports',
  templateUrl: './broadcaster-reports.component.html',
  styleUrls: ['./broadcaster-reports.component.scss']
})
export class BroadcasterReportsComponent implements OnInit {
  type: any;
  returndata: any;
  username: any;
  role: any;
  rowData1: any;
  rowData: any[] = [];
  addonlist: any[] = [];
  alacartelist: any[] = [];
  baselist: any[] = [];
  msodetails: any;
  selectedMonthName: any;

  selectedDate: any;
  selectedMonth: any;
  selectedYear: any;
  submitted: boolean = false;
  broadcasterid: any;
  broadcastername: any = 0;
  broadcastername_1: any;
  selectedValue: any;
  monthlyReportCastitle: any;

  months: any[] = [];
  years: any[] = [];
  Date: any[] = [];

  gridHeight: number = 180;

  broadcasterList: any[] = [];
  filteredBraoadcasterList: any[] = [];
  searchTerm: any;
  isDateDisabled: boolean = false;

  allType: any;
  reportTitle: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
    overlayNoRowsTemplate: `<span class="custom-overlay">No data to display</span>`,
  }
  gridApi: any;
  gridColumnApi: any;

  isVisible: boolean = false;

  castype: any;
  casname: any = '';
  cas: any[] = [];
  filteredCasList: { name: string; id: number }[] = [];
  AgeingType: any;

  constructor(private route: ActivatedRoute, private swal: SwalService, private excelService: ExcelService, private location: Location,
    public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService) {
    this.allType = this.route.snapshot.paramMap.get('id');
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  onNoClick(): void {
    // this.dialogRef.close(this.returndata);
  }
  ngOnInit(): void {
    this.userService.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log('dfdsfdsfsd', this.cas);
      this.cas = data.map((item: any) => ({
        id: item.id,
        name: item.casname
      }));
      this.filteredCasList = this.cas;
      console.log(this.filteredCasList);
    });
    this.userService.BroadcasterList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      // this.broadcasterList = data.map((item: any) => ({
      //   name: item.broadcastername,
      //   value: item.id,
      // }));

      this.broadcasterList = data;
      console.log(this.broadcasterList);
      // this.broadcastername_1 = data.broadcastername;
      // console.log('this.broadcastername_1',this.broadcastername_1);

    })
    const currentDate = new Date();

    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Current month as 2-digit string
    const currentYear = currentDate.getFullYear();
    // const currentWeek = this.calculateCurrentWeek(currentDate, this.selectedMonth);
    // this.selectedDate = currentWeek;
    console.log('current week', this.selectedDate);
    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear;
    this.generateMonths();
    this.generateYears();
    this.setReportTitle();
    this.onColumnDefs();
    this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
    // this.calculateCurrentWeek(currentDate, currentMonth);
    this.generateDates(this.selectedMonthName)
    this.onVisible();
    this.onMonthChange();

    if (this.allType == 6) {
      this.getAgeing(1);
    } else if (this.allType == 7) {
      this.getAgeing(2);
    }
  }

  ngOnDestroy(): void {
    ($('#broadcaster') as any).select2('destroy');
    ($('#cas') as any).select2('destroy');
  }

  ngAfterViewInit(): void {
    ($('#broadcaster') as any).select2({
      placeholder: 'Select Broadcaster',
      allowClear: true
    });
    $('#broadcaster').on('change', (event: any) => {
      // this.broadcastername = event.target.value;     
      const selectedId = Number(event.target.value); // Get selected ID from dropdown
      this.broadcastername = selectedId;

      // Find the name from broadcasterList using the ID
      const selectedItem = this.broadcasterList.find(item => item.id === selectedId);

      if (selectedItem) {
        console.log('Selected ID:', selectedId);
        console.log('Selected Name:', selectedItem.broadcastername);
      } else {
        console.log('Broadcaster not found');
      }
      this.broadcastername_1 = selectedItem.broadcastername;
      console.log('Selected Name:', this.broadcastername_1);

    });
    ($('#cas') as any).select2({
      placeholder: 'Select CAS',
      allowClear: true
    });
    $('#cas').on('change', (event: any) => {
      this.casname = event.target.value;
    });
  }
  setReportTitle() {
    switch (this.allType) {
      case '1':
        this.reportTitle = 'Monthly Broadcaster ';
        break;
      case '2':
        this.reportTitle = 'Over All Product ';
        break;
      case '3':
        this.reportTitle = 'Over All Base Product / Universal Count ';
        break;
      case '4':
        this.reportTitle = 'Over All Base Product ';
        break;
      case '5':
        this.reportTitle = 'Monthly Broadcaster Caswise ';
        break;
      case '6':
        this.reportTitle = 'Channel Aging ';
        break;
      case '7':
        this.reportTitle = 'Package Aging ';
        break;
      default:
        this.reportTitle = 'Unknown Report';
    }
  }
  setVisible(value: boolean, selectedType: string = '0') {
    // this.isVisible = value;
    this.type = selectedType;
    switch (this.type) {
      case '0':
        this.reportTitle = 'Cas Grouped';
        break;
      case '1':
        this.reportTitle = 'Cas Combined';
        break;
      case '2':
        this.reportTitle = 'Channel Wise';
        break;
      case '3':
        this.reportTitle = 'Channel wise DPO';
        break;
      case '4':
        this.reportTitle = 'AddonWise Channel';
        break;
      default:
        this.reportTitle = 'CAS Grouped';
    }
  }

  columnDefs = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
    { headerName: 'PRODUCT NAME', field: 'productname', width: 350, cellStyle: { textAlign: 'left' }, },
    { headerName: 'PRODUCTID', field: 'casproductid', width: 340, cellStyle: { textAlign: 'center' }, },
    { headerName: 'CAS', field: 'casname', width: 340, },
    { headerName: 'SUBS COUNT AS 7TH	', field: 'w1', width: 350, cellStyle: { textAlign: 'center' }, },
    { headerName: 'SUBS COUNT AS 14TH	', field: 'w2', width: 350, cellStyle: { textAlign: 'center' }, },
    { headerName: 'AVERAGE', field: 'avg', width: 350 },
    { headerName: 'MONTH AND YEAR', field: 'monthyear', width: 350 },
  ]
  private onColumnDefs() {
    console.log('colmnDefs', this.allType);

    if (this.allType == '1') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 300 },
        { headerName: 'LOG DATE', field: 'logdate', width: 280 },
        { headerName: 'ACTION', field: 'activity', width: 200 },
        { headerName: 'REMARKS', field: 'remarks', width: 900 },
      ]
    } else if (this.allType == '2') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'PRODUCT NAME', field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        { headerName: 'PRODUCTID', field: 'casproductid', width: 150, cellStyle: { textAlign: 'center' }, },
        { headerName: 'CAS', field: 'casname', width: 140 },
        { headerName: 'SUBS COUNT AS 7TH	', field: 'w1', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'SUBS COUNT AS 14TH	', field: 'w2', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'SUBS COUNT AS 21TH	', field: 'w3', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'SUBS COUNT AS 28TH	', field: 'w4', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'AVERAGE', field: 'avg', width: 150 },
        { headerName: 'MONTH AND YEAR', field: 'monthyear', width: 150 },
      ]
    }
    else if (this.allType == '6' || this.allType == '7') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90 },
        { headerName: 'PRODUCT ID	', field: 'productid', width: 150, cellStyle: { textAlign: 'center' }, },
        { headerName: 'PRODUCT NAME', field: 'productname', width: 200 },
        { headerName: 'CAS', field: 'casname', width: 150, cellStyle: { textAlign: 'center' }, },
        { headerName: '0-30', field: 'count1', width: 120, cellStyle: { textAlign: 'center' }, },
        { headerName: '31-60', field: 'count2', width: 120, cellStyle: { textAlign: 'center' }, },
        { headerName: '61-90', field: 'count3', width: 120, cellStyle: { textAlign: 'center' }, },
        { headerName: '91-120', field: 'count4', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '121-150', field: 'count5', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '151-180', field: 'count6', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '181-210', field: 'count7', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '211-240', field: 'count8', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '241-270', field: 'count9', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '271-300', field: 'count10', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: '301-365', field: 'count11', width: 100, cellStyle: { textAlign: 'center' }, },
      ]
    } else {
      console.warn('Unknown allType:', this.allType);
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.gridColumnApi = params.api;
  }
  onSearchBroadcaster(event: any) {
    this.searchTerm = event.target.value;
    this.filteredBraoadcasterList = this.filteredBroadcaster();
  }
  onSearchCas(event: any) {
    this.searchTerm = event.target.value;
    this.filteredCasList = this.filteredcas();
  }
  filteredBroadcaster(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.broadcasterList;
    }
    return this.broadcasterList.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredcas(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.cas;
    }
    return this.cas.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSelectionBroadcaster(selectedValue: any) {
    console.log('adasdkjasdjasjkldsa', selectedValue);
    // this.broadcasterid = selectedValue;
    this.broadcasterid = selectedValue.value;
    this.broadcastername = selectedValue.broadcastername;
    console.log(this.broadcasterid);
    console.log(this.broadcastername);

  }
  onSelectioncas(selectedValue: any) {
    console.log(selectedValue);
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    console.log(this.castype);

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
  onYearChange() {
    if (this.selectedMonth == null || this.selectedMonth == undefined || this.selectedMonth == '' || this.selectedMonth <= 0) {
      const currentDate = new Date();
      this.selectedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
    }
    this.generateDates(this.selectedMonthName);
  }



  calculateCurrentWeek(date: Date, selectedMonth: string) {
    console.log(date);
    console.log(selectedMonth);
    console.log('1111111111111111currentWeek', date);
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = date.getDate();
    // if (currentMonth === selectedMonth) {
    //   if (currentDay <= 7) {
    //     return '01';
    //   } else if (currentDay <= 14) {
    //     return '02';
    //   } else if (currentDay <= 21) {
    //     return '03';
    //   } else {
    //     return '04';
    //   }
    // }

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
  // onMonthChange() {
  //   if (this.selectedMonth !== '0') {
  //     this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
  //     this.isDateDisabled = false;
  //     this.generateDates(this.selectedMonthName);
  //     const currentDate = new Date();
  //     const currentWeek = this.calculateCurrentWeek(currentDate, this.selectedMonth);
  //     this.selectedDate = currentWeek;

  //   } else {
  //     this.isDateDisabled = true;
  //     this.Date = [];
  //   }
  // }

  onMonthChange() {
    if (this.selectedMonth !== '0') {
      this.selectedMonthName = this.months.find(month => month.value === this.selectedMonth)?.name || '';
      this.isDateDisabled = false;

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const isBeforeCurrentYear = this.selectedYear < currentYear;

      if (isBeforeCurrentYear) {
        // Show all weeks for previous years
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
    this.onVisible()
  }


  dayOfMonth = new Date().getDate();



  currentDate = new Date();
  // currentYear = this.currentDate.getFullYear();
  currentMonth = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
  // currentWeek = this.calculateCurrentWeek(this.currentDate, this.currentMonth);



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

  checkIfDateIsFuture(year: number, month: number, day: number): boolean {
    const inputDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return inputDate <= currentDate;
  }



  onVisible() {
    console.log('sdfdsfsdfds');
    this.userService.getBroadcasterVisible(this.role, this.username, this.selectedMonth, this.selectedYear).subscribe((data: any) => {
      console.log(data);
      this.isVisible = data.isVisible;
      console.log(this.isVisible);

    })
  }


  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  goBack(): void {
    this.location.back();
  }

  getExcel(event: number) {
    console.log('dfsfdsdsfidsjkfuji', this.broadcasterid);
    console.log('3453453489577834', this.broadcastername);
    console.log('Selected Name:', this.broadcastername_1);
    console.log(event);
    if (event === 0) {
      this.monthlyReportCastitle = 'CAS GROUPED';
    } else if (event === 1) {
      this.monthlyReportCastitle = 'CAS COMBINED';
    } else if (event === 2) {
      this.monthlyReportCastitle = 'CHANNEL WISE';
    } else if (event === 3) {
      this.monthlyReportCastitle = 'CHANNEL WISE DPO';
    } else if (event === 4) {
      this.monthlyReportCastitle = 'ADDON WISE CHANNEL';
    } else {
      return; // Exit if event is not matched
    }
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate && !this.broadcastername) {
      this.submitted = true;
    }

    this.swal.Loading();
    this.userService.getBroadcasterReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.broadcastername, event, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.broadcastername_1 + ' ' + this.reportTitle + '  ' + this.monthlyReportCastitle + ' ' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          console.log(error);

          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });

  }
  getPDF(event: number) {
    console.log(event);
    if (event === 0) {
      this.monthlyReportCastitle = 'CAS GROUPED';
    } else if (event === 1) {
      this.monthlyReportCastitle = 'CAS COMBINED';
    } else if (event === 2) {
      this.monthlyReportCastitle = 'CHANNEL WISE';
    } else if (event === 3) {
      this.monthlyReportCastitle = 'CHANNEL WISE DPO';
    } else if (event === 4) {
      this.monthlyReportCastitle = 'ADDON WISE CHANNEL';
    } else {
      return;
    }
    console.log(this.monthlyReportCastitle);
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate && !this.broadcastername) {
      this.submitted = true;
    }

    this.swal.Loading();
    this.userService.getBroadcasterPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.broadcastername, event, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.download = (this.broadcastername_1 + ' ' + this.reportTitle + '  ' + this.monthlyReportCastitle + ' ' + this.selectedMonthName + '-' + this.selectedYear + ".pdf").toUpperCase();
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
  // ---------------------------------------Universal report-------------------------


  getUniversalPDF() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getUniversalPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 1)
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `${this.reportTitle} REPORT - [YEAR : ${this.selectedYear} - MONTH : ${this.selectedMonthName}].pdf`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
          this.swal.Close();
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
      this.swal.Close();
    }
  }
  // ------------------------------------------------OverAll Report-------------------------------------------
  grtOverAllReport() {
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getOverAllReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 3)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log(response);
              // this.addonlist = response.body;
              // this.alacartelist = response.body;
              // this.baselist = response.body;


              this.addonlist = response.body.addonPackageList;
              this.alacartelist = response.body.alacartePackageList;
              this.baselist = response.body.basePackageList;
              const rowCount = this.addonlist.length || this.alacartelist.length || this.baselist.length;
              if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
                this.gridOptions.paginationPageSizeSelector.push(rowCount);
              }
              this.swal.Close();
              if (this.baselist.length > 0) {
                this.gridHeight = 600;
              } else {
                this.gridHeight = 150;
              }
            } else if (response.status === 204) {
              this.swal.Success_204();
              this.rowData = [];
              this.swal.Close();
              this.gridHeight = 350;
            }
            this.swal.Close();
          },
          (error) => {
            this.handleApiError(error);
            this.gridHeight = 350;
          }
        );
    }
  }


  getOverAllExcel() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getOverAllPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 2)

        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/xlsx' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `${this.reportTitle} REPORT - [YEAR : ${this.selectedYear} - MONTH : ${this.selectedMonthName}].xlsx`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
          this.swal.Close();
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
      this.swal.Close();
    }
  }

  getOverAllPDF() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getOverAllPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 1)
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `${this.reportTitle} REPORT - [YEAR : ${this.selectedYear} - MONTH : ${this.selectedMonthName}].pdf`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
          this.swal.Close();
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
      this.swal.Close();
    }
  }
  // ----------------------------------------------over all base report-----------------------------------------------------------------------------------------
  grtOverAllBaseReport() {
    console.log('fdgdfgfdjgkfdj');
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getOverBaseExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 3)
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log(response);
              // this.addonlist = response.body.addonList;
              // this.alacartelist = response.body.alacartePackageList;
              this.rowData = response.body.basePackageList;
              const rowCount = this.rowData.length;
              if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
                this.gridOptions.paginationPageSizeSelector.push(rowCount);
              }
              console.log(this.rowData);
              this.swal.Close();
            } else if (response.status === 204) {
              this.swal.Success_204();
              this.rowData = [];
              this.swal.Close();
            }
          },
          (error) => {
            this.handleApiError(error);
          }
        );
    }
  }
  grtOverAllBaseExcelReport() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getOverAllExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 2)
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/xlsx' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `${this.reportTitle} REPORT - [YEAR : ${this.selectedYear} - MONTH : ${this.selectedMonthName}].xlsx`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
          this.swal.Close();
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
      this.swal.Close();
    }
  }

  grtOverAllBasePDFReport() {
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate) {
      this.submitted = true;
    } else {
      this.swal.Loading();
      this.userService.getOverAllBroadcasterPDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, 1)
        .subscribe((x: Blob) => {
          const blob = new Blob([x], { type: 'application/pdf' });
          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = data;
          // link.download = (this.reportTitle + ".pdf").toUpperCase();
          link.download = `${this.reportTitle} REPORT - [YEAR : ${this.selectedYear} - MONTH : ${this.selectedMonthName}].pdf`.toUpperCase();

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
          this.swal.Close();
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
      this.swal.Close();
    }
  }

  // ---------------------------------------------------------------MonrhlyCaswiseExcel------------------------------------------

  // getCAS_GroupMonrhlyCaswiseExcel(){
  //   if (!this.selectedYear && !this.selectedMonth && !this.selectedDate && !this.broadcasterid && !this.castype) {
  //     this.submitted = true;
  //   } else {
  //     this.userService.getMonthlyBroadcasterCaswiseReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.broadcasterid, this.castype,this.allType, 2).subscribe((data: any) => {
  //       console.log(data);
  //     })
  //   }
  // }
  // getCAS_GroupMonrhlyCaswisePDF(){
  //   if (!this.selectedYear && !this.selectedMonth && !this.selectedDate && !this.broadcasterid && !this.castype) {
  //     this.submitted = true;
  //   } else {
  //     this.userService.getMonthlyBroadcasterCaswisePDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.broadcasterid, this.castype,this.allType, 2).subscribe((data: any) => {
  //       console.log(data);
  //     })
  //   }
  // }
  getCASMonrhlyCaswiseExcel(event: number) {
    console.log(event);
    if (event === 0) {
      this.monthlyReportCastitle = 'CAS GROUPED';
    } else if (event === 1) {
      this.monthlyReportCastitle = 'ADDON WISE CHANNEL';
    } else {
      return;
    }
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate && !this.broadcastername && !this.casname) {
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
    this.userService.getMonthlyBroadcasterCaswiseExcelReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.broadcastername, event, this.casname, 2)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.broadcastername + '  ' + this.reportTitle + ' ' + this.monthlyReportCastitle + ' ' + this.selectedMonthName + '-' + this.selectedYear + ".xlsx").toUpperCase();
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
  getCASMonrhlyCaswisePDF(event: number) {
    console.log(event);
    if (event === 0) {
      this.monthlyReportCastitle = 'CAS GROUPED';
    } else if (event === 1) {
      this.monthlyReportCastitle = 'ADDON WISE CHANNEL';
    } else {
      return;
    }
    this.submitted = true;
    if (!this.selectedYear && !this.selectedMonth && !this.selectedDate && !this.broadcastername && !this.casname) {
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
    this.userService.getMonthlyBroadcasterCaswisePDFReport(this.role, this.username, this.selectedMonth, this.selectedYear, this.selectedDate, this.broadcastername, event, this.casname, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.broadcastername + '' + this.reportTitle + '  ' + this.monthlyReportCastitle + ' ' + this.selectedMonthName + '-' + this.selectedYear + ".pdf").toUpperCase();
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

  // --------------------------------------------------Channel Ageing & Package Ageing -----------------------------------
  getAgeing(ageing: any) {
    this.swal.Loading();
    this.userService.getChannelOrPackageAgeingList(this.role, this.username, ageing, 3)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.reportTitle);

          if (response.status === 200) {
            this.rowData1 = response.body;
            console.log(this.rowData1);
            const rowCount = this.rowData1.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
            this.swal.Close();
          } else if (response.status === 204) {
            this.swal.Success_204();
            this.rowData1 = [];
            this.swal.Close();
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }


  getAgeingReport(type: number, ageing: any) {
    console.log(ageing);

    this.processingSwal();
    this.userService.getChannelOrPackageAgeingListReport(this.role, this.username, ageing, type)
      .subscribe((x: Blob) => {
        if (ageing == 1) {
          if (type == 1) {
            this.reportMaking(x, `CHANNEL AGEING REPORT.pdf`.toUpperCase(), "application/pdf");
          } else if (type == 2) {
            this.reportMaking(x, `CHANNEL AGEING REPORT.xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          }
        } else {
          if (type == 1) {
            this.reportMaking(x, `PACKAGE AGEING REPORT.pdf`.toUpperCase(), "application/pdf");
          } else if (type == 2) {
            this.reportMaking(x, `PACKAGE AGEING REPORT.xlsx`.toUpperCase(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          }
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  // -----------------------------------------------------------------------------------------------------------------------------

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
