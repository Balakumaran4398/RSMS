import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deactivation',
  templateUrl: './deactivation.component.html',
  styleUrls: ['./deactivation.component.scss']
})
export class DeactivationComponent {

  filePath: string = '';
  isCheckboxChecked: boolean = false;
  date: any;
  role: any;
  username: any;
  remark:any;
  file: File | null = null;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  isFileSelected: boolean = false;
  isCheckboxChecked_operator: boolean = false;

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard', width: 300 },
    {
      headerName: "STATUS",
      field: 'status',
      width: 300,
      cellRenderer: (params: any) => {
        if (params.value === 'Deactivation Successfully') {
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
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 15,
    pagination: true,
  }

  constructor(private userservice: BaseService, private storageservice: StorageService, private excelService: ExcelService,private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  opendialogue(): void {
    this.closeDialogue = !this.closeDialogue;
    this.Dialogue = !this.Dialogue;
  }
  goBack(): void {
    this.closeDialogue = !this.closeDialogue;
    this.Dialogue = !this.Dialogue;
  }
  onGridReady = () => {
    // this.userservice.GetAllUser('all',this.token.getUsername(),'0000-00-00','0000-00-00').subscribe((data) => {
    //   this.gridApi.setRowData(data);
    //   this.listUser = data;      
    // });
  }
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
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
  getData() {
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'deactivation', this.date,2)
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'deactivation',2)
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
      // .subscribe((res: any) => {
      //   this.swal.success(res?.message);
      // }, (err) => {
      //   this.swal.Error(err?.error?.message);
      // });
  }

  bulkDeactivation() {
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
      formData.append('reason', this.remark);
      formData.append('type', '2');


      this.userservice.uploadFileforDeactivation(formData).subscribe(
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
  generateExcel(type:string) {
    this.excelService.generatealacarteactivationExcel(type);
  }
}
