
import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { SwalService } from 'src/app/_core/service/swal.service';
@Component({
  selector: 'app-specialcancelsubscription',
  templateUrl: './specialcancelsubscription.component.html',
  styleUrls: ['./specialcancelsubscription.component.scss']
})
export class SpecialcancelsubscriptionComponent implements OnInit {
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

  constructor(private userservice: BaseService, private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService) {
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

  Submit() {
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
      formData.append('type', '2');
      formData.append('optype', '9');
      formData.append('retailerid', '0');

      this.userservice.uploadFileForSubscriptionCancel(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
  getData() {
    this.rowData=[];
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'cancel_supscription', this.date,11 )
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'cancel_supscription', 11)
    .subscribe(
      (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
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
  
  generateExcel(type: string) {
    this.excelService.generateBaseChangeExcel(type);
  }
}
