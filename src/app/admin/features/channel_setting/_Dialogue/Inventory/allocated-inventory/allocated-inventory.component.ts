import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allocated-inventory',
  templateUrl: './allocated-inventory.component.html',
  styleUrls: ['./allocated-inventory.component.scss']
})
export class AllocatedInventoryComponent {
  role: any;
  username: any;
  rowData: any;
  smartcard: any;
  boxid: any;
  castype: { [key: string]: number } = {};
  lco_list: { [key: string]: number } = {};
  operatorid: { [key: string]: number } = {};
  selectedCasType:any  = 0;
  selectedLcoName: any  = 0;
  searchTerm: string = '';
  key: any;

  constructor(
    public dialogRef: MatDialogRef<AllocatedInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log('Data received:', data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    this.castype = data.castype;
    this.lco_list = data.lco_list;
    console.log(this.castype);

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
  filteredCasKeys(): string[] {
    const keys = Object.keys(this.castype);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(cas =>
      cas.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }



  submit() {
    // Ensure that the required values are available before making the API call
    if (!this.selectedLcoName || !this.selectedCasType || !this.smartcard || !this.boxid) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all required fields before submitting.',
        timer:3000,
        timerProgressBar: true,
      });
      return;
    }
    this.userService.Create_Allocated(
      this.selectedLcoName,  
      this.selectedCasType,  
      this.smartcard,        
      this.boxid,            
      this.role,             
      this.username          
    ).subscribe((data: any) => {
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: data?.message || 'Smartcard allocation has been created successfully.',
        timer:3000,
        timerProgressBar: true,
        
      }).then(() => {
        window.location.reload();
      });
    }, (error: any) => {
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.error?.message || 'There was an error creating the smartcard allocation. Please try again.',
        timer:3000,
        timerProgressBar: true,

      });
    });
  }

}
