import { AfterViewInit, Component, DestroyRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-operator-wallet',
  templateUrl: './operator-wallet.component.html',
  styleUrls: ['./operator-wallet.component.scss']
})
export class OperatorWalletComponent implements OnInit, AfterViewInit, OnDestroy {

  role: any;
  username: any;
  operatorname: any;
  amount: any;
  remarks: any;
  filteredOperators: any[] = [];
  lco_list: any[] = [];

  parantOperatorId: any;

  constructor(public dialogRef: MatDialogRef<OperatorWalletComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log(data);
    this.parantOperatorId = data.id;
    console.log(this.parantOperatorId);

  }
  ngAfterViewInit(): void {
    $('#lco').select2({
      placeholder: 'Select a Operator',
      allowClear: true
    });
    $('#lco').on('change', (event: any) => {
      this.operatorname = event.target.value;
      console.log(this.operatorname);

      this.onSubscriberStatusChange(event);
    });
  }
  ngOnDestroy(): void {
    ($('#LCO') as any).select2('destroy');
  }


  ngOnInit(): void {
    this.onOperatorList();
  }
  onSubscriberStatusChange(operator: any): void {
    console.log('OPERATOR', operator);

    // this.servicename = '';
    this.operatorname = operator.name;

  }

  submit() {

  }

  onOperatorList() {
    this.userService.getOeratorList(this.role, this.username, this.parantOperatorId).subscribe((data: any) => {
      this.lco_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      // this.filteredOperators = this.lco_list;
      // this.cdr.detectChanges;
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
