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
  distributor_id: any;
  product_id: any;
  service_id: any;
  status: any;
  commission: any;
  ispercentage: any = false;
  categoryname: any;
  channel_typename: any;
  channel_name: any;
  channel_rate: any;
  broadcaster_id: any;
  category_id: any;
  channel_type_id: any;
  isPercentage: boolean;
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
  channel_id: any
  channel_logo: File | null = null;
  constructor(public dialogRef: MatDialogRef<ChannelEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.channel_id = data.channel_id
    console.log(this.channel_id);
    this.channel_name = data.channel_name;
    this.channel_rate = data.inr_amt;
    this.broadcastername = data.broadcastername;
    this.categoryname = data.categoryname;
    this.channel_typename = data.channeltypename;
    this.product_id = data.product_id;
    this.service_id = data.service_id;
    this.status = data.statusdisplay;
    this.isPercentage = data.isPercentage;
    this.commission = this.commission
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
    this.setDefaultLogo();
  }
  async setDefaultLogo() {
    try {
      const logoFile = await this.userservice.getDefaultLogoFile();
      if (logoFile) {
        this.channel_logo = logoFile;
      } else {
        console.warn('Using default logo failed, the file is null.');
      }
    } catch (error) {
      console.error('Error setting default logo:', error);
    }
  }
  
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
    this.channel_logo = this.channel_logo || defaultFile;
    let requestbody = {
      channel_logo: this.channel_logo,
      channel_id: this.channel_id,
      channel_name: this.channel_name,
      inr_amt: this.channel_rate,
      broadcaster_id: this.broadcastername,
      category_id: this.categoryname,
      channel_type_id: this.channel_typename,
      product_id: this.product_id,
      service_id: this.service_id,
      statusdisplay: this.status,
      commission: this.commission,
      isactive: this.ispercentage,
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
