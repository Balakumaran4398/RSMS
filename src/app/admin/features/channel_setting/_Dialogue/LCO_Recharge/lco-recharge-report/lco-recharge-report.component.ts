import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-lco-recharge-report',
  templateUrl: './lco-recharge-report.component.html',
  styleUrls: ['./lco-recharge-report.component.scss']
})
export class LcoRechargeReportComponent {

  maxDate = new Date();
  fromdate: any;
  todate: any;
  selectedTab: any = '1';
  selectTab(tab: string) {
    this.selectedTab = tab;
    console.log(this.selectedTab);
  }

  operatorid: any = 0;
  operatorList: any[] = [];
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  role: any;
  username: any;
  rowData: any[] = [];
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true,
    },
    { headerName: "OPERATOR NAME", field: 'productname', },
    { headerName: "TRANSACTION GROUP TYPE", field: 'packagerate', },
    { headerName: "AMOUNT", field: 'referenceid', },
    { headerName: "REMARKS1", field: 'casproductid' },
    { headerName: "TRANSACTION DATE", field: 'casproductid' },
    { headerName: "BILL", field: 'casproductid', filter: false },

  ]
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnint() {
    this.operatorlist();
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
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }
  onoperatorchange(event: any) {
    // if (this.operatorid === '0') {
    //   this.operatorid = 0;
    // }
    // this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
    //   (data: any) => {
    //     console.log(data);
    //   },
    //   (error) => {
    //     console.error('Error fetching operator details', error);
    //   }
    // );
  }

}
