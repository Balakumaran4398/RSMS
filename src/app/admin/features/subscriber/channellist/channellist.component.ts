import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-channellist',
  templateUrl: './channellist.component.html',
  styleUrls: ['./channellist.component.scss']
})
export class ChannellistComponent implements OnInit {
  role: any;
  username: any;
  returndata: any;
  packageid: any;
  productType: any;
  count: any;
  packagename:any;

  rowData: any[] = [];
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
    },
    paginationPageSize: 10,
    pagination: true,
  }

  constructor(public dialogRef: MatDialogRef<ChannellistComponent>, private swal: SwalService,
    @Inject(MAT_DIALOG_DATA) public data: any, public userService: BaseService, public storageService: StorageService, private fb: FormBuilder) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log(data);
    console.log(data.ptype);
    this.packageid = data.id;
    console.log(this.packageid);

    if (data.ptype === 'BASE') {
      this.productType = 1;
    } else if (data.ptype === 'ADDON') {
      this.productType = 2;
    } else if (data.ptype === 'ALACARTE') {
      this.productType = 3;
    }
    console.log(this.productType);
  }
  ngOnInit(): void {
    this.userService.getChannellistByPackageIdAndProductType(this.role, this.username, this.packageid, this.productType).subscribe((data: any) => {
      console.log(data);
      this.count = data.count;
      this.packagename= data.packagename;
      console.log(this.packagename)
      this.rowData = data.channeldetails;
    })
  }

  onNoClick(): void {

    this.dialogRef.close(this.returndata);
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: 'CHANNEL NAME',
      field: 'channel_name', width: 400,
    },
    {
      headerName: 'SERVICE ID', width: 210,
      field: 'service_id',
    },
    {
      headerName: 'PRODUCT ID', width: 200,
      field: 'product_id',
    },
    {
      headerName: 'INR AMOUNT', width: 200,
      field: 'inr_amt',
    },

  ]

}
