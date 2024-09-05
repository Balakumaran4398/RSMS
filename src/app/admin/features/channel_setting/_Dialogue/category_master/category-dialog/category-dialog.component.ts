import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
interface Category_Requestbody {
  name: any,
  username: any,
  role: any,
}
@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
  username:any;
  role:any;
  Category_name: any;
  errorMessage: any;
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public userService: BaseService, public storageService: StorageService, private fb: FormBuilder) {
   
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();

  }

  Category() {
    if (!this.Category_name) {
      this.errorMessage = 'Category Name is required.';
      return;
    }
    let requestBody: Category_Requestbody = {
      name: this.Category_name,
      username: this.username,
      role: this.role,
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.Category(requestBody).subscribe(
          (res) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Category created successfully !!",
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              window.location.reload();
              this.closeDialog();
            });
          },
          (error) => {
            console.error(error);
            let errorMessage = 'Failed to create Category. Please try again.';
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
  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
