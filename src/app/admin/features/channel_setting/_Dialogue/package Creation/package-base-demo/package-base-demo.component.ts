import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

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
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageservice: StorageService, private swal: SwalService) {
    this.dailogObj = data;
    this.type = data.type
    this.package_id = data.package_id;
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }

  // columnDefs: ColDef[] = [
  //   { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 90 },
  //   { headerName: 'CHANNEL NAME', field: 'channel_name',  width: 140 },
  //   { headerName: 'PRODUCT ID', field: 'product_id',  width: 140 },
  //   { headerName: 'SERVICE ID', field: 'service_id',  width: 130 },
  //   { headerName: 'RATE', field: 'packagerate',  width: 130 },
  //   { headerName: 'STATUS', field: 'statusdisplay',  width: 130 }
  // ];
  columnDefs: ColDef[] = [];

  loadAddonPackageChannelList() {

    if (this.dailogObj.type === 'paychannel') {
      this.userService.Base_PackageChannelList(this.role, this.username, 2, this.package_id).subscribe(
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
    } else {
      this.userService.getaddonlistpackage(this.role, this.username, 1, this.package_id).subscribe(
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

  }

  pair() {
    // Swal.fire({
    //   title: 'Loading...',
    //   html: 'Fetching package channel list...',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading(null);
    //   }
    // });
    this.swal.Loading();
    this.userService.RcasPackageChannelList(this.role, this.username, 1, this.package_id).subscribe(
      (response: any) => {
        console.log(response);
        this.packagename = response.packagename;
        this.packagerate = response.packagerate;
        this.subcount = response.subcount;
        this.rowData = response.availablechannellist;
        this.rowDataUnpair = response.unavailablechannellist;
        console.log(response);
        console.log(this.rowData);
        console.log(this.rowDataUnpair);

        Swal.close();
      },
      (error) => {
        console.error('Error fetching addon package channel list', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch addon package channel list'
        });
        window.location.reload();
      }
    );
  }

  addonPair() {
    // Swal.fire({
    //   title: 'Loading...',
    //   html: 'Fetching package channel list...',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading(null);
    //   }
    // });
    this.swal.Loading();
    this.userService.RcasPackageChannelList(this.role, this.username, 2, this.package_id).subscribe(
      (response: any) => {
        console.log(response);
        this.packagename = response.packagename;
        this.packagerate = response.packagerate;
        this.subcount = response.subcount;
        this.rowData = response.availablechannellist;
        this.rowDataUnpair = response.unavailablechannellist;
        console.log(response);
        console.log(this.rowData);
        console.log(this.rowDataUnpair);
        this.swal.success_1(response.message)
      },
      (error) => {
        console.error('Error fetching addon package channel list', error);
        this.swal.Error1(error?.error?.message);
     }
    );
  }
  ngOnInit(): void {
    // this.userService.AddonPackageChannelList(this.role, this.username, 1, this.package_id).subscribe((data: any) => {
    // });
    if (this.dailogObj.type === 'pair') {
      this.pair();
    } else if (this.dailogObj.type === 'addonpair') {
      this.addonPair();
    }
    if (this.dailogObj.type === 'paychannel' || this.dailogObj.type === 'bouquet') {
      this.loadAddonPackageChannelList();
    }
    this.updateColumnDefs();
  }
  updateColumnDefs() {
    if (this.dailogObj.type === 'paychannel') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channel_name', width: 250 },
        { headerName: 'PRODUCT ID', field: 'product_id', width: 220 },
        { headerName: 'CHANNEL ID', field: 'channel_id', width: 200 },
      ]
    } else if (this.dailogObj.type === 'bouquet') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'BOUQUET NAME', field: 'addon_package_name', width: 180 },
        { headerName: 'REFERENCE ID', field: 'order_id', width: 150 },
        { headerName: 'RATE', field: 'addon_package_rate', width: 170 },
        {
          headerName: 'STATUS', field: '_active', width: 180,
          cellRenderer: (params: any) => {
            if (params.value === true) {
              return `<span style="color: green; font-weight: bold;">Active</span>`;
            } else if (params.value === false) {
              return `<span style="color: red; font-weight: bold;">Deactive</span>`;
            }
            return params.value; // handle other values if needed
          }
        },

      ];
    } else if (this.dailogObj.type === 'pair') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channelname', width: 200 },
        { headerName: 'PRODUCT ID', field: 'productid', width: 130 },
        { headerName: 'CHANNEL ID', field: 'channelid', width: 150 },
      ];
    } else if (this.dailogObj.type === 'addonpair') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channelname', width: 200 },
        { headerName: 'PRODUCT ID', field: 'productid', width: 130 },
        { headerName: 'CHANNEL ID', field: 'channelid', width: 150 },
      ];
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  gridOptions = {
    defaultColDef: {
      // width: 300,
    },
    paginationPageSize: 10,
    pagination: true,
    comparator: (valueA: any, valueB: any) => {
      const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
      const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
      if (normalizedA < normalizedB) return -1;
      if (normalizedA > normalizedB) return 1;
      return 0;
    },
  };



  // columnDefs1: ColDef[] = [
  //   { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100 },
  //   { headerName: 'CHANNEL NAME', field: 'channelname',  width: 300 },
  //   { headerName: 'PRODUCT ID', field: 'productid',  width: 300 },
  //   { headerName: 'CHANNEL ID', field: 'channelid',  width: 300 },

  // ];
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;


  }
}
