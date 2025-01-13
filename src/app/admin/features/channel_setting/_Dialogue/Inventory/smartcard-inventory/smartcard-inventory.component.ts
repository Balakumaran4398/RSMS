import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smartcard-inventory',
  templateUrl: './smartcard-inventory.component.html',
  styleUrls: ['./smartcard-inventory.component.scss']
})
export class SmartcardInventoryComponent {
  Boxid: any;
  smartcard: any;
  role: any;
  username: any;
  id: any;
  constructor(
    public dialogRef: MatDialogRef<SmartcardInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.Boxid = data.boxid;
    this.smartcard = data.smartcard;
    this.id = data.id;
    console.log(this.Boxid);
    console.log(this.smartcard);
    console.log(this.id);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  Delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Deallocation it!',
      cancelButtonText: 'Cancel',
      timerProgressBar: true,
      allowOutsideClick: false,

    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: 'Processing...',
        //   text: 'Please wait Loading Onprogrss.',
        //   allowOutsideClick: false,
        //   didOpen: () => {
        //     Swal.showLoading(null);
        //   }
        // });
        this.userService.delete_Smartcard_boxid(this.role, this.username, this.id).subscribe((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Deallocated!',
            text: data?.message || 'Smartcard and Box ID have been Deallocated successfully.',
            imageUrl: 'path/to/success-image.png',
            imageHeight: 100,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            window.location.reload();
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.error?.message || 'There was an error Deallocating the Smartcard and Box ID. Please try again.',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
          });
        });
      } else if (result.dismiss === Swal.DismissReason.timer) {
        Swal.close();
      }
    });
  }


}
