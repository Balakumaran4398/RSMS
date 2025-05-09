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
  selector: 'app-alacarte-activation',
  templateUrl: './alacarte-activation.component.html',
  styleUrls: ['./alacarte-activation.component.scss']
})
export class AlacarteActivationComponent {
  file: File | null = null;
  isFileSelected: boolean = false;
  filePath: string = '';
  form: FormGroup;
  isCheckboxChecked: boolean = false;
  username: any;
  date: any;
  selectedDate: any;
  role: any;
  castype: any = '';
  selectedCas: any = '';
  alacarteList: any = '';
  iscollected: boolean = false;
  submittedRemove: boolean = false;
  submitted: boolean = false;
  cas: any[] = [];
  area: any;

  type = ["Type1", "Type2", "Type3"];
  toppings = new FormControl([]);
  toppingList: any[] = [];
  casItem: any;
  searchText: any;
  filteredToppingList: any;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard' , width: 250,},
    { headerName: "ADD PRODUCTS", field: 'packageid' },
    { headerName: "CHANNEL NAME", field: 'packagename' },
    { headerName: "ADDED PRODUCTS	", field: 'addingpackageid' },
    {
      headerName: "STATUS	", field: 'status',
      cellRenderer: (params: any) => {
        const status = params.value;
        if (status === 'Success') {
          return `<span style="color: green; ;">${status}</span>`;
        } else if (status === 'SMARTCARD NOT EXIST') {
          return `<span style="color: #b32222; ;">${status}</span>`;
        } else {
          return `<span style="color: #3235c9; ;">${status}</span>`;
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
    { headerName: "CHANNEL NAME", field: 'packagename', width: 250, cellStyle: { textAlign: 'left', } },
    {
      headerName: "STATUS	", field: 'status', width: 250, cellStyle: { textAlign: 'left', },
      cellRenderer: (params: any) => {
        const status = params.value;
        if (status === 'Success') {
          return `<span style="color: green; ;">${status}</span>`;
        } else if (status === 'SMARTCARD NOT EXIST') {
          return `<span style="color: #b32222; ;">${status}</span>`;
        } else {
          return `<span style="color: #3235c9; ;">${status}</span>`;
        }
      }
    },
    { headerName: "REMARKS", field: 'remarks', width: 200 },
    { headerName: "CREATED DATE	", field: 'createddate', width: 250 },
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
  onGridReady = () => {
    // this.userservice.GetAllUser('all',this.token.getUsername(),'0000-00-00','0000-00-00').subscribe((data) => {
    //   this.gridApi.setRowData(data);
    //   this.listUser = data;      
    // });
  }
  constructor(public dialog: MatDialog, private fb: FormBuilder, private swal: SwalService, private userservice: BaseService, private storageService: StorageService, private excelService: ExcelService) {
    this.form = this.fb.group({
      billingAddressCheckbox: [false]

    });
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  selectedTab: string = 'activation';
  ngOnInit() {
    // this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
    //   console.log(data);
    //   this.cas = data.map((item: any) => ({
    //     casname: item.casname,
    //     id: item.id
    // }));
    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.filteredToppingList = [...this.toppingList];
    // this.refresh();
    console.log(this.cas);
    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.cas);

    // });
    this.onCaschange('');
    this.getRefreshData();
  }
  filterToppings() {
    this.filteredToppingList = this.toppingList.filter(topping =>
      topping.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.selectedTab = tab;
    this.castype = ''
    this.alacarteList = ''
    this.rowData = [];
    if (tab === 'activation') {
      console.log(tab);
      this.getRefreshData();
    } else if (tab === 'remove') {
      console.log(tab);
      this.getRemoveRefresh();
    }
    this.filePath = '';
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

  casPackageList() {
    if (this.castype === '0') {
      Swal.fire({
        title: 'Error',
        text: 'Please select a valid CAS before accessing the alacarte list.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    } else {
      this.loadAlacarteList();
    }
  }
  loadAlacarteList() {
    this.userservice.getAlacartelistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
      this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    })
  }
  onCaschange(selectedCas: any): void {
    this.selectedCas = selectedCas;
    this.castype = selectedCas.id;
    console.log("Selected CAS type:", this.castype);
    // this.userservice.getAlacartelistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
    //   console.log(data);
    //   this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.toppingList);
    // });
    this.userservice.getAlacarteListforbulk(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.toppingList);
    });
  }
  remove() {
    this.submittedRemove = true;
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
      formData.append('optype', '6');
      formData.append('selectedlist', this.alacarteList);
      formData.append('dueamount', '0');
      formData.append('paidamount', '0');
      formData.append('android_id', '0');
      formData.append('device_id', '0');
      formData.append('ui_type', '1');
      formData.append('comments', 'No Comment');
      formData.append('billtype', '2');
      formData.append('iscollected', 'false');
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
      formData.append('castype', this.castype);
      formData.append('type', '6');
      formData.append('iscollected', this.iscollected.toString());
      formData.append('retailerid', '0');
      formData.append('optype', '4');
      formData.append('selectedlist', this.alacarteList);
      formData.append('dueamount', '0');
      formData.append('paidamount', '0');
      formData.append('android_id', '0');
      formData.append('device_id', '0');
      formData.append('ui_type', '1');
      formData.append('comments', 'No Comment');
      formData.append('billtype', '2');
      formData.append('iscollected', 'false');
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


  getAlacarteData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'alacarte_add', this.date, 5)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
            this.swal.Success_200();
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
  getRefreshData() {
    this.rowData = [];
    const dateToPass = this.selectedDate || this.date;
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'alacarte_add', 5)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
            this.swal.Success_200();
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
  getRemovedata() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'alacarte_remove', 7)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
            this.swal.Success_200();
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
  getRemoveRefresh() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'alacarte_remove', 7)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            const rowCount = this.rowData.length;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
            this.swal.Success_200();
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
