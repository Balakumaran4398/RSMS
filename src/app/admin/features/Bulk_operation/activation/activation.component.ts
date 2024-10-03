import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent {
  file: boolean = false;
  filePath: string = '';

  isCheckboxChecked: boolean = false;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard', width: 300 },
    {
      headerName: "STATUS",
      field: 'status',
      width: 200,
      cellRenderer: (params: any) => {
        if (params.value === 'Success') {
          return `<span style="color: green;">${params.value}</span>`;
        } else if (params.value === 'Please recharge') {
          return `<span style="color: red;">${params.value}</span>`;
        } else if (params.value === 'Connection Testing') {
          return `<span style="color: orange;">${params.value}</span>`;
        }
        return params.value; 
      }
    },

    { headerName: "REMARKS", field: 'remarks', width: 220 },
    { headerName: "CREATED DATE	", field: 'createddate', width: 250 },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  date: any;
  role: any;
  username: any;
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  onGridReady = () => {

  }
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
  }
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = true;
      this.filePath = input.files[0].name;
    } else {
      this.file = false;
      this.filePath = '';
    }
  }
  // getData() {
  //   this.userservice.getBulkOperationListByDate(this.role, this.username, 'first_time_activation', this.date).subscribe((data: any) => {
  //     this.rowData = data;
  //   })
  // }



  getData() {
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'first_time_activation', this.date)
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


  refresh() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'first_time_activation')
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
