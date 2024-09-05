import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss']
})
export class UpdateInventoryComponent {
  Id: any;
  Boxid: any;
  Smartcard: any;
  role: any;
  username: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    this.Id = data.id;
    this.Boxid = data.boxid;
    this.Smartcard = data.smartcard;
    console.log(this.Id);
    console.log(this.Boxid);
    console.log(this.Smartcard);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  // submit() {

  //   this.userService.Update_smartcard_Allocated(this.role, this.username, this.Id, this.Boxid, this.Smartcard).subscribe((res: any) => {
  //   })
  // }
  submit() {
    if (!this.Boxid || !this.Smartcard) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill out both Box ID and Smartcard fields.',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update the smartcard allocation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.Update_smartcard_Allocated(this.role, this.username, this.Id, this.Boxid, this.Smartcard)
          .subscribe(
            (res: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Smartcard allocation has been updated successfully.',
                confirmButtonText: 'OK',
              });
              window.location.reload();
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating the smartcard allocation. Please try again later.',
                confirmButtonText: 'OK',
              }).then(() => {
                // Reload the page after the user clicks 'OK'
                window.location.reload();
              });
            }
          );
      }
    });
  }

}

