import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss']
})
export class RecurringComponent implements OnInit {
  username: any;
  role: any;
  cas: any;
  smartcard: any;
  CasFormControl: any;
  operatorid: any;
  searchname: any = 0;
  operatorList: any[] = [];
  reccuringData: any;
  isrecurring = false;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();

  }
  ngOnInit(): void {
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }
  submit(type: any) {
    type = type;
    this.userservice.getRecurringListByOperatorIdSearchnameAndIsrecurring(this.role, this.username, this.operatorid, this.searchname, type).subscribe((data: any) => {
      console.log(data);
      this.reccuringData = data;
      this.isrecurring = data.isrecurring;
    })
  }

}
