import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addon-activation',
  templateUrl: './addon-activation.component.html',
  styleUrls: ['./addon-activation.component.scss']
})
export class AddonActivationComponent {
  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;
  form: FormGroup;
  isCheckboxChecked: boolean = false;
  iscollected: boolean = false;

  submitted: boolean = false;
  username: any;
  role: any;
  date: any;
  selectedDate: any;
  castype: any = '';
  alacarteList: any = '';
  cas: any[] = [];
  area: any;
  CasFormControl: any = 0;
  type = ["Type1", "Type2", "Type3"];
  toppings = new FormControl([]);
  toppingList: any[] = [];
  // rowData: any;
  searchText: any;
  filteredToppingList: any;
  selectedCas: any;
  remark: any;

  filteredCasList: any[] = [];
  casList: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard' },
    { headerName: "PACKAGE NAME", field: 'packagename' },
    { headerName: "ADDING PACKAGE", field: 'packageid', cellStyle: { textAlign: 'left' } },
    { headerName: "ADDED PACKAGE ID	", field: 'addingpackageid', cellStyle: { textAlign: 'left' } },
    {
      headerName: "STATUS	", field: 'status', cellStyle: { textAlign: 'left' },
      cellRenderer: (params: any) => {
        const status = params.value;
        if (status === 'Success') {
          return `<span style="color: green; ">${status}</span>`;
        } else if (status === 'SMARTCARD NOT EXIST') {
          return `<span style="color: #b32222; ">${status}</span>`;
        } else {
          return `<span style="color: #3235c9; ">${status}</span>`;
        }
      }
    },
    { headerName: "REMARKS", field: 'remarks' },
    { headerName: "CREATED DATE	", field: 'createddate' },
    { headerName: "UPDATE DATE", field: 'updateddate' },
  ];
  columnDefs1: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
    { headerName: "PACKAGE NAME", field: 'packagename', width: 300, cellStyle: { textAlign: 'left', } },
    {
      headerName: "STATUS	", field: 'status', width: 270,cellStyle: { textAlign: 'left', },
      cellRenderer: (params: any) => {
        const status = params.value;
        if (status === 'Success') {
          return `<span style="color: green; ">${status}</span>`;
        } else if (status === 'SMARTCARD NOT EXIST') {
          return `<span style="color: #b32222; ">${status}</span>`;
        } else {
          return `<span style="color: #3235c9; ">${status}</span>`;
        }
      }
    },
    { headerName: "REMARKS", field: 'remarks', width: 200, },
    { headerName: "CREATED DATE	", field: 'createddate', width: 200, },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;
  
        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector:[10,20],
    pagination: true,
  };

  isFormValid(): boolean {
    return this.filePath !== '' && this.alacarteList.length > 0;
  }
  onGridReady = () => {
    // this.userservice.GetAllUser('all',this.token.getUsername(),'0000-00-00','0000-00-00').subscribe((data) => {
    //   this.gridApi.setRowData(data);
    //   this.listUser = data;      
    // });
  }
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private swal: SwalService, private storageService: StorageService, private excelService: ExcelService) {
    this.form = this.fb.group({
      billingAddressCheckbox: [false]

    });
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  selectedTab: string = 'activation';
  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.filteredToppingList = [...this.toppingList];
    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.cas);
    // });
    this.refresh();

    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   this.casList = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    //   this.cas = [...this.casList];
    //   console.log(this.cas);
    // });
    this.onCaschange('');
  }



  getData() {
    this.rowData = []
    const dateToPass = this.selectedDate || this.date;
    // if (this.selectedTab == 'activation') {
    //   this.remark = 'addon_add'
    // } else {
    //   this.remark = 'addon_remove'
    // }
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'addon_add', this.date, 4)
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
  }
  refresh() {
    // console.log(this.selectedTab);
    // if (this.selectedTab == 'activation') {
    //   this.remark = 'addon_add'
    // } else {
    //   this.remark = 'addon_remove'
    // }
    // console.log(this.remark);

    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'addon_add', 4)
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
  }
  removegetData() {
    this.rowData = []
    const dateToPass = this.selectedDate || this.date;
    // if (this.selectedTab == 'activation') {
    //   this.remark = 'addon_add'
    // } else {
    //   this.remark = 'addon_remove'
    // }
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'addon_remove', this.date, 6)
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
  }
  removerefresh() {
    // console.log(this.selectedTab);
    // if (this.selectedTab == 'activation') {
    //   this.remark = 'addon_add'
    // } else {
    //   this.remark = 'addon_remove'
    // }
    // console.log(this.remark);

    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'addon_remove', 6)
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
  }
  selectTab(tab: string) {
    console.log(tab);
    this.selectedTab = tab;
    this.selectedCas = ''
    this.castype = ''
    this.alacarteList = ''
    this.rowData = [];
    if (tab === 'activation') {
      console.log(tab);
      this.refresh();
    } else if (tab === 'remove') {
      console.log(tab);
      this.removerefresh();
    }
    this.filePath=''
  }
  get billingAddressCheckbox() {
    return this.form.get('billingAddressCheckbox');
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

  // casPackageList() {
  //   console.log(event);
  //   this.userservice.getAlacartelistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
  //     console.log(data);
  //     this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
  //     console.log(this.toppingList);
  //   })
  // }

  casPackageList() {
    console.log(this.castype);
    this.userservice.getAlacartelistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
      console.log(data);
      this.toppingList = Object.entries(data)
        .map(([key, value]) => ({ name: key, id: value }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name alphabetically
      console.log(this.toppingList);
    });
  }


  submit() {
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
      // formData.append('castype', this.castype);
      formData.append('type', '6');
      formData.append('iscollected', this.iscollected.toString());
      formData.append('retailerid', '0');
      formData.append('optype', '3');
      formData.append('selectedlist', this.alacarteList);
      this.swal.Loading();
      this.userservice.uploadFileForAddonAndAlacarteActivation(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else {
      Swal.fire({
        title: 'No File',
        text: 'Please select a file before uploading.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  remove() {
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
      formData.append('castype', this.castype);
      formData.append('type', '7');
      formData.append('iscollected', this.iscollected.toString());
      formData.append('retailerid', '0');
      formData.append('optype', '5');
      formData.append('selectedlist', this.alacarteList);

      this.userservice.uploadFileForAddonAndAlacarteActivation(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else {
      Swal.fire({
        title: 'No File',
        text: 'Please select a file before uploading.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  generateExcel(type: string) {
    this.excelService.generatealacarteactivationExcel(type);
  }


  filterCas(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.cas = this.casList.filter((cas: any) => cas.name.toLowerCase().includes(filterValue));
  }

  filterToppings(event: any) {
    console.log(event);
    const filterValue = event.target.value.toLowerCase();

    this.filteredToppingList = this.toppingList.filter(topping =>
      topping.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredToppingList);

  }
  casname: any;
  onCaschange(selectedCas: any): void {
    this.selectedCas = selectedCas;
    this.castype = selectedCas.id;
    console.log("Selected CAS type:", this.castype);
    // this.userservice.getAlacartelistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
    //   console.log(data);
    //   this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.toppingList);
    // });
    this.userservice.getAddonListforbulk(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.toppingList);
    });
  }
  displayOperator(cas: any): string {
    return cas ? cas.name : '';
  }
}
