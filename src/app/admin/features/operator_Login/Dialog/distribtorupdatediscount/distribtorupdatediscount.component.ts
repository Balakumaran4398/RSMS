import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distribtorupdatediscount',
  templateUrl: './distribtorupdatediscount.component.html',
  styleUrls: ['./distribtorupdatediscount.component.scss']
})
export class DistribtorupdatediscountComponent implements OnInit {
  role: any;
  username: any;
  type: any;
  data_details: any;
  newmsoamount: any;
  lcoDeatails: any;
  operatorid: any;
  lcolistid: any;
  productid: any;
  msoamount: any;
  oldmsoamount: any;

  editLcoName: any;
  editLcomobilenumber: any;
  editLcousername: any;
  editLcopassword: any;


  pincode: any;
  state: any;
  area: any;
  mail: any;
  nameheader: any;
  address: any;
  paymentid: any;
  lcobusinessid: any;


  form!: FormGroup;

  lcoDetails: any;
  operatorDetailsCount: any;
  walletshare: any;
  lcoOperatorId: any;
  lcoParentOperatorId: any;
  lcoUserName: any;
  constructor(public dialogRef: MatDialogRef<DistribtorupdatediscountComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog, private userService: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.type = data.type;
    console.log(data);
    this.data_details = data?.data;
    this.lcoDetails = data?.data;
    console.log(this.type);
    console.log(this.data_details);
    this.msoamount = this.data_details.msoamount;
    this.oldmsoamount = this.data_details.msoamount;
    this.productid = this.data_details.productid;
    this.lcolistid = this.data_details.lcmid;
    this.lcoOperatorId = this.data_details.operatorid;
    this.lcoParentOperatorId = data?.opId;
    this.lcoUserName = this.data_details?.userid;
    console.log(this.lcoOperatorId);
    console.log('lcoParentOperatorId', this.lcoParentOperatorId);


    this.editLcoName = this.data_details.operatorname;
    this.editLcomobilenumber = this.data_details.contactnumber1;
    this.editLcousername = this.data_details.userid;
    this.editLcopassword = this.data_details.password;



    console.log({
      pincode: this.pincode,
      state: this.state,
      area: this.area,
      mail: this.mail,
      nameheader: this.nameheader,
      lcobusinessid: this.lcobusinessid,
      paymentid: this.paymentid,
      address: this.address
    });



  }
  ngOnInit(): void {
    this.operatorIdoperatorId();
    // if (this.type = "lco_dashboard") {
    //   this.operatorDetails();
    // }


  }

  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;
      this.operataDetailsCount(this.lcoOperatorId)
      this.operatorDetails();
      this.lcoDeatails();
    })
  }

  operatorDetails() {
    this.userService.getOperatorLoginDashboardCount(this.role, this.lcoUserName).subscribe((data: any) => {
      console.log(data);
      this.operatorDetailsCount = data;
    })
  }


  getOperator() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;


    })
  }

  operataDetailsCount(operator: any) {
    this.userService.OperatorDetails(this.role, this.username, this.lcoParentOperatorId || this.lcoOperatorId).subscribe(
      (data: any) => {
        this.lcoDeatails = data[0];
        this.walletshare = this.lcoDeatails.walletshare;
        console.log(this.lcoDeatails);

        // this.editLcoName = this.lcoDeatails.operatorname;
        // this.editLcomobilenumber = this.lcoDeatails.contactnumber1;
        // this.editLcousername = this.lcoDeatails.userid;
        // this.editLcopassword = this.lcoDeatails.password;

        this.pincode = this.lcoDeatails.pincode;
        this.state = this.lcoDeatails.state;
        this.area = this.lcoDeatails?.area;
        this.mail = this.lcoDeatails?.mail;
        this.nameheader = this.lcoDeatails.nameheader;
        this.lcobusinessid = this.lcoDeatails.lcobusinessid;
        this.paymentid = this.lcoDeatails.paymentid;
        this.address = this.lcoDeatails.address;
      },
    );
  }


  errorMessage: any;
  validateAmount(): boolean {
    const msoAmount = this.data_details?.msoamount || 0;
    const customerAmount = this.data_details?.customeramount || 0;

    if (!this.newmsoamount || this.newmsoamount.toString().trim() === '') {
      this.errorMessage = 'Please enter the LCO Amount.';
      return false;
    }
    if (this.newmsoamount < msoAmount) {
      this.errorMessage = `Amount must be at least Rs.${msoAmount}.`;
      return false;
    }
    if (this.newmsoamount > customerAmount) {
      this.errorMessage = `Amount must not exceed Rs.${customerAmount}.`;
      return false;
    }

    this.errorMessage = '';
    return true;
  }
  clearErrorMessage() {
    if (this.newmsoamount && this.newmsoamount.toString().trim() !== '') {
      this.errorMessage = '';
    }
  }
  getPackageDistributorDiscount() {
    if (!this.validateAmount()) {
      return;
    }
    this.swal.Loading();
    this.userService.getupdatedistributorDiscount(this.role, this.username, this.operatorid, this.operatorid, this.productid, this.msoamount || 0, this.oldmsoamount || 0,
      this.newmsoamount).subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.updateLcoDiscount.newmsoamount || err?.error);
      });
  }

  onSubmit() {
    let requestbody = {
      operatorid: this.lcoOperatorId,
      operatorname: this.editLcoName,
      address: this.address || null,
      area: this.area || null,
      state: this.state || null,
      pincode: this.pincode || null,
      contactnumber1: this.editLcomobilenumber,
      mail: this.mail,
      nameheader: this.nameheader,
      lcobusinessid: this.lcobusinessid,
      userid: this.editLcousername,
      password: this.editLcopassword,
      paymentid: this.paymentid,
      role: this.role,
      username: this.username
    };
    console.log(requestbody);

    this.swal.Loading();
    this.userService.EditOperator(requestbody).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res?.message || 'Operator edited successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message || error?.error?.lcobusinessid || error?.error?.paymentid || error?.error?.userid || error?.error?.pincode ||
            error?.error?.state || error?.error?.operatorname || error?.error?.password || error?.error?.mail || error?.error?.contactnumber1 ||
            error?.error?.area || error?.error?.address ||
            'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  getUpdateLCO() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
