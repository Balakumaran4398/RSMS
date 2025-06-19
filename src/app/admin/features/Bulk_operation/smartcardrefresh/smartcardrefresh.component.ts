import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smartcardrefresh',
  templateUrl: './smartcardrefresh.component.html',
  styleUrls: ['./smartcardrefresh.component.scss']
})
export class SmartcardrefreshComponent implements OnInit {
  role: any;
  username: any;
  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;
  isCheckboxChecked: boolean = false;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  submitted: boolean = false;
  retailerid: any;
  lcoDeatails: any;
  operatorname: any
  constructor(private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService, private cdr: ChangeDetectorRef, private userservice: BaseService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    }
    if (this.role == 'ROLE_SUBLCO') {
      this.subLCOdetails();
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
    this.excelService.generateSmartcardRefreshExcel();
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
}
