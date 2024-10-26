import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-lco-commission',
  templateUrl: './update-lco-commission.component.html',
  styleUrls: ['./update-lco-commission.component.scss']
})
export class UpdateLcoCommissionComponent {
  role: any;
  username: any;
  productname: any;
  producttype: any;
  productrate: any;
  commissionvalue: any;
  id: any;

  isYesActive: boolean = false;
  isPercentage: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<UpdateLcoCommissionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private cdr: ChangeDetectorRef, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);

    this.productname = data.productname;
    this.producttype = data.productTypeDisplay;
    this.id = data.id;
    this.productrate = data.rate;
    this.commissionvalue = data.commissionvalue;
    this.isPercentage = data.ispercentage;
    console.log(this.id);
 
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // change() {
  //   this.userservice.updateLcoCommission(this.role, this.username, this.id, this.isYesActive, this.isPercentage, this.commissionvalue).subscribe((response: any) => {
  //     console.log(response);

  //   })
  // }

  change() {
    // Show Swal loading alert with a timer
    Swal.fire({
      title: 'Updating Commission...',
      html: 'Please wait while the commission is being updated.',
      timer: 3000, // Time in milliseconds (e.g., 3000ms = 3 seconds)
      timerProgressBar: true,
      // didOpen: () => {
      //   Swal.showLoading();
      // }
    });

    // Make the API call
    this.userservice.updateLcoCommission(this.role, this.username, this.id, this.isYesActive, this.isPercentage, this.commissionvalue,this.productrate)
      .subscribe((response: any) => {
        console.log(response);
        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response?.message || 'Commission updated successfully!',
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          this.dialogRef.close();
        });
      }, (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.error.message || 'Failed to update commission. Please try again.',
        });
      });
  }

  // toggleYes() {
  //   this.isYesActive = true; // Set Yes active
  //   this.isPercentage = this.isYesActive
  //   console.log("Ispercentage" + this.isPercentage);
  // }

  // toggleNo() {
  //   this.isYesActive = false; // Set No active
  //   this.isPercentage = this.isYesActive
  //   console.log("Ispercentage" + this.isPercentage);
  // }
}

