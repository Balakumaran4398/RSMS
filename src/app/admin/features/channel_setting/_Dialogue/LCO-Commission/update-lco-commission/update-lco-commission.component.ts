import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
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

  type: any;
  isYesActive: boolean = false;
  isPercentage: boolean = false;

  disProductname: any;
  disProducttype: any;
  disProductrate: any;
  disCommissionvalue: any;
  msoamount: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateLcoCommissionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.type = data.type;
    console.log(this.type);

    this.productname = data?.data?.productname;
    this.producttype = data?.data?.productTypeDisplay;
    this.id = data?.data?.id;
    this.productrate = data?.data?.rate;
    this.commissionvalue = data?.data?.commissionvalue;
    this.isPercentage = data?.data?.ispercentage;
    console.log(this.id);
    this.disProductname = data?.data?.productname;
    this.disProducttype = data?.data?.productTypeDisplay;
    this.disProductrate = data?.data?.rate;
    this.disCommissionvalue = data?.data?.commissionvalue;
    this.msoamount = data?.data?.msoamount;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // change() {
  //   this.userservice.updateLcoCommission(this.role, this.username, this.id, this.isYesActive, this.isPercentage, this.commissionvalue).subscribe((response: any) => {
  //     console.log(response);

  //   })
  // }

  updateCommission() {
    // Show Swal loading alert with a timer
    Swal.fire({
      title: 'Updating Commission...',
      html: 'Please wait while the commission is being updated.',
      timer: 3000, // Time in milliseconds (e.g., 3000ms = 3 seconds)
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    // Make the API call
    this.userservice.updateLcoCommission(this.role, this.username, this.id, this.isYesActive, this.isPercentage, this.commissionvalue, this.productrate)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }


  updateDisCommission() {
    // Show Swal loading alert with a timer
    Swal.fire({
      title: 'Updating Distributor Commission...',
      html: 'Please wait while the commission is being updated.',
      timer: 3000, // Time in milliseconds (e.g., 3000ms = 3 seconds)
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    // Make the API call
    this.userservice.updateDistributorCommission(this.role, this.username, this.id,this.msoamount)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}

