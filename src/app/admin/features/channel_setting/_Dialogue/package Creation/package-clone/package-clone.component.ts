import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-clone',
  templateUrl: './package-clone.component.html',
  styleUrls: ['./package-clone.component.scss']
})
export class PackageCloneComponent {
  package_name: any;
  package_rate: any;
  package_desc: any;
  package_view_count: any;
  Reference_id: any;
  username: any;
  role: any;
  package_id: any;
  constructor(
    public dialogRef: MatDialogRef<PackageCloneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.package_name = data.packagename;
    this.package_rate = data.packagerate;
    this.package_desc = data.packagedesc;
    this.Reference_id = data.orderid;
    this.package_id = data.packageid;
    userService.Package_CloneList(this.role, this.username, this.package_id).subscribe((data: any) => {
      console.log(data);
      this.package_view_count = data.count;
    })
  }
  ngOnInit(): void {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  Create(): void {
    const request = {
      package_name: this.package_name,
      package_rate: this.package_rate,
      package_desc: this.package_desc,
      Reference_id: this.Reference_id,
      username: this.username,
      role: this.role,
      package_id: this.package_id
    };
    if (!request.package_name || !request.package_rate || !request.package_desc || !request.Reference_id) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please check the input",
        showConfirmButton: false,
        timer: 1500
      });
      return; // Stop further execution if validation fails
    }
    Swal.fire({
      title: 'Loading...',
      text: 'Wait for the clone to be created.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.userService.Clone_create(this.package_id, this.package_name, this.package_desc, this.package_rate, this.Reference_id, this.role, this.username).subscribe((res: any) => {
      console.log(res);
      Swal.fire({
        position: "center",
        icon: "success",
        text: res.message,
        // title: "Clone created successfully !!",
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        window.location.reload();
      });
    },
      (err) => {
        console.error(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to create Clone. Please try again.',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
    // window.location.reload();
  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
