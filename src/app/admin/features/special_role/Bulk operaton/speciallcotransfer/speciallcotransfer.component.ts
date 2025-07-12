import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-speciallcotransfer',
  templateUrl: './speciallcotransfer.component.html',
  styleUrls: ['./speciallcotransfer.component.scss']
})
export class SpeciallcotransferComponent implements OnInit {
  role: any;
  username: any;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  isFileSelected: boolean = false;
  isCheckboxChecked_operator: boolean = false;
  isPlanValid: boolean = false;
  plan: any = 30;
  file: File | null = null;
  filePath: string = '';

  isCheckboxChecked: boolean = false;

  lcogroupid: any = 0;
  producttype: any = 1;
  lcomembershipList: any[] = [];

  lco: string = '';
  area: string = '';
  street: string = '';
  lcoList: Array<{ name: string, value: string }> = [];
  areaList: Array<{ name: string, value: string }> = [];
  streetList: Array<{ name: string, value: string }> = [];
  filteredOperators: any[] = [];

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
  constructor(private userservice: BaseService, private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.operatorlist();
    this.refresh();
  }

  ngAfterViewInit() {
    $('#lco').select2({
      placeholder: 'Select LCO',
      allowClear: true
    });
    $('#lco').on('change', (event: any) => {
      this.lco = event.target.value;
      this.onSubscriberStatusChange(this.lco);
    });
    $('#area').select2({
      placeholder: 'Select Area',
      allowClear: true
    });
    $('#area').on('change', (event: any) => {
      this.area = event.target.value;
      this.onAreaStatusChange(this.area);
    });
    $('#street').select2({
      placeholder: 'Select Street',
      allowClear: true
    });
    $('#street').on('change', (event: any) => {
      this.street = event.target.value;
      this.onStreetList(this.street);
    });
  }
  generateExcel(type: string) {
    this.excelService.generateBaseChangeExcel(type);
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
  submit(): void {
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
      formData.append('operatorid', this.lco);
      formData.append('areaid', this.area);
      formData.append('streetid', this.street);
      formData.append('type', '3');
      formData.append('optype', '10');
      formData.append('retailerid', '0');
      this.userservice.uploadFileForBulkLcoTransfer(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message || err?.error);
        });
    }
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 2).subscribe((data: any) => {
      console.log(data);
      this.lcoList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key.trim();
        return { name: name, value: value };
      });
      console.log(this.lcoList);

      this.filteredOperators = this.lcoList
    })
  }


  onSubscriberStatusChange(type: any) {
    console.log(this.lco);
    this.areaList = [];
    this.streetList = [];
    if (this.lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.lco)
        .subscribe((data: any) => {
          console.log(data);
          this.areaList = Object.keys(data || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
        });
    }
  }


  onAreaStatusChange(type: any) {
    console.log(this.area);
    this.streetList = [];
    if (this.area) {
      this.userservice.getStreetListByAreaid(this.role, this.username, this.area)
        .subscribe((data: any) => {
          console.log(data);
          this.streetList = Object.keys(data || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.streetList);
        });
    }
  }

  onStreetList(type: any) {

  }

  getData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    console.log(this.selectedDate);
    console.log(this.date);

    this.userservice.getBulkOperationListByDate(this.role, this.username, 'lco_transfer', dateToPass, 12)
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'lco_transfer', 12)
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
      .getBulkFirstTimeActivationDownload(this.role, this.username, dateToPass, 'lco_transfer', 12, type)
      .subscribe(
        (x: Blob) => {
          if (type === 1) {
            this.reportMaking(
              x,
              `LCO Transfer - ${dateToPass || 'All Dates'}.pdf`,
              'application/pdf'
            );
          } else if (type === 2) {
            this.reportMaking(
              x,
              `LCO Transfer - ${dateToPass || 'All Dates'}.xlsx`,
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
