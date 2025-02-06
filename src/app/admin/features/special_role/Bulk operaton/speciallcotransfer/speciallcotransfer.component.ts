import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

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

  constructor(private userservice: BaseService, private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
    this.operatorlist();
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
  opendialogue(): void {
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
          this.swal.Error(err?.error?.message);
        });
    }
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username,2).subscribe((data: any) => {
      console.log(data);
      this.lcoList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, value: value };
      });
      this.filteredOperators = this.lcoList
    })
  }


  onSubscriberStatusChange() {
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


  onAreaStatusChange() {
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
}
