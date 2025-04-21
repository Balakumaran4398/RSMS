import { AfterViewInit, Component, DestroyRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

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

  constructor(public dialogRef: MatDialogRef<OperatorWalletComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userService: BaseService, private storageService: StorageService,) {
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

      this.onSubscriberStatusChange(this.operatorname);
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
    this.operatorname = operator;
    console.log(this.operatorname);


  }
  errorMessage: any;
  remarksError: string = 'Remarks field cannot be empty.';
  clearRemarksError() {
    if (this.remarks && this.remarks.trim() !== '') {
      this.remarksError = '';
    }
  }
  submit(form: any) {
    if (form.invalid) {
      return;
    }
    this.swal.Loading();
    this.userService.getlcoOfflineWalletShare(this.role, this.username, this.parantOperatorId, this.operatorname, this.amount, this.remarks)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }
  onKeydown1(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace' && key !== '-') {
      event.preventDefault();
    }
  }
  onOperatorList() {
    this.userService.getAllLcoList(this.role, this.username, this.parantOperatorId).subscribe((data: any) => {
      // this.lco_list = Object.keys(data).map(key => {
      //   const value = data[key];
      //   const name = key;
      //   return { name: name, value: value };
      // });
      this.lco_list = data;
      // this.filteredOperators = this.lco_list;
      // this.cdr.detectChanges;
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
