import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-createltb',
  templateUrl: './createltb.component.html',
  styleUrls: ['./createltb.component.scss']
})
export class CreateltbComponent implements OnInit {
  role: any;
  username: any;
  opNameList: any[] = [];
  chNameList: any[] = [];
  opName: any = 0;
  channel: any = 0;
  lcnNo: any;
  chRate: any;
  istax: boolean = false;
  tax: any;
  lcoprice: any;
  updateTax: string='0.0';
  updateLcoPrice: string='0.0';

  constructor(
    public dialogRef: MatDialogRef<CreateltbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService,private swal:SwalService) {
    console.log('Data received:', data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
  }
  ngOnInit(): void {
    this.userService.getLocalChannelOperatorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.opNameList = Object.keys(data).map(key => ({
        packagename: key,
        packageid: data[key]
      }));
    })
    this.userService.getLocalChannelList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.chNameList = Object.keys(data).map(key => ({
        channelname: key,
        channelid: data[key]
      }));
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onChange() {
    this.userService.getLocalCreationAmountDetails(this.role, this.username, this.chRate, !this.istax).subscribe((data: any) => {
      this.updateTax = data.tax;
      this.updateLcoPrice = data.lcoprice;
  
    })

  }
  submit() {
    this.userService.createLocalChannel(this.role, this.username, this.channel, this.opName, this.updateTax, this.updateLcoPrice, this.lcnNo, this.chRate, this.istax)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

}
