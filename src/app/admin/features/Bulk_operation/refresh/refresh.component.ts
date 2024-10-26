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

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss']
})
export class RefreshComponent {
  username: any;
  role: any;
  cas: any;
  operatorid: any = 0;
  status: boolean = false;
  CasFormControl: any;
  operator_details: any = [];
  operatorList: any[] = [];
  date: any;
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
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();

  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard' },
    { headerName: "PACKAGE ID", field: 'packageid' },
    {
      headerName: "STATUS",
      field: 'status',
      cellRenderer: (params:any) => {
        // Check the value of status and apply conditional styling
        if (params.value === 'Success') {
          return `<span style="color: green; font-weight: bold;">${params.value}</span>`;
        } else {
          return `<span style="color: red; font-weight: bold;">${params.value}</span>`;
        }
      }
    },
    
    { headerName: "REMARKS", field: 'remarks' },
    { headerName: "CREATED DATE", field: 'createddate' },
  ];
  rowData: any;
  ngOnInit() {
    this.operatorlist();

  }
  onGridReady() {

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
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.operatorList);
    })
  }
  Submit() {
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'Bulk Reactivate', 3)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire('Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );
  }


  getData() {
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'Bulk Reactivate', this.date || null, 3)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire('Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );
  }
}