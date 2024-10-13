import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Any } from 'node_modules1/@sigstore/protobuf-specs/dist/__generated__/google/protobuf/any';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-update-ltb',
  templateUrl: './update-ltb.component.html',
  styleUrls: ['./update-ltb.component.scss']
})
export class UpdateLtbComponent implements OnInit {
  isActive = false;
  opName: any;
  istax: boolean = false;
  isactive: any;
  opNameList: any[] = [];
  localPaymentChannelList: any;
  role: any;
  username: any;
  id: any;
  lcnno: any;
  updateTax: any;
  updateLcoPrice: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateLtbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.localPaymentChannelList = data;
    console.log(this.localPaymentChannelList);
    
    this.id = data.id;
    this.lcnno = data.lcn;
    this.isactive = data.statusdisplay === '"Active"' ? true : false;
   

  }
  ngOnInit(): void {
    this.userService.getLocalChannelOperatorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.opNameList = Object.keys(data).map(key => ({
        packagename: key,
        packageid: data[key]
      }));
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  toggleStatus() {
    this.isActive = !this.isActive;
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      console.log('Selected file:', file);
      // You can now perform operations with the selected file, like uploading it to a server
    }
  }

  onChange() {
    this.userService.getLocalCreationAmountDetails(this.role, this.username, this.localPaymentChannelList?.channelrate, !this.istax).subscribe((data: any) => {
      this.updateTax = data.tax;
      this.updateLcoPrice = data.lcoprice;
      // this.localPaymentChannelList = data;
    })

  }
  submit() {
    console.log(this.opName);

    this.userService.updateLocalChannel(this.role, this.username, this.localPaymentChannelList?.channelid, this.opName, this.localPaymentChannelList?.tax, this.localPaymentChannelList?.lcoprice, this.lcnno, this.localPaymentChannelList?.channelrate, !this.istax, this.id, this.isactive)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}
