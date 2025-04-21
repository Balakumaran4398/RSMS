import { Component, OnInit } from '@angular/core';
import { LogarithmicScale } from 'chart.js';
import { BaseService } from 'src/app/_core/service/base.service';
import { OperatorService } from 'src/app/_core/service/operator.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-lco-change-password',
  templateUrl: './lco-change-password.component.html',
  styleUrls: ['./lco-change-password.component.scss']
})
export class LcoChangePasswordComponent implements OnInit {
  role: any;
  username: any;
  lcoDeatails: any;
  operatorid: any;

  oldpassword: any;
  newpassword: any;
  confirmpassword: any;

  newPass: any;
  subLcoDetails: any;
  retailerId: any;
  retailerName: any;
  mobilenumber: any;
  address: any;
  balance: any;

  isShow: boolean = false;

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  sub_subid: any;
  constructor(private userService: BaseService, private storageService: StorageService, private swal: SwalService, private operator: OperatorService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.subLcoDetails = operator?.lcoDeatails;
    this.retailerId = this.subLcoDetails?.retailerid;
    this.retailerName = this.subLcoDetails?.retailername;
    this.mobilenumber = this.subLcoDetails?.contactnumber;
    this.address = this.subLcoDetails?.address;
    this.balance = this.subLcoDetails?.balance;

  }

  ngOnInit(): void {
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      this.getSubscriberSubId();
    }
  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;

    })
  }
  getSubscriberSubId() {
    this.userService.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      this.sub_subid = this.lcoDeatails.subid;
    })
  }
  togglePassword(field: string) {
    console.log(field);

    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  Submit() {
    this.swal.Loading();
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getChangeLcoPassword(this.role, this.username, this.oldpassword, this.newpassword, this.confirmpassword, this.operatorid)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getChangeSubLcoPassword(this.role, this.username, this.oldpassword, this.newpassword, this.confirmpassword, this.retailerId)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      this.userService.getchangeSubscriberPassword(this.role, this.username, this.oldpassword, this.newpassword, this.confirmpassword, this.sub_subid)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
}
