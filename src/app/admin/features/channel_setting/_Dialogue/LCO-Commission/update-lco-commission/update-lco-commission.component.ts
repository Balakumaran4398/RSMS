import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { TimestampVerificationData } from 'node_modules1/@sigstore/bundle/dist';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-lco-commission',
  templateUrl: './update-lco-commission.component.html',
  styleUrls: ['./update-lco-commission.component.scss']
})
export class UpdateLcoCommissionComponent implements OnInit {
  role: any;
  username: any;
  productname: any;
  producttype: any;
  productrate: any;
  commissionvalue: any;
  commissionvalue_1: any;
  id: any;

  type: any;
  isYesActive: boolean = false;
  isPercentage: boolean = false;
  isPercentage_1: boolean = false;

  disProductname: any;
  disProducttype: any;
  disProductrate: any;
  disCommissionvalue: any;
  msoamount: any;
  msoamount_1: any;
  data_value: any;
  userid: any;
  accessip: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateLcoCommissionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    console.log(data);
    this.data_value = data;
    this.type = data.type;
    console.log(this.type);
    this.productname = data?.data?.productname;
    this.producttype = data?.data?.productTypeDisplay;
    this.id = data?.data?.id;
    this.productrate = data?.data?.rate;
    this.commissionvalue = data?.data?.commissionvalue;
    this.commissionvalue_1 = data?.data?.commissionvalue;
    this.isPercentage = data?.data?.ispercentage;
    this.isPercentage_1 = data?.data?.ispercentage;
    this.disProductname = data?.data?.productname;
    this.disProducttype = data?.data?.productTypeDisplay;
    this.disProductrate = data?.data?.rate;
    this.disCommissionvalue = data?.data?.commissionvalue;
    this.msoamount = data?.data?.submsoamount;
    this.msoamount_1 = data?.data?.submsoamount;

  }
  ngOnInit(): void {
    this.cdr.detectChanges();
    // this.type = this.data_value.type;
    // console.log(this.type);
    // this.productname = this.data_value?.data?.productname;
    // this.producttype = this.data_value?.data?.productTypeDisplay;
    // this.id = this.data_value?.data?.id;
    // this.productrate = this.data_value?.data?.rate;
    // this.commissionvalue = this.data_value?.data?.commissionvalue;
    // this.isPercentage = this.data_value?.data?.ispercentage;
    // this.disProductname = this.data_value?.data?.productname;
    // this.disProducttype = this.data_value?.data?.productTypeDisplay;
    // this.disCommissionvalue = this.data_value?.data?.commissionvalue;
    // this.msoamount = this.data_value?.data?.msoamount;

  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  updateCommission() {
    Swal.fire({
      title: 'Updating Commission...',
      html: 'Please wait while the commission is being updated.',
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.updateLcoCommission(this.role, this.username, this.id, this.isYesActive, this.isPercentage, this.commissionvalue, this.productrate)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
    const data = ` Productname: ${this.productname}, ` + ` Producttype: ${this.producttype},` + `Commissionvalue: ${this.commissionvalue},` + ` percentage: ${this.isPercentage},`;
    const remark = ` Productname: ${this.productname}, ` + ` Producttype: ${this.producttype},` + `Commissionvalue: ${this.commissionvalue_1},` + ` percentage: ${this.isPercentage_1},`;
    this.logCreate('LCO Commission Edit Button Clicked', data, remark);
  }

  updateDisCommission() {
    Swal.fire({
      title: 'Updating Distributor Commission...',
      html: 'Please wait while the commission is being updated.',
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.updateDistributorCommission(this.role, this.username, this.id, this.msoamount)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
    const remark = ` Productname: ${this.productname}, ` + ` Producttype: ${this.producttype},` + ` MSO Amount: ${this.msoamount},`;
    const  data= ` Productname: ${this.productname}, ` + ` Producttype: ${this.producttype},` + ` MSO Amount: ${this.msoamount_1},`;
    this.logCreate('Distributor Commission Edit Button Clicked', data, remark);
  }

  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}

