import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lcoinvoice',
  templateUrl: './lcoinvoice.component.html',
  styleUrls: ['./lcoinvoice.component.scss']
})
export class LcoinvoiceComponent implements OnInit {
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;
  
        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    pagination: true,
  };
  rowData: any[] = [];

  role: any;
  username: any;
  selectedMonth: any;
  selectedYear: any;
  months: any[] = [];
  years: any[] = [];
  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = currentDate.getFullYear();
    // this.swal.Loading();

    this.generateMonths();
    this.generateYears();

    this.userservice.getAllOperatorInvoiceBillMonthYear(this.role, this.username, this.selectedMonth || null, this.selectedYear || null)
      .subscribe((data: any) => {
        // this.swal.success(data?.message);
        this.rowData = data
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
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

  generateYears() {
    const startYear = 2012;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }
  columnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true, filter: false },
    { headerName: "GST	", field: 'extra1', width: 300 },  // Jeya Akka Change panna sonnanga Operator name nu ulla dha GST nu
    { headerName: "INVOICE NO	", field: 'invoiceNo', width: 200 },
    { headerName: "INVOICE DATE	", field: 'invoiceDate', width: 300 },
    { headerName: "BASE", field: 'baseAmount', width: 250 },
    { headerName: "ADDON", field: 'addonBase', width: 200 },
    { headerName: "ALACARTE", field: 'alacarteBase', width: 260 },
  ]
  onGridReady(event: any) {
   console.log(event);
   
  }
  submit() {
    // this.swal.Loading();
    this.rowData = [];
    this.userservice.generateOperatorInvoiceBill(this.role, this.username, this.selectedMonth || null, this.selectedYear || null)
      // .subscribe(
      //   (data: any) => {
      //     this.rowData = data;
      //   });
      .subscribe((res: any) => {
        this.swal.success(res?.message);
        this.rowData = res;
      }, (err) => {
        this.swal.Error(err?.error?.message);
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


