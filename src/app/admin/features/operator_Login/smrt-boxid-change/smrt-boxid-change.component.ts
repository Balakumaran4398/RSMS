import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

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


  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.getSelecttype();
    // this.onColumnDefs();
    this.getData();
  }
  onTabChange(event: any) {
    const tabLabels = ["smartcard", "boxid"];
    this.type = tabLabels[event.index];
    this.getSelecttype();
    this.getData();
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
      this.boxidvalue;
      this.smartcardvalue = '';
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
        { headerName: 'SMARTCARD / BOXID', field: 'smartcardorboxid', width: 400, },
        { headerName: 'OLD SMARCARD', field: 'oldsmorbox', width: 350, },
        { headerName: 'NEW SMARCARD', field: 'newsmorbox', width: 300, },
        { headerName: 'UPDATED DATE', field: 'updateddate', width: 300, }
      ];
    } else if (this.type == 'boxid') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: 'BOXID / SMARTCARD', width: 400, field: 'smartcardorboxid', },
        { headerName: 'OLD BOX ID', field: 'oldsmorbox', width: 350, },
        { headerName: 'NEW BOX ID', field: 'newsmorbox', width: 300, },
        { headerName: 'UPDATED DATE', field: 'updateddate', width: 300, }
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
  getSmartcardSubmit() {
    this.swal.Loading();
    this.userservice.getSmartcardChange(this.role, this.username, 2, this.oldsmartcard, this.newsmartcard, this.boxidvalue)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getboxidSubmit() {
    this.swal.Loading();
    this.userservice.getBoxChange(this.role, this.username, this.oldboxid, this.newboxid, this.smartcardvalue)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getData() {
    console.log(this.type);

    if (this.type == 'smartcard') {
      console.log('111111111111111111');

      this.userservice.getSmartcardBoxidList(this.role, this.username, 1).subscribe((data: any) => {
        console.log(data);
        this.rowData = data;
      })
    } else if (this.type == 'boxid') {
      console.log('2222222222222');

      this.userservice.getSmartcardBoxidList(this.role, this.username, 2).subscribe((data: any) => {
        console.log(data);
        this.rowData = data;
      })
    }

  }
}
