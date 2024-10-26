import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
interface BROAD_Requestbody {
  broadcastername: any,
  username: any,
  role: any,
  // isactive: boolean,
}
@Component({
  selector: 'app-broad-create-dialog',
  templateUrl: './broad-create-dialog.component.html',
  styleUrls: ['./broad-create-dialog.component.scss']
})
export class BroadCreateDialogComponent {
  broadcastername: any;
  username: any;
  role: any;
  errorMessage: any;
  constructor(public dialogRef: MatDialogRef<BroadCreateDialogComponent>, private userService: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  Broadcaster() {
    if (!this.broadcastername) {
      this.errorMessage = 'Broadcaster Name is required.';
      return;
    }
    let requestBody: BROAD_Requestbody = {
      broadcastername: this.broadcastername,
      username: this.username,
      role: this.role,
      // isactive: true,
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this broadcaster?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the Broadcaster to be created....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.Broadcaster(requestBody).subscribe(
          (res: any) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: res?.message || "Broadcaster created successfully !!",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              window.location.reload();
              this.closeDialog();
            });
          },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.errorMessage || 'Failed to create broadcaster. Please try again.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        );
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  errorToggle(){
    this.errorMessage=!this.errorMessage;
  }
  clearError() {
    if (this.broadcastername.trim()) {
      this.errorMessage = null; 
    }
  }
}
