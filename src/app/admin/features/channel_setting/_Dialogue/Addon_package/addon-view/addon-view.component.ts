import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-addon-view',
  templateUrl: './addon-view.component.html',
  styleUrls: ['./addon-view.component.scss']
})
export class AddonViewComponent {
  username: string;
  role: string;
  gridApi: any;
  package_id: any;
  rowData: any[] = [];
  Addon_Package_Rate: any;
  Addon_Packagename: any;
  Broadcaster_Name: any;
  Number_of_channels: any;
  Order_Id: any;

  packageid: any;
  gridOptions = {
    defaultColDef: {
    },
    pagination: true,
    paginationPageSize: 10
  };

  constructor(
    public dialogRef: MatDialogRef<AddonViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.package_id = data.id;
    this.packageid = data.packageid;
    console.log(this.packageid);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.Addon_Package_Rate = data.addon_package_rate || data.rate;
    this.Addon_Packagename = data.addon_package_name || data.productname;
    // if (this.role !== 'ROLE_OPERATOR') {
    this.Broadcaster_Name = data.broadcaster_name || data.broadcastername;
    // }
    // this.Number_of_channels = data.Number_of_channels ;
    this.Order_Id = data.order_id || data.id;
  }
  ngOnInit(): void {



    this.userService.Addon_PackageChannelList(this.package_id, this.role, this.username,).subscribe((data: any) => {
      console.log(data);
      this.Number_of_channels = data[0].Number_of_channels;
      this.rowData = data[0].availablechanlist;
      console.log(this.rowData);
    });

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  columnDefs: any[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100 },
    { headerName: 'CHANNEL NAME', field: 'channel_name', editable: true, width: 180 },
    { headerName: 'BROADCASTER NAME	', field: 'broadcastername', editable: true, width: 180 },
    { headerName: 'SERIVICE ID	', field: 'service_id', editable: true, width: 160 },
    { headerName: 'RATE	', field: 'broadcaster_rate', editable: true, width: 180 },
    {
      headerName: 'STATUS', field: 'isactive', editable: true, width: 140,
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green; font-weight: bold;">Active</span>`;
        } else if (params.value === false) {
          return `<span style="color: red; font-weight: bold;">Deactive</span>`;
        }
        return params.value;
      }
    }
  ];
}
