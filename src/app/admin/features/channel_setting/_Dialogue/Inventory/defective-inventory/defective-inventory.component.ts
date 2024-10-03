import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defective-inventory',
  templateUrl: './defective-inventory.component.html',
  styleUrls: ['./defective-inventory.component.scss']
})
export class DefectiveInventoryComponent {
  remarks: any;
  username: any;
  role: any;
  id: any;
  selectedIds: any[];

  constructor(
    public dialogRef: MatDialogRef<DefectiveInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.id);
    this.selectedIds = data.selectedIds;
    console.log(this.selectedIds);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  
  submit() {
    if (!this.remarks || this.remarks.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Remarks cannot be empty. Please provide a remark.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Show loading spinner
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false, // Disable closing by clicking outside
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      }
    });
  
    // Make the service call
    this.userService.Defective_remark_Allocated(this.selectedIds, this.remarks, this.role, this.username)
      .subscribe(
        (data: any) => {
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data?.message || 'The defective remark has been allocated successfully.',
            timer: 3000, // Automatically close after 3 seconds
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            // Reload the page after the alert is closed
            window.location.reload();
          });
        },
        (error) => {
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.error?.message || 'There was an error allocating the defective remark. Please try again.',
            timer: 3000, // Automatically close after 3 seconds
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      );
  }
  
}
