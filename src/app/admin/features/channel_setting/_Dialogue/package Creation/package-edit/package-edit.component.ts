import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
  package_name_1: any;
  package_rate_1: any;
  package_desc: any;
  package_id: any;
  username: any;
  order_id: any;
  ispercentage: boolean = false;
  ispercentage_1: boolean = false;
  commission: any;
  commission_1: any;
  role: any;
  value: any;
  userid: any;
  accessip: any;
  invalid: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<PackageEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private cdr: ChangeDetectorRef) {
    console.log(data);

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    this.package_name = data.packagename;
    this.package_name_1 = data.packagename;
    this.package_desc = data.packagedesc;
    this.package_rate = data.packagerate;
    this.package_rate_1 = data.packagerate;
    this.order_id = data.orderid;
    // this.broadcaster_id=data.broadcaster_id;
    this.commission = data.customeramount;
    this.commission_1 = data.customeramount;
    console.log(this.commission);

    this.ispercentage = data.ispercentage;
    this.ispercentage_1 = data.ispercentage;
    console.log(data.isactive);

    this.package_id = data.packageid;


  }
  ngOnInit(): void {
    this.checkMaxValue();

    // this.userService.Package_CloneList(this.role, this.username, this.package_id).subscribe((data: any) => {
    //   console.log(data);
    //   this.commission = data.customeramount;
    //   console.log(this.commission);

    // }) 

  }

  onKeydown1(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) || /^[0-9.]*$/.test(event.key)) {
      return;
    }
    event.preventDefault();
    this.checkMaxValue();
  }


  percentageChange(value: boolean) {
    this.ispercentage = value;
    this.checkMaxValue();
  }
  checkMaxValue(): void {
    if (!this.ispercentage && (this.commission > this.package_rate)) {
      console.log('if');

      this.invalid = true;
    } else if (this.ispercentage && this.commission > 100) {
      console.log('else');

      this.invalid = true;
    } else {
      console.log('final else');

      this.invalid = false;
    }
    this.cdr.detectChanges();
    console.log(this.ispercentage);
    console.log(this.commission);
    console.log(this.package_rate);



    console.log('invalid-------------------------------' + this.invalid);

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
      const data = ` Package Name: ${this.package_name}, ` + `Package Rate: ${this.package_rate},` + ` Commission: ${this.commission},` + ` Is Percentage: ${this.ispercentage},`;
      const remark = ` Package Name: ${this.package_name_1}, ` + `Package Rate: ${this.package_rate_1},` + ` Commission: ${this.commission_1},` + ` Is Percentage: ${this.ispercentage_1},`;
      this.logCreate('Package edit Button Clicked', remark, data);
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

  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
  preventnegativeInput(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
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
