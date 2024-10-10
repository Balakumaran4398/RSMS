import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscriber-import',
  templateUrl: './subscriber-import.component.html',
  styleUrls: ['./subscriber-import.component.scss']
})
export class SubscriberImportComponent implements OnInit {
  file: File | null = null;
  filePath: string = '';
  streetid: any = 0;
  street_list: { [key: string]: number } = {};
  isCheckboxChecked: boolean = false;
  isFileSelected: boolean = false;
  isCheckboxChecked_operator: boolean = false;
  Dialogue: boolean = false;
  closeDialogue: boolean = true;
  selectedFCFormControl = new FormControl('');
  insert: any;
  operatorid: any=0;
  operator_details: any = [];
  operatorList: any[] = [];

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
  constructor(private storageservice: StorageService, private excelService: ExcelService, private userservice: BaseService, private location: Location) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
    this.operatorlist()
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, value: value };
      });
    })
  }
  onOperatorChange(event: any) {
    if (this.operatorid === '0') {
      this.operatorid = 0;
    }
    this.operatorid = event.target.value;
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

  // handleFileInput(event: Event): void {
  //   const input = event.target as HTMLInputElement;

  //   if (input.files && input.files.length > 0) {
  //     this.isFileSelected = true;
  //     this.filePath = input.files[0].name;
  //   } else {
  //     this.isFileSelected = false;
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
    if (this.file) {
      console.log(this.file); // File is correctly loaded

      // Show Swal alert for upload process
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      // Create FormData to send the file and other data
      const formData = new FormData();
      formData.append('role', this.role);  // Append additional form data
      formData.append('username', this.username);
      formData.append('file', this.file);  // Append the selected file
      formData.append('operatorid', this.operatorid);
      formData.append('isinsert', this.insert.toString());
      console.log(this.role);
      console.log(this.username);
      console.log(this.file);
      console.log(this.operatorid);
      console.log(this.insert.toString());


      this.userservice.bulkSubscriberInsert(formData).subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            title: 'Success!',
            text: res?.message || 'File uploaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          console.error("File upload failed", error);
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was a problem uploading your file. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
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
