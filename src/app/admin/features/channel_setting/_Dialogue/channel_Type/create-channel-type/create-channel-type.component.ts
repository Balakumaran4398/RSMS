import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
interface Channel_Type_Requestbody {
  name: any,
  username: any,
  role: any,
}
@Component({
  selector: 'app-create-channel-type',
  templateUrl: './create-channel-type.component.html',
  styleUrls: ['./create-channel-type.component.scss']
})
export class CreateChannelTypeComponent {
  ChannelType_name: any;
  username:any;
  role:any;
  errorMessage:any;

  constructor(
    public dialogRef: MatDialogRef<CreateChannelTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public userService: BaseService, public storageService: StorageService, private fb: FormBuilder) {
   
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.username);
    console.log(this.role);
  }

  ChannelType() {
    if (!this.ChannelType_name) {
      this.errorMessage = 'ChannelType is required.';
      return;
    }
    let requestBody: Channel_Type_Requestbody = {
      name: this.ChannelType_name,
      username: this.username,
      role: this.role,
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this Channel type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait while the Channel is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.Channel_Type(requestBody).subscribe(
          (res) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ChannelType created successfully !!",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar:true,
            }).then(() => {
              window.location.reload();
              this.closeDialog();
            });
          },
          (error) => {
            console.error(error);
            let errorMessage = 'Failed to create ChannelType. Please try again.';
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar:true,

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
    if (this.ChannelType_name.trim()) {
      this.errorMessage = null; 
    }
  }
}
