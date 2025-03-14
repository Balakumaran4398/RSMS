import { Component, OnInit } from '@angular/core';
import { LogarithmicScale } from 'chart.js';
import { BaseService } from 'src/app/_core/service/base.service';
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


  isShow: boolean = false;

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }

  ngOnInit(): void {
    this.operatorIdoperatorId();
  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.operatorid = this.lcoDeatails?.operatorid;
      console.log(this.operatorid);

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
    this.userService.getChangeLcoPassword(this.role, this.username, this.oldpassword, this.newpassword, this.confirmpassword, this.operatorid)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}
