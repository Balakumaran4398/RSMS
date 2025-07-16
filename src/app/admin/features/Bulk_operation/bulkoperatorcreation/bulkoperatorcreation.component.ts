import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulkoperatorcreation',
  templateUrl: './bulkoperatorcreation.component.html',
  styleUrls: ['./bulkoperatorcreation.component.scss']
})
export class BulkoperatorcreationComponent implements OnInit {
  role: any;
  username: any;
  retailerid: any;
  lcoDeatails: any;
  operatorname: any;
  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;
  isCheckboxChecked: boolean = false;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  submitted: boolean = false;
  rowData: any;
  date: any;
  selectedDate: any;
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
    paginationPageSizeSelector: [10, 20],
    pagination: true,
  }
  constructor(private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService, private cdr: ChangeDetectorRef, private userservice: BaseService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    }
    if (this.role == 'ROLE_SUBLCO') {
      this.subLCOdetails();
    }
    if (this.role == 'ROLE_ADMIN') {
      this.refresh();
    }
  }
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.retailerid = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      console.log(this.lcoDeatails);
      console.log(this.retailerid);
      console.log(this.operatorname);

      // this.onSubscriberStatusChange(this.operatorId)
    })
  }
  subLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('111111111111111');
      this.lcoDeatails = data;
      // this.subOperatorId = this.lcoDeatails?.operatorid;
      this.retailerid = this.lcoDeatails?.retailerid;
      console.log(this.retailerid);
    })
  }
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
  }
  generateExcel() {
    this.excelService.generateOpearateCreationExcel();
  }
  toggleCheckbox() {
    this.isCheckboxChecked = !this.isCheckboxChecked;
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

  submit1() {
    this.submitted = true;
    if (this.file) {
      console.log(this.file);
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      // formData.append('retailerid', this.retailerid || 0);
      // formData.append('uploadtype', '12');
      this.swal.Loading();
      this.userservice.getBulkOperatorCreation(formData)
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

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "LCO NAME", field: 'smartcard', width: 200, cellStyle: { textAlign: 'left', }, },
     {
      headerName: "STATUS",
      field: 'status',
      width: 300,
      cellRenderer: (params: any) => {
        if (params.value === 'Operator Created Successfully') {
          return `<span style="color: green;">${params.value}</span>`;
        }  else  {
          return `<span style="color:rgb(202, 26, 2);">${params.value}</span>`;
        }
        return params.value;
      }
    },
    { headerName: "REMARKS", field: 'remarks', width: 200 },
    { headerName: "CREATED DATE	", field: 'createddate', width: 220 },
  ];
  submit() {
    this.submitted = true;
    if (this.file) {
      console.log(this.file);
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      formData.append('retailerid', this.retailerid || 0);
      formData.append('uploadtype', '12');
      this.swal.Loading();
      this.userservice.getBulkSmartcardRefresh(formData)
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
  getData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    console.log(this.selectedDate);
    console.log(this.date);

    this.userservice.getBulkOperationListByDate(this.role, this.username, 'bulk_lco_creation', dateToPass, 13)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
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
  refresh() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'bulk_lco_creation', 13)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
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
    this.selectedDate = 0;

  }
  getBulkOperationCreationReport(type: number) {
    this.processingSwal();
    const dateToPass = this.selectedDate || 0;
    console.log('Date passed to report:', dateToPass);

    this.userservice
      .getBulkFirstTimeActivationDownload(this.role, this.username, dateToPass, 'bulk_lco_creation', 13, type)
      .subscribe(
        (x: Blob) => {
          if (type === 1) {
            this.reportMaking(
              x,
              `Bulk Operation Creation - ${dateToPass || 'All Dates'}.pdf`,
              'application/pdf'
            );
          } else if (type === 2) {
            this.reportMaking(
              x,
              `Bulk Operation Creation - ${dateToPass || 'All Dates'}.xlsx`,
              'application/xlsx'
            );
          }
        },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        }
      );
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
      text: error || 'There was an issue generating the PDF form report.',
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
}
