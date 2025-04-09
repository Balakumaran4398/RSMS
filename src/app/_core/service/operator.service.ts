import { Injectable, OnInit } from '@angular/core';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorService implements OnInit {
  role: any;
  username: any;
  lcoDeatails: any;
  operatorId: any;
  retailerId: any;
  operatorname: any;
  operatorBalance: any;
  sublcoName: any;
  subLcoBalance: any;
  constructor(private userService: BaseService, private storageService: StorageService) {
    this.role = storageService.getUserRole();
    console.log(this.role);
    
    this.username = storageService.getUsername();
    // this.operatorIdoperatorId();
    if (this.role == 'ROLE_OPERATOR') {
      console.log(this.role);
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBLCO') {
      console.log(this.role);
      this.SubLCOIdoperatorId();
    }
  }
  ngOnInit(): void {
    if (this.role == 'ROLE_OPERATOR') {
      console.log(this.role);
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBLCO') {
      console.log(this.role);
      this.SubLCOIdoperatorId();
    }

  }
  operatorIdoperatorId() {
    console.log('111-------ROLE_OPERATOR');
    console.log(this.role);
    console.log(this.username);

    this.userService.getOpDetails(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.operatorId);
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.operatorBalance = this.lcoDeatails?.balance;
    })
  }
  SubLCOIdoperatorId() {
    console.log('222222222-------ROLE_SUBLCO');
    console.log(this.role);
    console.log(this.username);

    this.userService.getSublcoDetails(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.lcoDeatails = data;
      this.retailerId = this.lcoDeatails?.operatorid;
      console.log(this.retailerId);
      this.sublcoName = this.lcoDeatails?.operatorname;
      this.subLcoBalance = this.lcoDeatails?.balance;
    })
  }
}
