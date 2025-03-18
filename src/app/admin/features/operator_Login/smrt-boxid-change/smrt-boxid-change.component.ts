import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-smrt-boxid-change',
  templateUrl: './smrt-boxid-change.component.html',
  styleUrls: ['./smrt-boxid-change.component.scss']
})
export class SmrtBoxidChangeComponent implements OnInit {

  role: any;
  username: any;
  type: any = 'smartcard';
  isTabDisabled = false;
  gridApi: any;
  oldsmartcard: any = '';
  newsmartcard: any = '';
  oldboxid: any = '';
  newboxid: any = '';
  boxidvalue: any;
  smartcardvalue: any;
  rowData: any[] = [];
  columnDefs: any[] = [];
  header: any;
  smartcardid: boolean = false;
  boxid: boolean = false;
  flag: boolean = false;


  gridOptions = {
    defaultColDef: {
      // sortable: true,
      // resizable: true,
      // filter: true,
      // floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    pagination: true,
  };


  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.getSelecttype();
    // this.onColumnDefs();
  }
  onTabChange(event: any) {
    const tabLabels = ["smartcard", "boxid"];
    this.type = tabLabels[event.index];
    this.getSelecttype();
  }

  getSelecttype() {

    this.smartcardvalue
    this.boxidvalue
    if (this.type === 'smartcard') {
      this.boxidvalue;
       this.smartcardvalue
      this.header = 'Smartcard Change Operation';
      this.onColumnDefs();
    } else if (this.type === 'boxid') {
      this.boxidvalue ;
      this.smartcardvalue ='';
      this.header = 'Box ID Change Operation';
      this.onColumnDefs();
    }
  }

  onRadioChange(event: any) {
    this.isTabDisabled = event.value === '2';
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }


  private onColumnDefs() {
    if (this.type == 'smartcard') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', },
        { headerName: 'SMARTCARD', field: 'name', width: 400, },
        { headerName: 'PRODUCT TYPE	', width: 350, },
        { headerName: 'PRODUCT NAME	', width: 300, },
        { headerName: 'EXPIRY DATE', field: 'statusdisplay', width: 300, }
      ];
    } else if (this.type == 'boxid') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: 'SMARTCARD', width: 400, field: 'name', },
        { headerName: 'PRODUCT TYPE	', width: 350, },
        { headerName: 'PRODUCT NAME	', width: 300, },
        { headerName: 'EXPIRY DATE', field: 'statusdisplay', width: 300, }
      ];
    }
  }
  smrtSubmit(selectType: any) {
    console.log(selectType);
   
    this.userservice.getDataBysmartcardOrBoxid(this.role, this.username, selectType, this.oldsmartcard || this.oldboxid).subscribe((res: any) => {
      console.log(res);
      this.flag = res.flag;
      this.boxidvalue = res.boxid;
      this.smartcardvalue = res.smartcard;
      console.log(this.smartcardvalue);
      console.log(this.boxidvalue);
      // if (!this.flag) {
      //   // this.smartcardid = !this.smartcardid;
      //   this.smartcardid = false;
      // } else {
      //   this.smartcardid = true;
      // }

      // this.oldsmartcard = '';
      // this.oldboxid = '';
    })
  }
  // getMaskedSmartcard(): string {
  //   if (this.smartcardvalue) {
  //     return this.smartcardvalue.slice(0, -4).replace(/./g, '*') + this.smartcardvalue.slice(-4);
  //   }
  //   return '';
  // }
  // getMaskedBoxid(): string {
  //   if (this.boxidvalue) {
  //     return this.boxidvalue.slice(0, -4).replace(/./g, '*') + this.boxidvalue.slice(-4);
  //   }
  //   return '';
  // }
  submit() {

  }
}
