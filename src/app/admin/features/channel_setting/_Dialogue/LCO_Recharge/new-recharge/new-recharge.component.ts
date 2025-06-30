import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-recharge',
  templateUrl: './new-recharge.component.html',
  styleUrls: ['./new-recharge.component.scss']
})
export class NewRechargeComponent implements OnInit {
  form!: FormGroup;
  edit_dialog: boolean = false;
  username: any;
  id: any;
  role: any;
  type: number = 1;
  operatorList: any[] = [];

  isshow: boolean = false;

  payment: any[] = [
    { lable: "Cheque", value: 0 },
    { lable: "Cash", value: 1 },
    { lable: "Account Transfer", value: 2 },
  ];
  payment1: any[] = [
    { lable: "Share Amount", value: 0 },
    { lable: "Demo Recharge", value: 2 },
    { lable: "Wallet Credit", value: 4 },
  ];
  filteredOperators1: any[] = [
    { name: "AJKADMIN(862)", value: 862 },
    { name: "AJKTV(1)", value: 1 }
  ];

  filteredOperators: any[] = [];
  selectedOperator: any;
  operatorid: any;
  paymentType: any;

  constructor(public dialogRef: MatDialogRef<NewRechargeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.paymentType = data;
    console.log(this.paymentType);

    this.userService.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      // this.filteredOperators = this.operatorList;
      this.updateFilteredOperators();
    })
  }
  onPaymentTypeChange(event: any) {
    this.type = +event.target.value;
    this.updateFilteredOperators();
  }

  updateFilteredOperators() {
    
    if (this.type === 4) {
      this.filteredOperators = this.filteredOperators1;
    } else {
      this.filteredOperators = this.operatorList;
    }
    // this.filteredOperators=[];
  }
  toggleedit() {
    this.dialogRef.close();
  }
  onoperatorchange(operator: any): void {
    console.log(operator);
    this.selectedOperator = operator;
    this.operatorid = operator.value;
    if (operator.value === 0) {
      this.operatorid = 0;
      this.selectedOperator = { name: 'ALL Operator', value: 0 };
    } else {
      this.operatorid = operator.value;
      console.log('operatorid', this.operatorid);
    }
    this.form.patchValue({
      operatorid: this.operatorid,
    });
    this.userService.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.error('Error fetching operator details', error);
      }
    );
  }
  ngOnInit() {
    this.form = this.fb.group({
      paymenttypeid: ['', [Validators.required,]],
      operatorid: ['', [Validators.required, Validators.minLength(6)]],
      amount: ['', Validators.required],
      remarks: ['', Validators.required],
      role: this.role,
      username: this.username
    });
    this.onMsolist();

  }

  onMsolist() {
    this.userService.getMsoDetails(this.role, this.username).subscribe((res: any) => {
      console.log(res);
      this.isshow = res.msoName.includes("AJK");
      console.log(this.isshow);

      if (this.isshow) {
        this.payment = this.payment.filter(item => item.value !== 1);
      }
    });
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
  }

  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
    this.swal.Loading();
    this.userService.Newrecharge(this.form.value).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Success!',
          text: res.message || 'Recharge has been added successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            window.location.reload();
            // this.ngOnInit();
          }
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.message || error?.error?.operatorid || error?.error.amount || error?.error.operatorid || error?.error.remarks || error?.error.lcobusinessid || 'There was an issue adding the Recharge.',
          icon: 'error'
        });
      }
    );
    // } else {
    //   this.form.markAllAsTouched();
    // }
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onKeydown1(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace' && key !== '-') {
      event.preventDefault();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
