import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-lco-smartcardpay-dialog',
  templateUrl: './lco-smartcardpay-dialog.component.html',
  styleUrls: ['./lco-smartcardpay-dialog.component.scss']
})
export class LcoSmartcardpayDialogComponent {
  columnnDefs: any[] = [];
  rowData: any[] = [];
  @ViewChild('agGrid') agGrid: any;
  gridApi: any;
  role: any;
  username: any;
  selectedTab: string = 'lco';
  selectedLCO: any;
  selectedSubLCO: any;
  selectedSubscriber: any;

  fromdate: any;
  todate: any;

  collected: any = '0.0';
  paid: any = '0.0';
  unpaid: any = '0.0';
  excess: any = '0.0';
  constructor(private dialog: MatDialog, private userService: BaseService, private storageService: StorageService, private swal: SwalService, private router: Router,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
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
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.loadTableData("");
  }

  loadTableData(selectedTab: any) {
    console.log(`Selected Tab: ${selectedTab}`);

    this.columnnDefs = [
      {
        headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
      },

      { headerName: "DUE PERIOD", field: 'productid', width: 130, },
      { headerName: "DUE", field: 'producttype', width: 140 },
      {
        headerName: "PAID", field: 'rate', width: 140,
        cellRenderer: (params: any) => `<span >${params.value ? params.value.toFixed(2) : '0.00'}</span> `
      },
      {
        headerName: "BALANCE", field: 'customeramount', width: 150,
        cellRenderer: (params: any) => `<span >${params.value ? params.value.toFixed(2) : '0.00'}</span> `
      },
      {
        headerName: "EXCESS ", field: 'commission',
        width: 150, cellRenderer: (params: any) => `<span >${params.value ? params.value.toFixed(2) : '0.00'}</span> `
      },
      {
        headerName: "COLLECTION DATE", field: 'msoamount', width: 140,
        cellRenderer: (params: any) => `<span >${params.value ? params.value.toFixed(2) : '0.00'}</span> `
      },

      {
        headerName: "PACKAGE NAME", field: 'commissionvalue', width: 170,
        cellRenderer: (params: any) => `<span>${params.value ? params.value.toFixed(2) : '0.00'}</span>`
      },


    ]
  }

}
