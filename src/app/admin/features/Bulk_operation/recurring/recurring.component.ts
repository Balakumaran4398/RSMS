import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss']
})
export class RecurringComponent {
  username: any;
  role: any;
  cas: any;
  smartcard:any;
  CasFormControl:any;
  type: any = [
    { label: "Select filter Type", value: 0 },
    { lable: "LCO", value: 1 },
    { lable: "SMARTCARD/BoxID", value: 2 },
    { lable: "Datewise", value: 3 },
  ];
  constructor(public dialog: MatDialog, private fb: FormBuilder,private userservice:BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    
  }
}
