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
  operatorname: any;
  operatorBalance: any;
  constructor(private userService: BaseService, private storageService: StorageService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.operatorIdoperatorId();
  }
  ngOnInit(): void {
    this.operatorIdoperatorId();
    // console.log(this.operatorId);

  }
  operatorIdoperatorId() {
    console.log('111');
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
}
