import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-discountdialog',
  templateUrl: './discountdialog.component.html',
  styleUrls: ['./discountdialog.component.scss']
})
export class DiscountdialogComponent implements OnInit {
  role: any;
  username: any;
  type: any;
  data_details: any;
  lcoDeatails: any;
  operatorid: any;
  areaid: any;
  packageid: any;
  Lcopackage_id: any;
  oldmsoamount: any;
  ispercentage: boolean = false;
  with_Gst: boolean = false;
  commission: any;
  old_customeramount: any;
  new_customeramount: any;
  smartcard: any;
  smartcard1: any;
  discount_value: any;
  discount_type: any;

  customerAmount: any;

  orderid: any;
  plandiscount: any;

  lcocommission: any;
  customeramount: any;
  i: any;
  type1: any

  subLcoDetails: any;

  errorMessage: any;
  retailerid: any;
  package_name: any;
  msoAmount: any;
  lcoCommission: any;
  discount: any;
  constructor(public dialogRef: MatDialogRef<DiscountdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, public dialog: MatDialog, private userService: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.type = data.type;
    console.log(data);
    // this.type = data.type;
    console.log(this.type);
    this.package_name = data?.data.package_name;
    console.log(this.package_name);

    this.retailerid = data?.retailerid;
    console.log(this.retailerid);
    this.data_details = data.data;
    this.areaid = data.area;
    console.log(this.areaid);
    this.Lcopackage_id = this.data_details.package_id;
    this.ispercentage = this.data_details.ispercentage;
    this.commission = this.data_details.lco_commission;
    this.msoAmount = this.data_details.mso_amount;
    console.log(this.commission);
    // this.with_Gst = data?.data?.isgst;
    this.with_Gst = data?.data?.isgst == 1;

    // console.log('`11111111111111111111111`1',data?.data?.isgst);
    // console.log('fgsdhjkfhsdjkfhsjkdfhjksdfhjksdhf',this.with_Gst);

    this.old_customeramount = this.data_details.customer_amount;
    this.discount_value = this.data_details.discount_value;

    this.smartcard = this.data_details.smartcard;
    this.smartcard1 = this.data.smartcard;
    this.subLcoDetails = data?.data;

    console.log('lcocommission', this.lcoCommission);
    console.log('discount', this.discount);
    console.log(this.subLcoDetails);
    console.log(data);
    this.packageid = this.subLcoDetails.packid;
    this.oldmsoamount = this.subLcoDetails.msoamount;
    this.lcocommission = data?.data?.lco_commission;
    this.orderid = data?.data?.order_id;
    this.customeramount = data?.data?.customer_amount;

  }

  ngOnInit(): void {
    this.operatorIdoperatorId();
    // this.getplanwiseDetails();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getDiscount() {
    if (!this.validateAmount()) {
      return;
    }
    this.swal.Loading();
    this.userService.getupdateDiscountByArea(this.role, this.username, this.operatorid, this.areaid || 0, this.Lcopackage_id, this.ispercentage, this.commission,
      this.old_customeramount, this.new_customeramount, this.smartcard1 || null, this.discount_value, this.msoAmount).subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }

  validateAmount(): boolean {
    const msoAmount = this.subLcoDetails?.mso_amount || 0;
    const customerAmount = this.subLcoDetails?.customer_amount || 0;

    if (!this.new_customeramount || this.new_customeramount.toString().trim() === '') {
      this.errorMessage = 'Please enter the LCO Amount.';
      return false;
    }
    if (this.new_customeramount < msoAmount) {
      this.errorMessage = `Amount must be at least Rs.${msoAmount}.`;
      return false;
    }
    // if (this.new_customeramount > customerAmount) {
    //   this.errorMessage = `Amount must not exceed Rs.${customerAmount}.`;
    //   return false;
    // }
    if (this.with_Gst) {
      if (this.new_customeramount > customerAmount) {
        this.errorMessage = `With GST selected, the amount must not exceed Rs.${customerAmount}.`;
        return false;
      }
    } else {
      if (this.new_customeramount < msoAmount) {
        this.errorMessage = `Amount must be at least Rs.${msoAmount}.`;
        return false;
      }
      // if (this.new_customeramount > customerAmount) {
      //   this.errorMessage = `Amount must not exceed Rs.${customerAmount}.`;
      //   return false;
      // }
    }
    this.errorMessage = '';
    return true;
  }
  validatesublcoAmount() {

  }
  clearErrorMessage() {
    if (this.new_customeramount && this.new_customeramount.toString().trim() !== '') {
      this.errorMessage = '';
    }
  }

  clearErrorMessage1(plan: any) {
    if (plan?.customerAmount && plan?.lcoCommission?.toString().trim() !== '') {
      this.errorMessage = '';
    }
  }

  getSubLcoDiscount() {
    if (!this.validateAmount()) {
      return;
    }
    console.log(this.new_customeramount);

    this.swal.Loading();
    this.userService.getupdateSublcoDiscount(this.role, this.username, this.operatorid, this.retailerid, this.subLcoDetails?.pack_id, this.with_Gst, this.subLcoDetails?.mso_amount,
      // this.userService.getupdateSublcoDiscount(this.role, this.username, this.operatorid, this.operatorid, this.subLcoDetails?.pack_id, this.with_Gst, this.subLcoDetails?.mso_amount,
      this.subLcoDetails?.customer_amount, this.new_customeramount).subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }


  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;
      this.distributorid = this.lcoDeatails?.distributorid;
      this.getplanwiseDetails();
      this.getDistributorPackageList();
    })
  }
  dataDetails: any;
  discountPlans: any[] = [];
  getplanwiseDetails() {
    console.log(this.role)
    if (this.role != 'ROLE_OPERATOR') {
      this.userService.getPlanDiscountDetailsByOpidPackageid(this.role, this.username, this.operatorid || 0, this.orderid, this.customeramount, this.lcocommission, true, this.msoAmount).subscribe((data: any) => {
        this.discountPlans = data.map((item: any) => {
          const content = item.content[0];
          return {
            id: item.plan,
            name: content.plan,
            customerAmount: content.customer_amount,
            currentAmount: content.current_cus_amt,
            discount: content.dicount_amount,
            lcoCommission: content.lco_commission,
            msoamount: content.mso_amount,
          };
        });
      });
    } else if (this.role == 'ROLE_OPERATOR') {
      this.userService.getPlanDiscountDetailsByOpidPackageid(this.role, this.username, this.operatorid || 0, this.orderid, this.customeramount, this.lcocommission, false, this.msoAmount).subscribe((data: any) => {
        this.discountPlans = data.map((item: any) => {
          const content = item.content[0];
          return {
            id: item.plan,
            name: content.plan,
            customerAmount: content.customer_amount,
            currentAmount: content.current_cus_amt,
            discount: content.dicount_amount,
            lcoCommission: content.lco_commission,
            msoamount: content.mso_amount,
          };
        });
      });
    }
  }

  updatePlanDiscount(plan: any): boolean {
    console.log(plan);

    if (plan.discount > plan.currentAmount) {
      console.log('LCO');
      this.errorMessage = `Amount must be at least Rs.${plan.currentAmount}.`;
      return false;
    } else if (plan.discount > plan.mso_amount) {
      console.log('MSO');
      this.errorMessage = `Amount must be at least Rs.${plan.mso_amount}.`;
    }
    this.errorMessage = '';
    return true;
  }
  // updatePlanDiscount(plan: any): boolean {
  //   if (plan.discount > plan.lcoCommission) {
  //     console.log('LCO');
  //     this.errorMessage = `Amount must be at least Rs.${plan.lcoCommission}.`;
  //     return false;
  //   } else if (plan.discount > plan.mso_amount) {
  //     console.log('MSO');
  //     this.errorMessage = `Amount must be at least Rs.${plan.mso_amount}.`;
  //   }
  //   this.errorMessage = '';
  //   return true;
  // }
  getupdatePlanwiseDiscount() {
    for (let i = 0; i < this.discountPlans.length; i++) {
      const plan = this.discountPlans[i];

      console.log(plan);

      if (plan.msoamount > plan.currentAmount) {
        console.log('1111111111111111111111111111111111111111')
        this.errorMessage = `Amount must be at least Rs.${plan.msoamount}.`;
        console.log('1111111111111111111111111111111111111111', this.errorMessage)
      }


      if (plan.msoamount > plan.currentAmount) {
        this.errorMessage = `Amount must be at least Rs.${plan.msoamount} for Plan ID: ${plan.id}.`;
        this.swal.Error(this.errorMessage); // show SweetAlert error popup
        return; 
      }
      // if (plan.discount > plan.lcoCommission) {
      //   this.errorMessage = `Amount must be at least Rs.${plan.lcoCommission}.`;
      //   this.swal.Error(this.errorMessage);
      //   return;
      // }
    }
    this.plandiscount = this.discountPlans.map((plan: any) =>
      // `${plan.id}-${plan.discount}`
      `${plan.id}:${plan.currentAmount}:${plan.msoamount}:${plan.customerAmount}`
    );

    console.log(this.plandiscount);

    if (this.role == 'ROLE_OPERATOR') {
      this.swal.Loading();
      this.userService.updatePlanwiseDiscount(this.role, this.username, this.operatorid || 0, this.orderid, this.plandiscount, 1, false)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message || err?.error);
        });
    } else if (this.role != 'ROLE_OPERATOR') {
      this.swal.Loading();
      this.userService.updatePlanwiseDiscount(this.role, this.username, 0, this.orderid, this.plandiscount, 2, true)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message || err?.error);
        });
    }
  }
  distributorid: any;
  getDistributorPackageList() {
    this.userService.getDistributorPackageList(this.role, this.username, this.operatorid, this.distributorid).subscribe((data: any) => {
      console.log(data);
    })
  }

  // onKeydown(event: KeyboardEvent) {
  //   const key = event.key;
  //   if (!/^\d$/.test(key) && key !== 'Backspace') {
  //     event.preventDefault();
  //   }
  // }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (!/^\d$/.test(key) && key !== 'Backspace' && key !== '-') {
      event.preventDefault();
    }
    if (key === '-' && (inputElement.value.includes('-') || inputElement.selectionStart !== 0)) {
      event.preventDefault();
    }
  }
}
