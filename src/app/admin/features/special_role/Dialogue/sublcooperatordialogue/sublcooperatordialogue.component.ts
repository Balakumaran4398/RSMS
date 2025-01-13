import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDateFormats } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MY_FORMATS1: MatDateFormats = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-sublcooperatordialogue',
  templateUrl: './sublcooperatordialogue.component.html',
  styleUrls: ['./sublcooperatordialogue.component.scss']
})
export class SublcooperatordialogueComponent implements OnInit {
  role: any;
  username: any;
  paygatelist: any[] = [];
  type: any;
  form!: FormGroup;
  editform!: FormGroup;
  operatorid: any;
  submitted = false;

  retailername: any;
  contactno: any;
  contactno2: any;
  address: any;
  password: any;
  retailerid: any;

  paymentid: any = 0;
  selectedid: any;
  isactive: boolean = false;

  selectedTab: string = 'datewise';
  columnDefs: any;

  maxDate = new Date();
  fromdate: any;
  todate: any;

  selectedDate: any;
  isDateEnabled: boolean = false;
  isMonthYearEnabled: boolean = false;
  isYearEnabled: boolean = false;
  months: any[] = [];
  years: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  @ViewChild('agGrid') agGrid: any;
  selectedMonth: any = 0;
  selectedYear: any = 0;

  isReportReady: boolean = false;

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData: any;



  constructor(public dialogRef: MatDialogRef<SublcooperatordialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.type = data.type;
    this.operatorid = data.id;

    this.retailername = data?.data.retailerName;
    this.contactno = data?.data.contactNo;
    this.contactno2 = data?.data.contactNo2;
    this.address = data?.data.address;
    this.password = data?.data.password;
    this.retailerid = data?.data.retailerId;

    this.selectedid = data?.selectedid;
    console.log(this.selectedid);

    this.form = this.fb.group({
      retailername: ['', Validators.required],
      contactno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      contactno2: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$')]],
      role: this.role,
      username: this.username,
      operatorid: this.operatorid,
    })


    this.editform = this.fb.group({
      retailername: ['', Validators.required],
      contactno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      contactno2: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$')]],
      role: this.role,
      username: this.username,
      operatorid: this.operatorid,
      retailerid: this.retailerid
    })
  }
  ngOnInit(): void {
    this.paymentgatewaylist();
    this.generateMonths();
    this.generateYears();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // selectTab(tab: string) {
  //   this.selectedTab = tab;
  //   this.updateColumnDefs(tab);
  // }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.rowData = [];
    if (this.agGrid) {
      let newRowData;

      if (this.selectedTab === 'datewise') {
        newRowData = this.getrefundData('datewise');
      } else if (this.selectedTab === 'monthwise') {
        newRowData = this.getLogrechargeReport('monthwise');
      }
      this.agGrid.api.setRowData(newRowData);
    }
  }

  getrefundData(event: any) {
    return [this.rowData];
  }
  getLogrechargeReport(event: any) {
    return [this.rowData];
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
    this.years = []; 
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }


  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }

  private updateColumnDefs(tab: string): void {
    if (tab === 'datewise') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "CUSTOMER NAME	", field: 'customername' },
        { headerName: "SMARTCARD	", field: 'smartcard' },
        { headerName: "BOX ID", field: 'boxid' },
        { headerName: "PACKAGE NAME", field: 'productname' },
        { headerName: "MRP", field: 'mrp' },
      ];
    } else if (tab === 'monthwise') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "CUSTOMER NAME	", field: 'customername' },
        { headerName: "SMARTCARD	", field: 'smartcard' },
        { headerName: "BOX ID", field: 'boxid' },
        { headerName: "PACKAGE NAME", field: 'productname' },
        { headerName: "MRP", field: 'mrp' },
      ];
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const errorFields = ['retailername', 'contactno', 'contactno2', 'address', 'password', 'role', 'website', 'username', 'operatorid',];
    this.swal.Loading()
    this.userservice.sublcoCreate(this.form.value)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        const errorMessage = errorFields
          .map(field => err?.error?.[field])
          .find(message => message) || 'An error occurred while creating the subscriber.'
      });
  }


  oneditSubmit() {
    this.submitted = true;
    if (this.editform.invalid) {
      this.editform.markAllAsTouched();
    }
    const errorFields = ['retailername', 'contactno', 'contactno2', 'address', 'password', 'role', 'website', 'username', 'operatorid', 'retailerid'];
    this.userservice.sublcoUpdate(this.editform.value)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        const errorMessage = errorFields
          .map(field => err?.error?.[field])
          .find(message => message) || 'An error occurred while creating the subscriber.'
      });

  }


  paymentgatewaylist() {
    this.userservice.getPaymentGateWayList(this.role, this.username).subscribe((data: any) => {
      this.paygatelist = Object.entries(data).map(([key, value]) => {
        const name = key.split('(')[0].trim(); // Get the name part before '('
        const id = value; // Use the value as ID
        return { name, id };
      });
      console.log(this.paygatelist);
    })
  }

  paymentgateway() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.sublcoUpdatePaymentGateway(this.role, this.username, this.retailerid, this.paymentid).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  onActive() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.sublcoDelete(this.role, this.username, this.selectedid, 'true').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  onDeactive() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.sublcoDelete(this.role, this.username, this.selectedid, 'false').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });

  }

  getDatewiseReport() {
    this.userservice.getsublcoDatewiseReport(this.role, this.username, this.retailerid, this.operatorid, this.fromdate, this.todate)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
            this.rowData = response.body;
            this.swal.Success_200();
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

  getmonthwisereport() {
    this.rowData = [];
    this.userservice.getsublcoMonthwiseReport(this.role, this.username, this.retailerid, this.operatorid, this.selectedMonth, this.selectedYear)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
            this.rowData = response.body;
            this.isReportReady = true;
            this.swal.Success_200();
          } else if (response.status === 204) {
            this.isReportReady = false;
            this.swal.Success_204();
          }
        },
        (error) => {
          this.isReportReady = false;
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

  getmonthwisepdfreport() {
    this.rowData = [];
    Swal.fire({
      title: 'Generating Report',
      text: 'Please wait while we generate your report.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.getsublcoMonthwisePdfReport(this.role, this.username, this.retailerid, this.operatorid, this.selectedMonth, this.selectedYear)
      .subscribe((res: Blob) => {
        Swal.close();
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }


  refresh() {
    this.submitted = false;
    this.form.reset();
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }



  // --------------------------------------------------------------Area updation----------------------------------------------------
  moveSelected_added_Items(event:any){  }
  moveAllSelected_added_Items(event:any){  }

  save(){}
}
