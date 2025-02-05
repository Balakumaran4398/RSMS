import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
declare var $: any;
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  role: any;
  username: any;
  selectedEntry: any;
  selectSmartcard: any;

  subscriberDetails = [
    { label: 'OPERATOR', value: 'raman' },
    { label: 'MOBILE NO', value: 'raman' },
    { label: 'SUBSCRIBER', value: 'raman' },
    { label: 'AREA NAME', value: 'raman' },
    { label: 'STREET NAME', value: 'raman' }
  ];
  filteredPackageList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  filteredSmartcardList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    $('#entry').select2({
      placeholder: 'Select Issue',
      allowClear: true
    });
    $('#entry').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });

    $('#smartcard').select2({
      placeholder: 'Select Smartcard',
      allowClear: true
    });
    $('#smartcard').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });
  }
}
