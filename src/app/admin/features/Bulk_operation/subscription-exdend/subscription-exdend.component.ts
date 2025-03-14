import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription-exdend',
  templateUrl: './subscription-exdend.component.html',
  styleUrls: ['./subscription-exdend.component.scss']
})
export class SubscriptionExdendComponent implements OnInit {
  file: File | null = null;
  filePath: string = '';
  days: any = 0;
  iscollected: boolean = false;
  isFileSelected: boolean = false;
  isCheckboxChecked: boolean = false;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard' },
    { headerName: "EXTENDED DATE", field: 'extenddate' },
    {
      headerName: "STATUS", field: 'status', cellRenderer: (params: any) => {
        if (params.value === "Success") {
          return `<span style="color: green;">Success</span>`;
        } else if (params.value === "Please Recharge") {
          return `<span style="color: #811762;">Please Recharge</span>`;
        } else {
          return `<span style="color: red;">${params.value}</span>`;
        }
      },
    },
    { headerName: "REMARKS", field: 'remarks' },
    { headerName: "DAYS", field: 'days' },
    { headerName: "CREATED DATE	", field: 'createddate' },
    { headerName: "UPDATED DATE	", field: 'updateddate' },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
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
  role: any;
  username: any;
  remarks = 'update_subscription';
  date: any;
  selectedDate: any;
  optype: any;

  // days: any;
  daysInvalid = false;

  constructor(private storageservice: StorageService, private excelService: ExcelService, private userservice: BaseService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.refresh();
  }

  validateLength(event: any): void {
    let value = event.target.value;
    if (value < 0) {
      value = Math.abs(value); 
    }
    if (value.toString().length > 3) {
      value = value.toString().slice(0, 3);
    }
    event.target.value = value;
    this.days = value;
    this.daysInvalid = value.toString().length !== 3;
  }

  getData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    console.log(dateToPass);
    console.log(this.date);

    this.userservice.getSubscriptionDataExtendList(this.role, this.username, dateToPass, this.remarks, 8)
      .subscribe(
        (response: HttpResponse<any[]>) => { 
          if (response.status === 200) {
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
  refresh() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, this.remarks, 8)
      .subscribe(
        (response: HttpResponse<any[]>) => { 
          if (response.status === 200) {
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
    this.selectedDate = 0;
  }
  onGridReady = () => {

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
  submit() {
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
      formData.append('days', this.days);
      formData.append('iscollected', this.iscollected.toString());
      formData.append('optype', '7');
      formData.append('type', '10');
      formData.append('retailerid', '0');
      this.userservice.uploadFileForSubscriptionExtend(formData).subscribe(
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
  getExtendReport(type: number) {
    this.processingSwal();
    const dateToPass = this.selectedDate || 0;
    this.userservice.getBulkFirstTimeActivationDownload(this.role, this.username, dateToPass, this.remarks, 8, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Bulk Update Subscription History -" + [dateToPass] + " .pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Bulk Update Subscription History -" + dateToPass + " .xlsx", 'application/xlsx');
        }
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
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
      text: error || 'There was an issue generating the PDF CAS form report.',
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
  generateExcel(type: string) {
    this.excelService.generateBaseChangeExcel(type);
  }
}
