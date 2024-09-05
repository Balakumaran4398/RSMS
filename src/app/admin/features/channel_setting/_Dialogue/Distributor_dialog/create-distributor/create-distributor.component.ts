import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
interface Dist_Requestbody {
  name: any,
  contact: any,
  address: any,
  email: any,
  username: any,
  role: any,
}
@Component({
  selector: 'app-create-distributor',
  templateUrl: './create-distributor.component.html',
  styleUrls: ['./create-distributor.component.scss']
})
export class CreateDistributorComponent {
  distributor_name: any;
  distributor_address: any;
  distributor_contact: any;
  distributor_mail: any;
  distributorForm: FormGroup | any;
  username: any;
  role: any
  constructor(
    public dialogRef: MatDialogRef<CreateDistributorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public userService: BaseService, public storageService: StorageService, private fb: FormBuilder) {
    console.log(data);

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.username);
    console.log(this.role);
    this.distributorForm = this.fb.group({
      distributor_name: ['', Validators.required],
      distributor_contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      distributor_address: ['', Validators.required],
      distributor_email: ['', [Validators.required, Validators.email]]
    });
  }


  onSubmit() {
    console.log('111');

    // if (this.distributorForm.invalid) {
    //   Swal.fire({
    //     position: 'center',
    //     icon: 'error',
    //     title: 'Invalid Form',
    //     text: 'Please correct the errors in the form.',
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    //   return;
    // }
    // console.log('234234324');
    if (this.distributorForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      this.distributorForm.markAllAsTouched();
      return;
    }
    const requestBody: Dist_Requestbody = {
      name: this.distributorForm.value.distributor_name,
      contact: this.distributorForm.value.distributor_contact,
      address: this.distributorForm.value.distributor_address,
      email: this.distributorForm.value.distributor_email,
      username: this.username,
      role: this.role,
    };
    console.log(requestBody);

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this Distributor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.Distributor(requestBody).subscribe(
          (res) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Distributor created successfully !!",
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              window.location.reload();
              this.closeDialog();
            });
          },
          (error) => {
            console.error(error);
            let errorMessage = 'Failed to create Distributor. Please try again.';
            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }

            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.distributorForm.controls;
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
  closeDialog() {
    this.dialogRef.close();
  }
}
