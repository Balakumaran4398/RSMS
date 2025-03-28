import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-lco-smartcard-dialog',
  templateUrl: './lco-smartcard-dialog.component.html',
  styleUrls: ['./lco-smartcard-dialog.component.scss']
})
export class LcoSmartcardDialogComponent {
  role: any;
  username: any;
  lcoPaymentList: any;

  pay: string = '0.0';
  iscredit: boolean = true;
  confirmation: boolean = false;
  op_id: any;
  smartcard: any;
  status: any;
  useragent: any;

  constructor(
    public dialogRef: MatDialogRef<LcoSmartcardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService,
    private cdr: ChangeDetectorRef) {
    console.log(data);
    this.lcoPaymentList = data.data;
    this.op_id = data.lcoid;
    this.useragent = data.userarant;
    this.smartcard= this.lcoPaymentList?.smartcard;
    this.status= this.lcoPaymentList?.status;

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    this.swal.Loading();
    this.userService.getupdatePaybill(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, this.useragent)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
