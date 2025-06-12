import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrls: ['./payment-update.component.scss']
})
export class PaymentUpdateComponent {
  localPaymentChannelList: any;
  confirmationPaymentList: any = null;
  disPaymentList: boolean = false;
  role: any;
  username: any;
  pay: string = '0.0';
  pay_1: string = '0.0';
  iscredit: boolean = true;
  iscredit_1: boolean = true;
  confirmation: boolean = false;
  userid: any;
  accessip: any;
  constructor(
    public dialogRef: MatDialogRef<PaymentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService,
    private cdr: ChangeDetectorRef) {
    console.log(data);
    this.localPaymentChannelList = data;
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      console.log('Selected file:', file);

      // You can now perform operations with the selected file, like uploading it to a server
    }
  }
  confirm() {

    this.disPaymentList = true;
    // this.cdr.detectChanges();
    this.userService.getLocalChannelPayConfirmation(this.role, this.username, this.localPaymentChannelList?.serviceid, this.pay, !this.iscredit)
      .subscribe((res: any) => {
        this.confirmationPaymentList = res;
        // this.swal.success_1(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  submit() {
    this.swal.Loading();
    this.userService.payLocalChannel(this.role, this.username, this.localPaymentChannelList?.serviceid, this.pay, !this.iscredit, this.confirmationPaymentList?.days, this.confirmationPaymentList?.newexpirydate)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.payLocalChannel.expirydate);
      });
    const data = ` Creadit: ${!this.iscredit}, ` + ` pay: ${this.pay},`;
    const remark = ` Creadit: ${this.iscredit}, ` + ` pay: ${this.pay_1},`;
    this.logCreate('Payment Update Button Clicked', remark, data);
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
}
