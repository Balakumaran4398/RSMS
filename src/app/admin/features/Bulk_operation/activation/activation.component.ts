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
  remark: any = 'first_time_activation';
  isCheckboxChecked: boolean = false;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
    { headerName: "LCO NAME", field: 'operatorname', width: 200, cellStyle: { textAlign: 'left', }, },
    { headerName: "REMARKS", field: 'remarks', width: 200 },
    { headerName: "PACKAGE NAME", field: 'packagename', width: 200 },
    { headerName: "NO OF DAYS", field: 'days', width: 200 },
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
    { headerName: "CREATED DATE	", field: 'createddate', width: 220 },
    { headerName: "END DATE	", field: 'expirydate', width: 220 },
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
    paginationPageSizeSelector:[10,20],
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
  lcogroupid: any = 0;
  producttype: any = 1;
  lcomembershipList: any[] = [];
  filteredPackage: any[] = [];
  selectedPackage: any;
  selectedPackageName: any;

  lcoDeatails: any;
  operatorid: any;
  retailerid: any;
  constructor(private userservice: BaseService, private swal: SwalService, private storageservice: StorageService, private excelService: ExcelService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.refresh();
    this.onproducttypechange("");
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBLCO') {
      this.getSubLCOdetails();
    }

  }
  isplan: any;
  isdate: any;
  isdatetodate: any;
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.operatorid = this.lcoDeatails?.operatorid;
      this.isplan = this.lcoDeatails?.isplan;
      this.isdate = this.lcoDeatails?.isdate;
      this.isdatetodate = this.lcoDeatails?.isdatetodate;
      console.log(this.operatorid);
      this.getDistributorPackageList();
    })
  }
  getSubLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('111111111111111');
      this.lcoDeatails = data;
      this.retailerid = this.lcoDeatails?.operatorid;
      console.log(this.retailerid);
    })
  }
  onlcoPackageList() {
    this.userservice.getLcoPackageList(this.role, this.username, this.operatorid, 2).subscribe((data: any) => {
      console.log(data);
      // this.lcomembershipList = Object.keys(data).map(key => {
      //   const value = data[key];
      //   const name = key;
      //   return { name: name, value: value };
      // });
      // console.log(this.lcomembershipList);
      // this.filteredPackage = this.lcomembershipList
      this.lcomembershipList = data;
    })
  }
  packageList: any;
  filteredPackageList: any;
  getDistributorPackageList() {
    this.userservice.getDistributorPackageList(this.role, this.username, this.operatorid, this.operatorid).subscribe((data: any) => {
      // this.userService.getDistributorPackageList(this.role, this.username, this.lco_operatorId , this.operatorid).subscribe((data: any) => {
      this.packageList = data;
      this.filteredPackageList = data;

      console.log(data);
    })
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

  ngAfterViewInit() {
    $('#package').select2({
      placeholder: 'Select Package',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      this.lcogroupid = event.target.value;
      // this.onSmartcardList(this.smartcard);
    });
  }
  getData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    console.log(this.selectedDate);
    console.log(this.date);

    this.userservice.getBulkOperationListByDate(this.role, this.username, this.remark, dateToPass, 1)
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
      formData.append('retailerid', this.retailerid || '0');
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, this.remark, 1)
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



  getActivationReport(type: number) {
    this.processingSwal();
    const dateToPass = this.selectedDate || 0;
    console.log('Date passed to report:', dateToPass);

    this.userservice
      .getBulkFirstTimeActivationDownload(this.role, this.username, dateToPass, this.remark, 1, type)
      .subscribe(
        (x: Blob) => {
          if (type === 1) {
            this.reportMaking(
              x,
              `Bulk First Time Activation - ${dateToPass || 'All Dates'}.pdf`,
              'application/pdf'
            );
          } else if (type === 2) {
            this.reportMaking(
              x,
              `Bulk First Time Activation - ${dateToPass || 'All Dates'}.xlsx`,
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
    this.excelService.generatealacarteactivationExcel(type);
  }
}
