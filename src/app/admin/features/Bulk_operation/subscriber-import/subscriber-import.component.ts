import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/_core/service/swal.service';

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
  constructor(private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService, private cdr: ChangeDetectorRef,
    private userservice: BaseService, private location: Location) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }

  operatorlist() {
    this.userservice.getPackageList(this.role, this.username,1  ).subscribe((data: any) => {
      console.log(data);
      this.cdr.detectChanges();
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();

        return { name: name, value: value };
      });
      this.cdr.detectChanges();

      this.filteredPackage = this.operatorList;
    })
  }
  ngOnInit(): void {
    this.operatorlist();

    // this.filteredPackage = this.operatorList;
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
}
