import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lco-smartcard-dialog',
  templateUrl: './lco-smartcard-dialog.component.html',
  styleUrls: ['./lco-smartcard-dialog.component.scss']
})
export class LcoSmartcardDialogComponent implements OnInit {
  role: any;
  username: any;
  lcoPaymentList: any;

  pay: string = '0.0';
  iscredit: boolean = true;
  confirmation: boolean = false;
  op_id: any;
  smartcard: any;
  status: any;
  retailerid: any;
  useragent: any;
  operatorId: any;
  type: any;
  packageid: any;
  fromdate: any;
  todate: any;
  constructor(
    public dialogRef: MatDialogRef<LcoSmartcardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService,
    private cdr: ChangeDetectorRef) {
    console.log(data);
    this.lcoPaymentList = data.data;
    this.op_id = data.lcoid;
    this.useragent = data.userarant;
    this.smartcard = this.lcoPaymentList?.smartcard;
    this.status = this.lcoPaymentList?.status;
    this.retailerid = this.lcoPaymentList?.useragentid;
    this.packageid = this.lcoPaymentList?.id;
    this.fromdate = this.lcoPaymentList?.id;
    this.todate = this.lcoPaymentList?.id;
    this.type = data?.type;
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    if (this.type == 'smartcardDetails') {

    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getBillCollectionReport(type: any) {
    this.userService.getBillCollectionSmartcardReport(this.role, this.username, this.operatorId, this.smartcard, this.fromdate, this.todate, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Subscriber_Recharge_Details(" + this.smartcard + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Subscriber_Recharge_Details(" + this.smartcard + ").xlsx", 'application/xlsx');
        }
        this.swal.Close()
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

  submit() {
    this.swal.Loading();
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getupdatePaybillUpdate(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, this.useragent, this.retailerid, 1)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getupdatePaybillUpdate(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, this.useragent, this.retailerid, 2)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }




  // -----------------------------------------------------common method for pdf and excel------------------------------------------------------------------------


  reportMaking(x: Blob, reportname: any, reporttype: any) {
    const blob = new Blob([x], { type: reporttype });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = data;
    link.download = reportname.toUpperCase();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
    Swal.close();
  }
  pdfswalError(error: any) {
    console.log(error);

    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error?.message || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok',
      timer: 2000,
      timerProgressBar: true,
    });
  }
  processingSwal() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }
}
