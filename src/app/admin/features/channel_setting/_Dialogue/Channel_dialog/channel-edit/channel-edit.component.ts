import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
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
  distributorid: any;
  tsId: any;
  productid: any;
  serviceid: any;
  customerAmount: any;
  status: boolean;
  commission: any;
  ispercentage:boolean=false;
  categoryname: any;
  inrAmt: any;
  channelid: any
  channellogo: any;
  channelfreq: any;
  channeldesc: any;
  broadcasterRate: any;
  channel_typename: any;
  channelname: any;
  channel_rate: any;
  broadcaster_id: any;
  category_id: any;
  channel_type_id: any;
  isPercentage: boolean;
  // isactive: boolean;
  ispaid: boolean;
  categoryid: any;
  type: number = 0;
  isYesActive: boolean | null = null;
  category: any;
  channelType: any;
  nameFormControl: any; discriptionFormControl: any;
  streamidFormControl: any;
  addchannelGroup: any;
  channelidFormControl: any;
  // productidFormControl: any;
  selectbroadcaster: any;
  amountFormControl: any;
  selectedlanguageFormControl: any;
  selectedcategoryFormControl: any;
  selectedbroadcasterFormControl: any;
  isactiveFormControl: any;
  commissionFormControl: any;

  constructor(public dialogRef: MatDialogRef<ChannelEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.channelname = data.channel_name;
    this.channellogo = data.channel_logo;
    this.channelfreq = data.channel_freq;
    this.channeldesc = data.channel_desc;
    this.tsId = data.ts_id;
    this.serviceid = data.service_id;
    this.broadcasterRate = data.broadcaster_rate;
    this.broadcastername = data.broadcaster_id;
    this.distributorid = data.distributor_id;
    this.categoryname = data.category_id;
    this.inrAmt = data.inr_amt;
    this.channel_typename = data.channel_type_id;
    this.status = data.statusdisplay;
    this.ispaid = data.paidstatus;
    this.productid = data.product_id;
    this.customerAmount = data.customer_amount;
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
    const defaultFile = new File([defaultFileContent], 'default-logo.png',

    );
    // this.channellogo = this.channellogo || defaultFile;
    let requestbody = {
      channel_name: this.channelname,
      channel_logo: this.channellogo,
      channel_freq: this.channelfreq,
      channel_desc: this.channeldesc,
      ts_id: this.tsId,
      service_id: this.serviceid,
      broadcaster_rate: this.broadcasterRate,
      broadcaster_id: this.broadcastername,
      distributor_id: this.distributorid,
      category_id: this.categoryname,
      inr_amt: this.inrAmt,
      channel_type_id: this.channel_typename,
      isactive: this.status,
      ispaid: this.ispaid,
      product_id: this.productid,
      customer_amount: this.customerAmount,
      ispercentage:this.ispercentage,
      role: this.role,
      username: this.username

    };
    this.userservice.UPDATE_CHANNEL(requestbody).subscribe(
      (res) => {
        console.log('1111111');
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Package Edit Successfull!!",
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          window.location.reload();
          this.closeDialog();
        });
      },
      (err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'An error occurred',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
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
}
export class EditChannelModel {
  constructor(public list: any) {
  }
}
