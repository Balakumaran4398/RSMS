import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { BulkpackageupdationComponent } from '../BULK OPERATION/bulkpackageupdation/bulkpackageupdation.component';

@Component({
  selector: 'app-recharge-confirmation',
  templateUrl: './recharge-confirmation.component.html',
  styleUrls: ['./recharge-confirmation.component.scss']
})
export class RechargeConfirmationComponent {
  role: any;
  username: any;
  requestBody: any[] = [];
  amount_status: any;
  lco_Balance: any;
  totalLCO_amount: any;
  new_balance: any;
  constructor(public dialogRef: MatDialogRef<BulkpackageupdationComponent>, private swal: SwalService,
    @Inject(MAT_DIALOG_DATA) public data: any, public userservice: BaseService, private cdr: ChangeDetectorRef, public storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    this.amount_status = data?.Amount_Status;
    this.lco_Balance = data?.lcoBalance;
    this.totalLCO_amount = data?.TotalLCO_Amount;
    this.new_balance = parseFloat((this.lco_Balance - this.totalLCO_amount).toFixed(2));
    console.log(this.new_balance);
    this.requestBody = data;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    console.log(this.requestBody);

    this.swal.Loading();
    this.userservice.bulkPackageUpdation(this.requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}
