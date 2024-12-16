import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

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
  rowData: any;
  msodetails: any;

  selectedDate: any = 0;
  selectedMonth: any = 0;
  selectedYear: any = 0;

  broadcasterid:any;
  broadcaster:any;

  months: any[] = [];
  years: any[] = [];
  Date: any[] = [];
  broadcasterList: any[] = [];
  filteredBraoadcasterList: any[] = [];
  searchTerm:any;
  isDateDisabled: boolean = true;

  constructor(public dialogRef: MatDialogRef<BroadcasterReportsComponent>, private swal: SwalService, @Inject(MAT_DIALOG_DATA) public data: any, private excelService: ExcelService,
    public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.type = data.type
  }
  onNoClick(): void {
    this.dialogRef.close(this.returndata);
  }
  ngOnInit(): void {
    this.userService.BroadcasterList(this.role, this.username, 1).subscribe((data:any) => {
      console.log(data);
      this.broadcasterList = data.map((item: any) => ({
        name: item.broadcastername,
        value: item.id,
      }));
      console.log(this.broadcasterList);

    })
    this.generateMonths();
    this.generateYears();
  }
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredBraoadcasterList = this.filteredBraoadcaster();
  }
  filteredBraoadcaster(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.broadcasterList;
    }
    return this.broadcasterList.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSelectionFingerPrint(selectedValue: any) {
    console.log(selectedValue);
    this.broadcasterid = selectedValue.id;
    this.broadcaster = selectedValue.name;
    console.log(this.broadcaster);
    console.log(this.broadcasterid);
  }
  getExcel() {

  }
  getPDF() {

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
      { value: '01', name: '07 ' + selectedMonthName },
      { value: '02', name: '14 ' + selectedMonthName },
      { value: '03', name: '21 ' + selectedMonthName },
      { value: '04', name: 'All' }
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
}
