import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addon-edit',
  templateUrl: './addon-edit.component.html',
  styleUrls: ['./addon-edit.component.scss']
})
export class AddonEditComponent {
  addon_package_name: any;
  addon_package_rate: any;
  addon_package_description: any;
  taxRate: number = 1;
  package_id: any;
  id: any;
  username: any;
  order_id: any;
  broadcaster_id: any;
  commission: string = '0.0';
  tax_amount: any = '0.0';
  customer_amount: any = '0.0';
  mso_amount: any = '0.0';
  ispercentage: any;
  role: any;
  constructor(
    public dialogRef: MatDialogRef<AddonEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    // if (data.addon) {
    //   this.addon = true;
    // }
    // if (data.package_cr) {
    //   this.package_cr = true;
    // }

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.username + "-------------------------" + this.role);

    this.order_id = data.order_id;
    this.broadcaster_id = data.broadcaster_id;
    this.commission = data.commission;
    this.ispercentage = data.isactive;

    this.addon_package_name = data.addon_package_name;
    this.addon_package_rate = data.addon_package_rate;
    this.addon_package_description = data.addon_package_description
    this.tax_amount = data.tax_amount
    this.customer_amount = data.customer_amount
    this.mso_amount = data.mso_amount
    this.taxRate = data.taxRate
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
  Update_Addon_package() {
    const request = {
      id: this.id,
      addon_package_name: this.addon_package_name,
      addon_package_rate: this.addon_package_rate,
      addon_package_description: this.addon_package_description,
      order_id: this.order_id,
      broadcaster_id: this.broadcaster_id,
      username: this.username,
      role: this.role,
      mso_amount: this.mso_amount,
      package_id: this.package_id,
      tax_amount: this.tax_amount,
      customer_amount: this.customer_amount,
      commission: this.commission,
      ispercentage: this.ispercentage
    };
    // if (!request.package_name || !request.package_rate || !request.package_desc || !request.order_id || !request.username || !request.role || !request.package_id || !request.commission || !request.ispercentage) {
    //   Swal.fire({
    //     position: "center",
    //     icon: "warning",
    //     title: "Please check the input",
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    //   return; // Stop further execution if validation fails
    // }
    Swal.fire({
      title: 'Updating...',
      text: 'Wait for the package to update...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.userService.UPDATE_ADDON_PACKAGE(request).subscribe((res: any) => {
      console.log(res.message);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Package Updated successfully !!",
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
      });
    },
      (error) => {
        // console.error(error.message);
        const errorMessage = error?.error?.message || 'An error occurred while updating the package.';
        // Error message
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
}
