import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
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
  selectedOperator: any;

  isActive: boolean = false;
  today = new Date();

  fromdate:any;
  todate:any;

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData: any[] = [];

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
  filteredOperatorList: any[] = [
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
    $('#operator').select2({
      placeholder: 'Select Operator',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100, },
    { headerName: "MODEL", field: 'smartcard', width: 150 },
    { headerName: "TOKEN NUMBER", field: 'lcoid', width: 150 },
    { headerName: "OPERATOR NAME", field: 'addingpackageid', width: 150 },
    { headerName: "CONTACT", field: 'addingpackageid', width: 150 },
    { headerName: "CUSTOMER NAME", field: 'addingpackageid', width: 150 },
    { headerName: "SMARTCARD", field: 'addingpackageid', width: 150 },
    { headerName: "BOX ID", field: 'addingpackageid', width: 150 },
    { headerName: "STATUS", field: 'addingpackageid', width: 150 },
    { headerName: "REPLACE SMARTCARD", field: 'addingpackageid', width: 150 },
    { headerName: "ENTRY", field: 'addingpackageid', width: 150 },
    { headerName: "ENTRY DATE", field: 'addingpackageid', width: 150 },
    { headerName: "ATTENDER", field: 'addingpackageid', width: 150 },
    { headerName: "AMOUNT", field: 'addingpackageid', width: 150 },
    { headerName: "DELIVERY", field: 'addingpackageid', width: 150 },
    { headerName: "DELIVERY DATE", field: 'addingpackageid', width: 150 },
  ]

  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }
  getServiceReportDownload(type:any){
    
  }
}
