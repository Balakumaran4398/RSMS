import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss']
})
export class PackageEditComponent implements OnInit {
  package_name: any;
  package_rate: any;
  package_desc: any;
  package_id: any;
  username: any;
  order_id: any;
  ispercentage: boolean = false;
  commission: any= '0.0';
  role: any;
  value: any;
  constructor(
    public dialogRef: MatDialogRef<PackageEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.username + "-------------------------" + this.role);
    this.package_name = data.packagename;
    this.package_desc = data.packagedesc;
    this.package_rate = data.packagerate;
    this.order_id = data.orderid;
    // this.broadcaster_id=data.broadcaster_id;
    // this.commission = data.commission;
    this.ispercentage = data.isactive;
    this.package_id = data.packageid;


  }
  ngOnInit(): void {
    this.userService.Package_CloneList(this.role, this.username, this.package_id).subscribe((data: any) => {
      console.log(data);
      this.commission = data.customeramount;
      console.log(this.value);

    })
  }

  onKeydown1(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) || /^[0-9.]*$/.test(event.key)) {
      return;
    }
    event.preventDefault();
  }

  onFocus() {
    if (this.commission === '0.0') {
      this.commission = '';
    }
  }

  onBlur() {
    if (!this.commission || this.commission === '') {
      this.commission = '0.0';
    }
  }
  Update_package() {
    // const request = {
    //   package_name: this.package_name,
    //   package_rate: this.package_rate,
    //   package_desc: this.package_desc,
    //   order_id: this.order_id,
    //   username: this.username,
    //   role: this.role,
    //   package_id: this.package_id,
    //   commission: this.commission,
    //   ispercentage: this.ispercentage
    // };

    Swal.fire({
      title: 'Updating...',
      text: 'Wait for the package to update...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userService.Package_Update(this.package_name, this.package_desc, this.package_rate, this.order_id, this.role, this.username, this.commission, this.ispercentage, this.package_id,).subscribe((res: any) => {
      console.log(res);
      Swal.fire({
        position: "center",
        icon: "success",
        title: res?.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        window.location.reload();
      });
    },
      (error) => {
        console.error(error);
        const errorMessage = error?.error?.message || 'An error occurred while updating the package.';
        // Error message
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    );

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
}
