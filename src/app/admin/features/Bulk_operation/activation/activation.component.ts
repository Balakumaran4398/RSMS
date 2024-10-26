import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/_core/service/excel.service';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],
  providers: [ExcelService],
})
export class ActivationComponent implements OnInit {
  file: File | null = null;
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
  packageid: any;
  type: any;
  plantype: any;
  plan: any = 30;
  role: any;
  username: any;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  isFileSelected: boolean = false;
  isCheckboxChecked_operator: boolean = false;
  isPlanValid: boolean = false;


  lcogroupid: any = 0;
  producttype: any = 1;
  lcomembershipList: any[] = [];

  constructor(private userservice: BaseService, private storageservice: StorageService, private excelService: ExcelService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
    this.onproducttypechange("");
  }
  onGridReady = () => {

  }
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
  }
  checkPlanValidity(): void {
    this.isPlanValid = this.plan.trim() !== '';
  }
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.isFileSelected = true;
      this.file = input.files[0];
      this.filePath = input.files[0].name;
      console.log(this.file);
    } else {
      this.isFileSelected = false;
      this.file = null;
      this.filePath = '';
    }
  }

  goBack(): void {
    this.closeDialogue = !this.closeDialogue;
    this.Dialogue = !this.Dialogue;
  }
  onCheckboxChange_Operator(event: any): void {
    this.isCheckboxChecked_operator = event.target.checked;
  }

  opendialogue(): void {
    this.closeDialogue = !this.closeDialogue;
    this.Dialogue = !this.Dialogue;
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;

    // Allow digits only
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onproducttypechange(event: any) {
    this.userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }
  getData() {
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'first_time_activation', this.date,4)
      .subscribe(
        (response: HttpResponse<any[]>) => { 
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
  bulkActivation() {
    if (this.file) {
      console.log(this.file);
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      formData.append('packageid', this.lcogroupid);
      formData.append('type', '1');
      formData.append('plantype', '5');
      formData.append('plan', this.plan);

      this.userservice.uploadFirsttimeActivation(formData).subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            title: 'Success!',
            text: res?.message || 'File uploaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          console.error("File upload failed", error);
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was a problem uploading your file. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No file selected. Please choose a file to upload.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  refresh() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'first_time_activation',4)
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
  generateExcel(type:string) {
    this.excelService.generatealacarteactivationExcel(type);
  }
}
