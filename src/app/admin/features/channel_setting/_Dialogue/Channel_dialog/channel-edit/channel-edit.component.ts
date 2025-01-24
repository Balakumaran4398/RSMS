import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-channel-edit',
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.scss']
})
export class ChannelEditComponent {

  role: any;
  username: any;
  toggleState = false;
  isupload: boolean = false;
  isaddnew: boolean = false;
  broadcastername: any;
  oldBroadcastername: any;
  distributorid: any;
  tsId: any;
  productid: any;
  serviceid: any;
  customerAmount: any;
  status: string = 'Active';
  commission: any;
  ispercentage: boolean = true;
  categoryname: any;
  oldcategoryname: any;
  oldChannelType: any;
  inrAmt: any;
  channelid: any
  channellogo: any;
  channelfreq: any;
  channeldesc: any;
  broadcasterRate: any;
  channel_typename: any;
  channelname: any;
  channelId: any;
  channel_rate: any;
  broadcaster_id: any;
  category_id: any;
  channel_type_id: any;
  isPercentage: boolean;
  isactive = '1';
  ispaid: boolean;
  categoryid: any;
  type: number = 1;
  isYesActive: boolean | null = null;
  category: any;
  channelType: any;
  nameFormControl: any; discriptionFormControl: any;
  streamidFormControl: any;
  addchannelGroup: any;
  selectbroadcaster: any;

  issave: boolean = false;
  constructor(private cdr: ChangeDetectorRef, public dialogRef: MatDialogRef<ChannelEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.channelname = data.channel_name;
    console.log(this.channelname);
    this.channelId = data.channel_id;
    console.log('5456465654564564', this.channelId);
    this.channellogo = data.channel_logo;
    this.channelfreq = data.channel_freq;
    this.channeldesc = data.channel_desc;
    this.tsId = data.ts_id;
    this.serviceid = data.service_id;
    this.broadcasterRate = data.broadcaster_rate;
    this.oldBroadcastername = data.broadcastername;
    this.broadcastername = data.broadcasterid;
    this.distributorid = data.distributor_id;
    this.categoryname = data.categoryid;
    this.oldcategoryname = data.categoryname;
    this.oldChannelType  = data.channeltypename;
    this.inrAmt = data.inr_amt;
    this.channel_typename = data.channeltypeid;
    this.status = data.statusdisplay;
    // this.status = data.isactive;
    // this.isactive = data.statusdisplay;;

    console.log(this.isactive);

    this.ispaid = data.paidstatus;
    this.productid = data.product_id;
    this.commission = data.customeramount;
    this.isPercentage = data.isPercentage;
    // this.channelid = data.channel_id
    // this.channel_rate = data.inr_amt;
    // this.status = data.statusdisplay;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  toggleYes() {
    this.isYesActive = true; // Set Yes active
    this.isPercentage = this.isYesActive
    console.log("Ispercentage" + this.isPercentage);
  }

  toggleNo() {
    this.isYesActive = false; // Set No active
    this.isPercentage = this.isYesActive
    console.log("Ispercentage" + this.isPercentage);
  }


  ngOnInit(): void {
    this.Broadcaster_list();
    this.Category_list();
    this.Channel_type_list();
    this.checkMaxValue();
    // this.setDefaultLogo();
  }
  // async setDefaultLogo() {
  //   try {
  //     const logoFile = await this.userservice.getDefaultLogoFile();
  //     if (logoFile) {
  //       this.channellogo = logoFile;
  //     } else {
  //       console.warn('Using default logo failed, the file is null.');
  //     }
  //   } catch (error) {
  //     console.error('Error setting default logo:', error);
  //   }
  // }

  Broadcaster_list() {
    this.userservice.BroadcasterList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.broadcaster_id = data.map((item: any) => ({
        id: item.id,
        broadcastername: item.broadcastername
      }));
      console.log();
    })
  }
  Category_list() {
    this.userservice.CategoryList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.category_id = data.map((item: any) => ({
        id: item.id,
        category: item.name
      }));

      console.log();
    })
  }
  Channel_type_list() {
    this.userservice.ChannelTypeList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.channel_type_id = data.map((item: any) => ({
        id: item.id,
        channel_type: item.name
      }));
      console.log();
    })
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;

    // Allow digits only
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onSubmit() {
    const defaultFileContent = new Blob(['default content'], { type: 'image/png' });
    const defaultFile = new File([defaultFileContent], 'default-logo.png',);
    console.log(this.status);
    console.log(this.isactive);


    const isActive = this.status === "Active";
    let requestbody = {
      channel_id: this.channelId,
      channel_name: this.channelname,
      service_id: this.serviceid,
      broadcaster_rate: this.broadcasterRate,
      broadcaster_id: this.broadcastername,
      distributor_id: this.distributorid,
      category_id: this.categoryname,
      inr_amt: this.inrAmt,
      channel_type_id: this.channel_typename,
      isactive: isActive,
      product_id: this.productid,
      customer_amount: this.commission,
      ispercentage: !this.ispercentage,
      role: this.role,
      username: this.username

    };
    this.swal.Loading();
    this.userservice.UPDATE_CHANNEL(requestbody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.channel_name || err?.error?.inr_amt || err?.error?.broadcaster_id || err?.error?.product_id
          || err?.error?.service_id || err?.error?.customer_amount);
      });
  }
  timeout: any;
  breakLoad() {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      window.location.reload();
    }, 1000);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  percentageValue(value: boolean) {
    this.isPercentage = value;
    this.checkMaxValue();
  }
  checkMaxValue(): void {

    var inramt = this.inrAmt - this.commission
    if (!this.isPercentage && (inramt.toString().includes('-'))) {
      this.issave = true;
    } else if (this.isPercentage && this.commission > 100) {
      this.issave = true;
    } else {
      this.issave = false;
    }
    this.cdr.detectChanges();
  }

}
export class EditChannelModel {
  constructor(public list: any) {
  }
}
