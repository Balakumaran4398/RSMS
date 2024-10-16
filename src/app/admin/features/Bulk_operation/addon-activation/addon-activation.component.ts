import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addon-activation',
  templateUrl: './addon-activation.component.html',
  styleUrls: ['./addon-activation.component.scss']
})
export class AddonActivationComponent {
  file: File | null = null;
  filePath: string = '';
  form: FormGroup;
  isCheckboxChecked: boolean = false;
  iscollected: boolean = false;
  isFileSelected: boolean = false;
  username: any;
  role: any;
  date: any;
  castype: any = 0;
  alacarteList: any = 0;
  cas: any[] = [];
  area: any;
  CasFormControl: any = 0;
  type = ["Type1", "Type2", "Type3"];
  toppings = new FormControl([]);
  toppingList: any[] = [];
  // rowData: any;
  searchText: any;
  filteredToppingList = [...this.toppingList];

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'smartcard' },
    { headerName: "PACKAGE NAME", field: 'packagename' },
    { headerName: "ADDING PACKAGE", field: 'packageid' },
    { headerName: "ADDED PACKAGE ID	", field: 'addingpackageid' },
    { headerName: "STATUS	", field: 'status',
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
    { headerName: "SMARTCARD", field: 'smartcard' },
    { headerName: "PACKAGE NAME", field: 'packagename' },
    {
      headerName: "STATUS	", field: 'status',
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
    paginationPageSize: 10,
    pagination: true,
  }
  onGridReady = () => {
    // this.userservice.GetAllUser('all',this.token.getUsername(),'0000-00-00','0000-00-00').subscribe((data) => {
    //   this.gridApi.setRowData(data);
    //   this.listUser = data;      
    // });
  }
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService, private excelService: ExcelService) {
    this.form = this.fb.group({
      billingAddressCheckbox: [false]

    });
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  selectedTab: string = 'activation';
  ngOnInit() {
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.cas);

    });
  }


  filterToppings() {
    this.filteredToppingList = this.toppingList.filter(topping =>
      topping.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  getData() {
    this.userservice.getBulkOperationListByDate(this.role, this.username, 'addon_add', this.date, 4)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            this.rowData = [];
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
            
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire('Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );
  }
  refresh() {
    this.userservice.getBulkOperationRefreshList(this.role, this.username, 'addon_add', 4)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.rowData = response.body;
            Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire('Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
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
    console.log(event);
    this.userservice.getAlacartelistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
      console.log(data);
      this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.toppingList);

    })
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
      formData.append('castype', this.castype);
      formData.append('type', '6');
      formData.append('iscollected', this.iscollected.toString());
      formData.append('retailerid', '0');
      formData.append('optype', '3');
      formData.append('selectedlist', this.alacarteList);

      this.userservice.uploadFileForAddonAndAlacarteActivation(formData).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Upload Complete',
            text: 'Your file has been successfully uploaded!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Error',
            text: 'There was an issue uploading your file. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
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
      formData.append('optype', '3');
      formData.append('selectedlist', this.alacarteList);

      this.userservice.uploadFileForAddonAndAlacarteActivation(formData).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Upload Complete',
            text: 'Your file has been successfully uploaded!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Error',
            text: 'There was an issue uploading your file. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
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
}
