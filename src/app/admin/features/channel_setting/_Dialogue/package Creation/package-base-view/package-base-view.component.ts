import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';


@Component({
  selector: 'app-package-base-view',
  templateUrl: './package-base-view.component.html',
  styleUrls: ['./package-base-view.component.scss'],
  // standalone: true,
  // imports: [CdkDropList, CdkDrag, CommonModule,FormsModule,DragDropModule]
})
export class PackageBaseViewComponent {
  selectedTab: string = '1';
  rowData: any[] = [];
  count:any;
  username: string;
  role: string;
  package_id: number;
  package_name: any;
  package_rate: any;
  package_viewing_count: any;
  gridApi: any;
  addon_view: boolean = false;
  package_view: boolean = false;
  basePackageObj: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      minWidth: 195,
      floatingFilter: true
    },
    pagination: true,
    paginationPageSize: 5,
    autoHeight: true,

    // onGridReady: (event: any) => event.api.sizeColumnsToFit()
  };
  columnDefs: any[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100 },
    { headerName: 'CHANNEL NAME', field: 'channel', editable: true, width: 170 },
    { headerName: 'PRODUCT ID', field: 'serviceId', editable: true, width: 170 },
    { headerName: 'SERVICE ID', field: 'productId', editable: true, width: 170 },
    { headerName: 'TS ID', field: 'broadcaster', editable: true, width: 150 },
    { headerName: 'STATUS', field: 'status', editable: true, width: 150 }
  ];
  constructor(
    public dialogRef: MatDialogRef<PackageBaseViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.package_name = data.packagename;
    this.package_rate = data.packagerate;
    this.basePackageObj = data;
    if (data.package_view) {
      this.package_view = true;
    }
    this.package_id = data.packageid;
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.Package_CloneList(this.role, this.username, this.package_id).subscribe((data: any) => {
      console.log(data);
      this.package_viewing_count = data.count;
    })

  }
  ngAfterViewInit(): void {
    this.loadData(this.selectedTab);
  }
  ngOnInit(): void {
    // this.loadData(this.selectedTab);

  }
  selectTab(tab: any): void {
    this.selectedTab = tab;
    // console.log(tab);
    this.loadData(tab);
  }

  packagename: any;
  packagerate: any;
  subcount: any;
  onNoClick(): void {
    this.dialogRef.close();
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  private loadData(tab: any): void {
    console.log(tab);
    this.userService.Base_PackageChannelList(this.role, this.username, tab,this.package_id).subscribe((data: any) => {
      this.packagename = data.packagename;
      this.packagerate = data.packagerate;
      this.subcount = data.subcount;
      this.rowData = data;
      this.count=data.length;
      this.updateColumnDefs(tab);
    });
  }
  private updateColumnDefs(tab: string): void {
    if (tab === '1') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channel_name', editable: true, width: 150 },
        { headerName: 'PRODUCT ID', field: 'product_id', editable: true, width: 150 },
        { headerName: 'SERVICE ID', field: 'service_id', editable: true, width: 140 },
        { headerName: 'TS ID', field: 't_id', editable: true, width: 150 },
        { headerName: 'STATUS', field: 'status', editable: true, width: 150 }
      ];
    } else if (tab === '2') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channel_name', editable: true, width: 150 },
        { headerName: 'PRODUCT ID', field: 'product_id', editable: true, width: 130 },
        { headerName: 'SERVICE ID', field: 'service_id', editable: true, width: 120 },
        { headerName: 'TS ID', field: 't_id', editable: true, width: 130 },
        { headerName: 'RATE', field: 'broadcaster_rate', editable: true, width: 130 },
        { headerName: 'STATUS', field: 'statusdisplay', editable: true, width: 130 }
      ];
    } else if (tab === '3') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channel_name', editable: true, width: 150 },
        { headerName: 'PRODUCT ID', field: 'product_id', editable: true, width: 150 },
        { headerName: 'RATE', field: 'broadcaster_rate', editable: true, width: 150 },
        { headerName: 'SERVICE ID', field: 'service_id', editable: true, width: 140 },
        { headerName: 'TS ID', field: 't_id', editable: true, width: 150 },
        { headerName: 'STATUS', field: 'statusdisplay', editable: true, width: 150 }
      ];
    } else if (tab === 'addon_view') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
        { headerName: 'CHANNEL NAME', field: 'channel_name', editable: true, width: 150 },
        { headerName: 'BROADCASTER NAME	', field: 'product_id', editable: true, width: 150 },
        { headerName: 'SERIVICE ID	', field: 'broadcaster_rate', editable: true, width: 150 },
        { headerName: 'RATE	', field: 'service_id', editable: true, width: 140 },
        { headerName: 'STATUS', field: 'statusdisplay', editable: true, width: 150 }
      ];
    }
    // if (this.gridApi) {
    //   this.gridApi.setColumnDefs(this.columnDefs);
    // }
  }
}
