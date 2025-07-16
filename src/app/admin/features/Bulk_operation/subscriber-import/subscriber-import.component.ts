import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/_core/service/swal.service';
import { HttpResponse } from '@angular/common/http';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-subscriber-import',
  templateUrl: './subscriber-import.component.html',
  styleUrls: ['./subscriber-import.component.scss']
})
export class SubscriberImportComponent implements OnInit {
  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;
  streetid: any = 0;
  street_list: { [key: string]: number } = {};
  isCheckboxChecked: boolean = false;
  isCheckboxChecked_operator: boolean = false;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  submitted: boolean = false;
  selectedFCFormControl = new FormControl('');
  insert: boolean = false;
  operatorid: any = '';
  operator_details: any = [];
  operatorList: any[] = [];
  filteredPackage: any[] = [];
  selectedPackage: any;
  selectedPackageName: any;
  selectedOperator: any;

  fontcolor: any = [
    { lable: "Red", value: "#ff0000" },
    { lable: "Green", value: "#33cc33" },
    { lable: "Blue", value: "#0000ff" },
    { lable: "Yellow", value: "#ffff00" },
    { lable: "Pink", value: "#ff3399" },
    { lable: "Black", value: "#000000" },
    { lable: "White", value: "#ffffff" },
  ];
  role: any;
  username: any;
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
  constructor(private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService, private cdr: ChangeDetectorRef,
    private userservice: BaseService, private location: Location) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }


  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.operatorlist();
    this.refresh();

  }
  operatorlist() {
    // this.userservice.getPackageList(this.role, this.username,1  ).subscribe((data: any) => {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.cdr.detectChanges();
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        // const name = key.replace(/\(\d+\)$/, '').trim();
        const name = key.trim();

        return { name: name, value: value };
      });
      this.cdr.detectChanges();

      this.filteredPackage = this.operatorList;
    })
  }
  onOperatorChange(selectedOperator: any) {
    this.selectedPackage = selectedOperator;
    this.selectedPackageName = selectedOperator.name;
    if (this.operatorid === '0') {
      this.operatorid = 0;
    }
    this.operatorid = selectedOperator.target.value;
    this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        console.log(data);
        this.operator_details = data;
        console.log(this.operator_details);
      },
      (error: any) => {
        console.error('Error fetching operator details', error);
      }
    );
  }
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
  }
  onCheckboxChange_Operator(event: any): void {
    this.isCheckboxChecked_operator = event.target.checked;
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
  handleFontColorSelection(event: Event): void {
    const selectedColor = (event.target as HTMLSelectElement).value;
    console.log('Selected Font Color:', selectedColor);


  }
  generateExcel() {
    this.excelService.generateExcel();
  }
  toggleCheckbox() {
    this.isCheckboxChecked = !this.isCheckboxChecked;
  }
  goBack(): void {
    this.closeDialogue = !this.closeDialogue;
    this.Dialogue = !this.Dialogue;
  }
  opendialogue(): void {
    this.closeDialogue = !this.closeDialogue;
    this.Dialogue = !this.Dialogue;
  }
  bulkSubscriberImport() {
    console.log(this.file);
    this.submitted = true;
    if (this.file) {
      console.log(this.file);
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      formData.append('operatorid', this.operatorid);
      formData.append('isinsert', this.insert.toString());
      this.swal.Loading();
      this.userservice.bulkSubscriberInsert(formData)
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

  filterPackage(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredPackage = this.operatorList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    // this.filteredPackage = this.operatorList;
    console.log(this.filteredPackage);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedPackage = selectedOperator;
    this.selectedPackageName = selectedOperator.value;
    console.log(this.selectedPackageName);
  }


  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SUBSCRIBER", field: 'smartcard', width: 300 },
    { headerName: "REMARKS", field: 'remarks', width: 300 },
    { headerName: "CREATED DATE	", field: 'createddate', width: 300 },
  ];
  getData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    console.log(this.selectedDate);
    console.log(this.date);

    this.userservice.getBulkOperationListByDate(this.role, this.username, 'bulk_subscriber_insert', dateToPass, 14)
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
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'bulk_subscriber_insert', 14)
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
  getSubscriberImportReport(type: number) {
    this.processingSwal();
    const dateToPass = this.selectedDate || 0;
    console.log('Date passed to report:', dateToPass);

    this.userservice
      .getBulkFirstTimeActivationDownload(this.role, this.username, dateToPass, 'bulk_subscriber_insert', 14, type)
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
