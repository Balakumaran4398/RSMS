import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService } from 'src/app/_core/service/auth.service';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var EasebuzzCheckout: any;
@Component({
  selector: 'app-paymentcustomer',
  templateUrl: './paymentcustomer.component.html',
  styleUrls: ['./paymentcustomer.component.scss']
})
export class PaymentcustomerComponent implements OnInit {
  role: any;
  username: any;
  newSmartcard: any;
  selectedRechargetype: any = 0;
  noofdays: any;
  lcodatetype: any;
  rechargetype: any;
  f_date: any;
  packagePlan: any;
  plantype: any = 0;
  isDisabled: boolean = true;
  isRecharge = false;
  dateTodate = false;
  isplantype = false;
  datetype = false;
  isSubmit = false;
  plan = false;
  date = false;
  isplan = false;
  isdate = false;
  isdateTodate = false;
  plantype$ = new BehaviorSubject<{ key: string, value: number }[]>([]);
  amount: any;
  operatorid: any;
  transResponse: any;
  easebuzzData: any;
  balanceclass!: String;
  walletbalance = 0;
  retailerId: any;
  Sub_subid: any;
  Sub_amount: any;
  sublcoetailerId: any;

  mode: any;
  access_key: any;
  apikey: any;
  gatewaymode: any;
  cus_name: any;
  mob_num: any;
  lco_name: any;
  smartcard: any;
  box_id: any;
  plan_name: any;
  expiry: any;
  lco_id: any;
  addon_pack: any;
  alacarte_pack: any;
  id: any;
  signInform!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private authService: AuthService, private userService: BaseService, private storageService: StorageService, private cdr: ChangeDetectorRef, private swal: SwalService,) {
    // this.role = storageService.getUserRole();
    // this.username = storageService.getUsername();
    this.route.paramMap.subscribe(params => {
      const fullParam = params.get('id') || '';
      const parts = fullParam.split('**');
      if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
        this.router.navigate(['/payment_customer']);
        return;
      }
      this.newSmartcard = parts[0] || '';
      this.username = parts[1] || '';
      this.role = parts[2] || '';
      this.getDetails();
      this.getPlanList();
      this.getplan();
    });
    this.signInform = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.f_date = this.lcodatetype;
  }
  ngOnInit(): void {
    console.log('1231231231');

    let requestBody = {
      username: this.username,
      password: this.username
    }
    this.authService.login(requestBody).subscribe(
      (res: any) => {
        console.log(res);
        this.storageService.saveToken(res.accessToken);
      }
    );
    console.log('above code is correct?');

  }

  getPlanList() {
    this.userService.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rechargetype = Object.keys(data).map(key => {
        const id = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, id: id };
      });

      this.cdr.detectChanges();
      console.log(this.rechargetype);
    });
  }
  getplan() {
    this.userService.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.packagePlan = data;
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))

      this.plantype$.next(sortedData);
      if (this.selectedRechargetype === 1) {
        const defaultPlan = sortedData.find(plan => plan.key === '1month');
        if (defaultPlan) {
          this.plantype = defaultPlan.value;
          console.log(this.plantype);
        }
      }
    });
  }
  getNextDay(dateString: any): string | null {
    console.log(dateString);
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
  getNextDay1(): string | null {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
  onSelectionrechargetype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    if (rechargetype == 1) {
      this.isSubmit = true;
      this.isplantype = true;
      this.datetype = false;
      const defaultPlan = this.plantype$.getValue().find(plan => plan.key === '1month');
      if (defaultPlan) {
        this.plantype = defaultPlan.value;
      }
      this.isDisabled = false;
    }
    if (rechargetype == 2) {
      this.isSubmit = true;
      this.isplantype = false;
      this.datetype = true;
      this.plantype = 0;
      this.isDisabled = true;
    }
    if (rechargetype == 3) {
      this.isSubmit = true;
      this.dateTodate;
      this.isplantype = false;
      this.datetype = false;
      this.plantype = 0;
      this.f_date = null;
      this.isDisabled = false;
    }
    this.isRecharge = true;

  }
  onSelectiondatetype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    console.log('selectrdvalue', selectedValue);

    if (rechargetype == 1) {
      this.isplantype = true;
      this.datetype = false;
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
    }
    if (rechargetype == 3) {
      this.datetype = false;
      this.isplantype = false;
    }

    if ((this.selectedRechargetype == '3') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
  }
  getpay() {
    // this.makeEaseBuzzPayment();
    this.userService.getuserOnlineInitialRequest(this.role, this.username, this.newSmartcard, this.plantype, this.username).subscribe((res: any) => {
      this.transResponse = res;
      console.log(res);
      this.easebuzzData = this.transResponse.data;
      console.log('STATUS', res.status);
      if (res.status == '1') {
        if (this.gatewaymode == 'LIVE') {
          console.log('gatewaymode', this.gatewaymode);
          this.mode = 'prod';
          console.log('prod', this.mode);
        } else {
          this.mode = 'test';
          console.log('test', this.mode);
          var easebuzzCheckout = new EasebuzzCheckout(this.apikey, this.mode);
          var options = {
            access_key: this.easebuzzData,
            onResponse: (response: any) => {
              console.log('wsedasdsad', response);
              if (response.status) {
                this.swal.Loading();
                this.userService.getUserOnlineFailurelRecharge(this.role, this.username, this.newSmartcard, response.amount, response.txnid, response.status, this.username)
                  .subscribe((res: any) => {
                    this.swal.success(res?.message);
                  }, (err) => {
                    this.swal.Error(err?.error?.message);
                  });
              } else {
              }
            },
            theme: '#123456',
          };
          easebuzzCheckout.initiatePayment(options);
        }
      } else {
        alert(res.data);
      }
    })

  }
  makeEaseBuzzPayment() {
    if (this.role == 'ROLE_SUBLCO') {
      this.userService.getSublcoOnlineInitialRequest(this.role, this.username, this.amount || 0, this.retailerId || this.sublcoetailerId).subscribe((res: any) => {
        this.transResponse = res;
        console.log(res);
        this.easebuzzData = this.transResponse.data;
        console.log('STATUS', res.status);
        if (res.status == '1') {
          if (this.gatewaymode == 'LIVE') {
            console.log('gatewaymode', this.gatewaymode);
            this.mode = 'prod';
            console.log('prod', this.mode);
          } else {
            this.mode = 'test';
            console.log('test', this.mode);
          }

          var easebuzzCheckout = new EasebuzzCheckout(this.apikey, this.mode,);
          var options = {
            access_key: this.easebuzzData,
            onResponse: (response: any) => {
              console.log('wsedasdsad', response);
              if (response.status) {
                this.swal.Loading();
                this.userService
                  .getSublcoOnlineFailurelRecharge(this.role, this.username, response.amount, this.retailerId || this.sublcoetailerId, response.txnid, response.status, response.hash)
                  .subscribe((res: any) => {
                    this.swal.success(res?.message);
                  }, (err) => {
                    this.swal.Error(err?.error?.message);
                  });
              } else {
              }
            },
            theme: '#123456',
          };
          easebuzzCheckout.initiatePayment(options);
        } else {
          alert(res.data);
        }
        // });
      }, (err) => {
        console.log(err)
        this.swal.Error(err?.error?.message);
      });
    } else if (this.role == 'ROLE_ADMIN') {
      this.userService.lcoOnlineInitialRequest(this.role, this.username, this.amount || 0, this.operatorid).subscribe((res: any) => {
        this.transResponse = res;
        console.log(res);
        this.easebuzzData = this.transResponse.data;
        // this.swal.success(res?.message);
        console.log('STATUS', res.status);
        if (res.status == '1') {
          if (this.gatewaymode == 'LIVE') {
            console.log('gatewaymode', this.gatewaymode);
            this.mode = 'prod';
            console.log('prod', this.mode);
          } else {
            this.mode = 'test';
            console.log('test', this.mode);
          }

          var easebuzzCheckout = new EasebuzzCheckout(
            this.apikey,
            this.mode,);
          var options = {
            access_key: this.easebuzzData,
            onResponse: (response: any) => {
              console.log('wsedasdsad', response);
              if (response.status) {
                this.swal.Loading();
                this.userService
                  .lcoOnlineFailurelRecharge(this.role, this.username, response.amount, this.operatorid, response.txnid, response.status, response.hash)
                  .subscribe((res: any) => {
                    this.swal.success(res?.message);
                  }, (err) => {
                    this.swal.Error(err?.error?.message);
                  });
              } else {
              }
            },
            theme: '#123456',
          };
          easebuzzCheckout.initiatePayment(options);
        } else {
          alert(res.data);
        }
        // });
      }, (err) => {
        console.log(err)
        this.swal.Error(err?.error?.message);
      });
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      console.log(this.role);
      console.log('subid', this.Sub_subid);
      console.log('Sub_amount', this.Sub_amount);
      // this.Sub_amount
      if (!this.amount) {

      }
      this.userService.getsubscriberOnlineInitialRequest(this.role, this.username, this.amount || 0, this.Sub_subid).subscribe((res: any) => {
        this.transResponse = res;
        console.log(res);
        this.easebuzzData = this.transResponse.data;
        console.log('dfsdfdsfdsfdsfdsfsdfds ========= ', this.easebuzzData)
        console.log('status ========= ', res.status)
        console.log('STATUS', res.status);
        if (res.status == '1') {
          if (this.gatewaymode == 'LIVE') {
            console.log('gatewaymode', this.gatewaymode);
            this.mode = 'prod';
            console.log('prod', this.mode);
          } else {
            this.mode = 'test';
            console.log('test', this.mode);
          }

          var easebuzzCheckout = new EasebuzzCheckout(
            this.apikey,
            this.mode,);
          var options = {
            access_key: this.easebuzzData,
            onResponse: (response: any) => {
              console.log('wsedasdsad', response);
              if (response.status) {
                this.swal.Loading();
                this.userService
                  .getsubscriberOnlineFailurelRecharge(this.role, this.username, response.amount, this.retailerId || this.Sub_subid, response.txnid, response.status, response.hash)
                  .subscribe((res: any) => {
                    this.swal.success(res?.message);
                  }, (err) => {
                    this.swal.Error(err?.error?.message);
                  });
              } else {
              }
            },
            theme: '#123456',
          };
          easebuzzCheckout.initiatePayment(options);
        } else {
          alert(res.data);
        }
        // });
      }, (err) => {
        console.log(err)
        this.swal.Error(err?.error?.message);
      });
    }
  }
  getDetails() {
    this.userService.getQuickOperationDetailsBySmartcard(this.role, this.username, this.newSmartcard).subscribe((data: any) => {
      console.log(data);
      this.cus_name = data.subscriberdetails.customername;
      this.mob_num = data.subscriberdetails.mobileno;
      this.lco_name = data.subscriberdetails.operatorname;
      this.lco_id = data.subscriberdetails.operatorid;
      this.smartcard = data.subscriberdetails.smartcard;
      this.box_id = data.subscriberdetails.boxid;
      this.plan_name = data.subscriberdetails.smartpackagename;
      this.expiry = data.subscriberdetails.expirydate;
      this.addon_pack = data.subscriberdetails.acount;
      this.alacarte_pack = data.subscriberdetails.achannels;
    },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}