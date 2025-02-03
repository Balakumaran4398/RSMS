import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.scss']
})
export class EditInventoryComponent {
  role: any;
  username: any;
  rowData: any;
  selectedLcoName: any = 0;
  selectedCasType: any = 0;

  castype: { [key: string]: number } = {};
  // lco_list: { [key: string]: number } = {};
  lco_list: any[] = [];
  operatorid: any;
  smartcard: any;
  searchTerm: string = '';
  selectedFile: File | null = null;

  BTNFormControl = new FormControl('');
  CASFormControl = new FormControl('');
  LCOFormControl = new FormControl('');
  FileFormControl = new FormControl('');
  filteredOperators: any[] = [];
  selectedOperator: any;
  submitted: boolean = false;
  isOperatorDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.castype = data.castype;
    console.log(this.castype);

    // this.lco_list = data.lco_list;
    this.lco_list = Object.entries(data.lco_list).map(([key, value]) => {
      return { name: key, value: value };
    });

    this.smartcard = data.smartcard;
    this.filteredOperators = this.lco_list;
  }

  onInventoryTypeChange(value: boolean): void {
    this.isOperatorDisabled = value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filterOperators);

  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }
  filteredCasKeys(): string[] {
    const keys = Object.keys(this.castype);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(cas =>
      cas.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }



  submit() {
    console.log(this.selectedLcoName);
    this.submitted = true;
    if (this.selectedFile) {
      // Show SweetAlert loading popup
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false, // Hide the confirm button
        didOpen: () => {
          Swal.showLoading(null);
        }
      });

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('operatorid', this.LCOFormControl.value || '0');
      formData.append('castype', this.CASFormControl.value || '');
      formData.append('isupload', this.BTNFormControl.value?.toString() || '');
      this.swal.Loading();
      this.userService.UploadInventory(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }

}
