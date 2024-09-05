import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-expiry-details',
  templateUrl: './expiry-details.component.html',
  styleUrls: ['./expiry-details.component.scss']
})
export class ExpiryDetailsComponent {
  maxDate = new Date();
  fromdate: any;
  todate: any;
  username: any;
  role: any;
  operatorid: any;
  format: any = 1;
  format_1: any = 2;
  selectedLcoName: any = 0;
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    userservice.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
    })

  }

  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }
  Submit() {
    this.userservice.Expiry_subscriber(this.role, this.username, this.selectedLcoName, this.fromdate, this.todate, this.format).subscribe((data: any) => {
      console.log(data);
    })
  }
  Submit_1() {
    this.userservice.Expiry_subscriber(this.role, this.username, this.selectedLcoName, this.fromdate, this.todate, this.format_1).subscribe((data: any) => {
      console.log(data);
    })
  }
}
