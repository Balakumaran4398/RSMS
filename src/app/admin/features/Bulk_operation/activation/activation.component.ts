import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { SwalService } from 'src/app/_core/service/swal.service';
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
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard', width: 300 },
    {
      headerName: "STATUS",
      field: 'status',
      width: 250,
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
    { headerName: "REMARKS", field: 'remarks', width: 250 },
    { headerName: "CREATED DATE	", field: 'createddate', width: 270 },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 180,
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
  date: any;
  selectedDate: any;
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
  submitted: boolean = false;
  isPlanValid: boolean = false;
  lcogroupid: any = '';
  producttype: any = 1;
  lcomembershipList: any[] = [];
  filteredPackage: any[] = [];
  selectedPackage: any;
  selectedPackageName: any;
  constructor(private userservice: BaseService, private swal: SwalService, private storageservice: StorageService, private excelService: ExcelService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.refresh();
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
  filterPackage(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredPackage = this.lcomembershipList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    // this.filteredPackage = this.operatorList;
    console.log(this.filteredPackage);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
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
  onproducttypechange(selectedOperator: any) {
    this.selectedPackage = selectedOperator;
    this.selectedPackageName = selectedOperator.name;
    // this.userservice.getPackageList(this.role, this.username, 1).subscribe((data: any) => {
    this.userservice.getBulkPackageUpdationList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      // this.lcomembershipList = Object.keys(data.packageid);
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      // console.log(this.lcomembershipList);
      this.filteredPackage = this.lcomembershipList
    });
  }
  getData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'first_time_activation', dateToPass, 4)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
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
          // this.callAnotherApi();
        }
      );

  }
  bulkActivation() {
    this.submitted = true;
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
      formData.append('retailerid', '0');

      this.userservice.uploadFirsttimeActivation(formData)
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'first_time_activation', 4)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
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
          // this.callAnotherApi();
        }
      );
  }
  generateExcel(type: string) {
    this.excelService.generatealacarteactivationExcel(type);
  }
}
