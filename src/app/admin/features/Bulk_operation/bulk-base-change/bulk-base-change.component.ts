import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { getData } from 'node_modules1/ajv/dist/compile/validate';
import type from 'node_modules1/ajv/dist/vocabularies/jtd/type';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-base-change',
  templateUrl: './bulk-base-change.component.html',
  styleUrls: ['./bulk-base-change.component.scss']
})
export class BulkBaseChangeComponent implements OnInit {
  filePath: string = '';
  isCheckboxChecked: boolean = false;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "EXTENDED DATE", field: 'extenddate', width: 200, },
    { headerName: "STATUS", field: 'status', width: 200 },
    { headerName: "REMARKS", field: 'remarks', width: 250 },
    { headerName: "CREATED DATE	", field: 'createddate', width: 230 },
    { headerName: "UPDATED DATE	", field: 'updateddate', width: 230 },
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
    // paginationPageSize: 15,
    // pagination: true,
  }
  username: any;
  role: any;
  packageid: any = 0;
  file: File | null = null;
  date: any;
  selectedDate: any;
  isFileSelected: boolean = false;
  packageList: any[] = [];
  package: any;

  filteredPackage: any[] = [];
  selectedPackage: any;
  selectedPackageName: any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private swal: SwalService, private storageService: StorageService, private excelService: ExcelService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0]; // Set default current date
    this.selectedDate = this.date;
    this.refresh();
    this.userservice.getPackageList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      // this.packageList = Object.keys(data.packageid);
      // console.log(this.packageList);
      this.packageList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredPackage = this.packageList
    });

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
  // handleFileInput(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.file = true;
  //     this.filePath = input.files[0].name;
  //   } else {
  //     this.file = false;
  //     this.filePath = '';
  //   }
  // }
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
  generateExcel(type: string) {
    this.excelService.generateBaseChangeExcel(type);
  }

  filterPackage(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredPackage = this.packageList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    // this.filteredPackage = this.packageList;
    console.log(this.filteredPackage);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onproducttypechange(selectedOperator: any) {
    this.selectedPackage = selectedOperator;
    this.selectedPackageName = selectedOperator.name;
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
      formData.append('packageid', this.package);
      formData.append('type', '8');
      formData.append('optype', '8');
      formData.append('billtype', '1');
      formData.append('retailerid', '0');
      formData.append('paidamount', '0.00');
      formData.append('dueamount', '0.00');

      this.userservice.uploadFileForBaseChange(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'Bulk Base Change', 9)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            // this.swal.Success_200();
          } else if (response.status === 204) {
            this.rowData = '';
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
    const dateToPass = this.selectedDate || this.date;
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'Bulk Base Change', dateToPass, 9)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            // this.swal.Success_200();
          } else if (response.status === 204) {
            this.rowData = '';
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
}
