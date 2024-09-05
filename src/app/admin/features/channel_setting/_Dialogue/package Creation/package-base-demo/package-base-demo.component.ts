import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-package-base-demo',
  templateUrl: './package-base-demo.component.html',
  styleUrls: ['./package-base-demo.component.scss']
})
export class PackageBASEDEMOComponent {
  dailogObj: any;
  gridApi: any;
  packagename: any;
  packagerate: any;
  subcount: any;
  username: any;
  role: any;
  package_id: any;
  rowData: any;
  rowDataUnpair: any;
  type: any;
  constructor(
    public dialogRef: MatDialogRef<PackageBASEDEMOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageservice: StorageService) {
    this.dailogObj = data;
    this.type = data.type
    this.package_id = data.package_id;
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  loadAddonPackageChannelList() {
    this.userService.Base_PackageChannelList(this.role, this.username, 1, this.package_id).subscribe(
      (response: any) => {
        this.packagename = response.packagename;
        this.packagerate = response.packagerate;
        this.subcount = response.subcount;
        console.log(this.subcount);
        console.log(response.subcount);
        this.rowData = response;
      },
      (error) => {
        console.error('Error fetching addon package channel list', error);
      }
    );
  }
  pair() {
    this.userService.RcasPackageChannelList(this.role, this.username, 1, this.package_id).subscribe(
      (response: any) => {
        this.packagename = response.packagename;
        this.packagerate = response.packagerate;
        this.subcount = response.subcount;
        this.rowData = response[0].availablechannellist;
        this.rowDataUnpair = response[0].unavailablechannellist;
        console.log(response);
      },
      (error) => {
        console.error('Error fetching addon package channel list', error);
      }
    );
  }
  ngOnInit(): void {
    // this.userService.AddonPackageChannelList(this.role, this.username, 1, this.package_id).subscribe((data: any) => {
    // });
    if (this.dailogObj.type === 'pair') {
      this.pair();
    }
    if (this.dailogObj.type === 'paychannel' || this.dailogObj.type === 'bouquet') {
      this.loadAddonPackageChannelList();
    }

    this.columnDefs1 = [
      { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100 },
      { headerName: 'CHANNEL NAME', field: 'channelname', editable: true, width: 150 },
      { headerName: 'PRODUCT ID', field: 'productid', editable: true, width: 150 },
      { headerName: 'CHANNEL ID', field: 'channelid', editable: true, width: 140 },
    ];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  gridOptions = {
    defaultColDef: {
      // width: 300,
    },
  };

  columnDefs: ColDef[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 90 },
    { headerName: 'CHANNEL NAME', field: 'channel_name', editable: true, width: 140 },
    { headerName: 'PRODUCT ID', field: 'product_id', editable: true, width: 140 },
    { headerName: 'SERVICE ID', field: 'service_id', editable: true, width: 130 },
    { headerName: 'RATE', field: 'packagerate', editable: true, width: 130 },
    { headerName: 'STATUS', field: 'statusdisplay', editable: true, width: 130 }
  ];

  columnDefs1: ColDef[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1',width:100 },
    { headerName: 'CHANNEL NAME', field: 'channelname', editable: true,width:300},
    { headerName: 'PRODUCT ID', field: 'productid', editable: true,width:300},
    { headerName: 'CHANNEL ID', field: 'channelid', editable: true,width:300},

  ];
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;


  }
}
