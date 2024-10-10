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
  lco_list: { [key: string]: number } = {};
  operatorid: any;
  smartcard: any;
  searchTerm: string = '';
  selectedFile: File | null = null;

  BTNFormControl = new FormControl('');
  CASFormControl = new FormControl('');
  LCOFormControl = new FormControl('');
  FileFormControl = new FormControl('');
  isOperatorDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userService: BaseService, private storageService: StorageService, ) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.castype = data.castype;
    console.log(this.castype);
    
    this.lco_list = data.lco_list;
    this.smartcard = data.smartcard;
  }

  onInventoryTypeChange(value: boolean): void {
    // If "Upload Only" is selected, disable the operator selection
    this.isOperatorDisabled = value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
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
  
    if (this.selectedFile) {
      // Show SweetAlert loading popup
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false, // Hide the confirm button
        // didOpen: () => {
        //   Swal.showLoading(); // Show loading animation
        // }
      });
  
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('operatorid', this.LCOFormControl.value || '0');
      formData.append('castype', this.CASFormControl.value || '');
      formData.append('isupload', this.BTNFormControl.value?.toString() || '');
  
      this.userService.UploadInventory(formData).subscribe(
        (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            text: res?.message,
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.reload();
          });
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: err?.error?.message,
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
  
}
