import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-inventorycortonbox',
  templateUrl: './inventorycortonbox.component.html',
  styleUrls: ['./inventorycortonbox.component.scss']
})
export class InventorycortonboxComponent implements OnInit {
  selectedFile: File | null = null;
  type: any;
  smartcardList: any[] = [];
  selectedType: string = '1'
  selectOperator: any;
  selectSubscriber: any;
  selectArea: any;
  selectedPackage: any;
  days: any;
  selectStreet: any;
  isemi: boolean = false;
  date: Date = new Date();
  cur_date: string = this.formatDate(new Date());
  dueamount: any;

  role: any;
  username: any;

  model: any;
  modelName: any;
  filteredOperatorList: any[] = [
    // { name: "aaa", value: 0 },
    // { name: "bbb", value: 1 },
    // { name: "cccc", value: 2 },
    // { name: "ddd", value: 3 },
    // { name: "eee", value: 4 },
  ];

  filteredAreaList: any[] = [
    // { name: "aaa", value: 0 },
    // { name: "bbb", value: 1 },
    // { name: "cccc", value: 2 },
    // { name: "ddd", value: 3 },
    // { name: "eee", value: 4 },
  ];
  filteredStreetList: any[] = [
    // { name: "aaa", value: 0 },
    // { name: "bbb", value: 1 },
    // { name: "cccc", value: 2 },
    // { name: "ddd", value: 3 },
    // { name: "eee", value: 4 },
  ];
  filteredPackageList: any[] = [
    // { name: "aaa", value: 0 },
    // { name: "bbb", value: 1 },
    // { name: "cccc", value: 2 },
    // { name: "ddd", value: 3 },
    // { name: "eee", value: 4 },
  ];

  constructor(
    public dialogRef: MatDialogRef<InventorycortonboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userservice: BaseService, private excelService: ExcelService, private storageService: StorageService, private swal: SwalService) {
    console.log(data);
    this.type = data.type;
    this.smartcardList = data.smartcard;
    console.log(this.type);
    console.log(this.smartcardList);

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    this.operatorlist();
    this.onPackageList('');
  }

  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.filteredOperatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.filteredOperatorList);

    })
  }
  onAreaList(type: any) {
    console.log(type);

    if (this.selectOperator) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.selectOperator)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.streetid);
          this.filteredAreaList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.filteredAreaList);
        });

    }
  }
  onStreetList(type: any) {
    if (this.selectOperator) {
      this.userservice.getStreetListByAreaid(this.role, this.username, this.selectArea)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.streetid);
          this.filteredStreetList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.filteredStreetList);
        });
    }
  }
  onStreetName(typename: any) {
    console.log(typename);
    this.selectStreet = typename
  }
  onPackageList(type: any) {
    this.userservice.getBulkPackageUpdationList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredPackageList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.filteredPackageList);
    });
  }
  ngAfterViewInit() {
    $('#operator').select2({
      placeholder: 'Select a Operator',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      this.selectOperator = event.target.value;
      this.onAreaList(this.selectOperator);
    });
    $('#area').select2({
      placeholder: 'Select a Area',
      allowClear: true
    });
    $('#area').on('change', (event: any) => {
      this.selectArea = event.target.value;
      this.onStreetList(this.selectArea);
    });
    $('#street').select2({
      placeholder: 'Select a Street',
      allowClear: true
    });
    $('#street').on('change', (event: any) => {
      this.selectStreet = event.target.value;
      this.onStreetName(this.selectStreet);
    });

    $('#package').select2({
      placeholder: 'Select a Package',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      this.selectedPackage = event.target.value;
      this.onPackageList(this.selectedPackage);
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  generateExcel(type: string) {
    this.excelService.generatealacarteactivationExcel(type);
  }
  submit() {
    console.log(this.selectedFile);
    if (this.selectedFile) {
      console.log(this.selectedFile);
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
      formData.append('file', this.selectedFile);
      this.swal.Loading();
      this.userservice.cortonBoxUplod(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
          this.swal.Close();
        }, (err) => {
          this.swal.Close();
          this.swal.Error3(err?.error?.message || err?.error || err);
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
  setallocation() {
    this.swal.Loading();
    this.userservice.cortonBoxDetails(this.role, this.username, this.selectOperator, this.isemi, this.dueamount || 0, this.selectedType, this.selectArea || 0, this.selectStreet || 0,
      this.selectedPackage || 0, this.days || 0, this.selectSubscriber || 0, this.smartcardList)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        console.log(err);
        this.swal.Error(err?.error?.message || err?.error);
      });
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  logValues(): void {
    const formattedDate = this.date ? this.formatDate(this.date) : 'No date selected';
    console.log('Selected Date:', formattedDate);

    this.cur_date = formattedDate;
    console.log(this.cur_date);

  }
  upload() {
    console.log(this.date);
    this.swal.Loading();
    this.userservice.getInventoryUpdateDate(this.role, this.username, this.cur_date)
      .subscribe((res: any) => {
        this.swal.success(res?.message);

      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
