import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-inventory',
  templateUrl: './sub-inventory.component.html',
  styleUrls: ['./sub-inventory.component.scss']
})
export class SubInventoryComponent {
  role: any;
  username: any;
  rowData: any;
  selectedLcoName: any = 0;
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';
  ismei: any;
  totalamount: any;
  smartcard: any;
  operatorid: any;
  constructor(
    public dialogRef: MatDialogRef<SubInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.lco_list = data.lco_list;
    console.log(this.lco_list);
    this.smartcard = data.smartcard;
    console.log(this.smartcard);
    this.ismei = data.isemi;
    console.log(this.ismei);

  }
  onNoClick(): void {
    this.dialogRef.close();
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
  // Submit() {
  //   this.userService.ALLOCATED_SMARTCARD_TO_LCO(this.smartcard, this.role, this.username, this.ismei, '0.0', this.selectedLcoName).subscribe((res: any) => {
  //     console.log(res);

  //   })
  // }
  Submit() {
    // Validate form fields before submission
    // if (!this.smartcard || !this.role || !this.username || !this.ismei || !this.selectedLcoName) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Validation Error',
    //     text: 'Please fill out all required fields.',
    //   });
    //   return;
    // }

    // Confirmation before API call
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to allocate the smartcard?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, allocate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with API call if confirmed
        this.userService.ALLOCATED_SMARTCARD_TO_LCO(this.smartcard, this.role, this.username, this.ismei, '0.0', this.selectedLcoName).subscribe(
          (res: any) => {
            // Success message
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text:res.message|| 'Smartcard has been successfully allocated.',
            });
            console.log(res);
          },
          (error) => {
            // Error handling
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.error?.message || 'Something went wrong. Please try again later.',
            });
            console.error(error);
          }
        );
      }
    });
  }

}
