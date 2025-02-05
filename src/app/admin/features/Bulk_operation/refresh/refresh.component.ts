import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss']
})
export class RefreshComponent {
  username: any;
  role: any;
  cas: any;
  operatorid: any = '';
  status: boolean = false;
  submitted: boolean = false;
  CasFormControl: any;
  operator_details: any = [];
  operatorList: any[] = [];
  date: any;
  selectedDate: any;
  filteredOperators: any[] = [];
  selectedOperator: any;
  lco_list: any;
  selectedLcoName: any[] = [];
  rowData: any[] = [];
  // rowData: any;
  type: any = [
    { label: "Select filter Type", value: 0 },
    { lable: "LCO", value: 1 },
    { lable: "SMARTCARD/BoxID", value: 2 },
    { lable: "Datewise", value: 3 },
  ];

  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
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
    pagination: true,
  }

  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    this.userservice.getBulkrefreshListByDate(this.role, this.username, 'Bulk Reactivate', formattedDate, 3)
      .subscribe(
        (response: any) => { // Expect HttpResponse<any[]>
          this.rowData = response;
          //   if (response.status === 200) {
          //     this.rowData = response;
          //     // this.swal.Success_200();
          //   } else if (response.status === 204) {
          //     // this.swal.Success_204();
          //   }
          // },
          // (error) => {
          //   if (error.status === 400) {
          //     this.swal.Error_400();
          //   } else if (error.status === 500) {
          //     this.swal.Error_500();
          //   } else {
          //     Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          //   }
        }
      );
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 120, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard', width: 350 },
    { headerName: "OPERATOR ID", field: 'lcoid', width: 150 },
    { headerName: "PACKAGE ID", field: 'packageid', width: 150 },
    {
      headerName: "STATUS", width: 150,
      field: 'status',
      cellRenderer: (params: any) => {
        // Check the value of status and apply conditional styling
        if (params.value === 'Success') {
          return `<span style="color: green; font-weight: bold;">${params.value}</span>`;
        } else {
          return `<span style="color: red; font-weight: bold;">${params.value}</span>`;
        }
      }
    },

    { headerName: "REMARKS", field: 'remarks', width: 240 },
    { headerName: "CREATED DATE", field: 'createddate', width: 350 },
  ];

  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.refresh();
    this.operatorlist();
  }
  ngAfterViewInit() {
    $('#ltb').select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.operatorid = event.target.value;
      this.onSubscriberStatusChange(this.operatorid);
    });
  }
  onGridReady() {

  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }
  onoperatorchange(event: any) {
    if (this.operatorid === '0') {
      this.operatorid = 0;
    }
    this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        console.log(data);
        this.operator_details = data;
        console.log(this.operator_details);
      },
      (error) => {
        console.error('Error fetching operator details', error);
      }
    );
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.operatorList);
      this.filteredOperators = this.operatorList;
    })
  }
  Submit() {
    this.submitted = true;
    this.swal.Loading();
    this.userservice.BulkReactivationByOperatorId(this.role, this.username, this.operatorid, 0, 3, this.status)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };

  refresh() {
    // this.swal.Loading();
    this.userservice.getBulkRefreshList(this.role, this.username, 'Bulk Reactivate', 3)
      .subscribe(
        (response: any) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response;
            // this.swal.Success_200();
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


  getData() {
    this.rowData = [];
    // this.swal.Loading();
    const dateToPass = this.selectedDate || this.date;
    this.userservice.getBulkrefreshListByDate(this.role, this.username, 'Bulk Reactivate', dateToPass, 3)
      .subscribe(
        (response: any) => { // Expect HttpResponse<any[]>
          this.rowData = response;
          //   if (response.status === 200) {
          //     // this.swal.Success_200();
          //   } else if (response.status === 204) {
          //     this.rowData = '';
          //     this.swal.Success_204();
          //   }
          // },
          // (error) => {
          //   if (error.status === 400) {
          //     this.swal.Error_400();
          //   } else if (error.status === 500) {
          //     this.swal.Error_500();
          //   } else {
          //     Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          //   }
        }
      );
  }
}