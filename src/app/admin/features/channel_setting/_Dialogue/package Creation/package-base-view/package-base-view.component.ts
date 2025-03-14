import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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
  count: any;
  username: string;
  role: any;
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
      // minWidth: 195,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    pagination: true,
    paginationPageSize: 5,
    autoHeight: true,



    // onGridReady: (event: any) => event.api.sizeColumnsToFit()
  };
  columnDefs: any[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
    { headerName: 'CHANNEL NAME', field: 'channel', width: 150 },
    { headerName: 'PRODUCT ID', field: 'serviceId', width: 120 },
    { headerName: 'SERVICE ID', field: 'productId', width: 120 },
    { headerName: 'TS ID', field: 't_id', width: 120 },
    { headerName: 'STATUS', field: 'status', width: 120 }
  ];
  constructor(
    public dialogRef: MatDialogRef<PackageBaseViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private cdr: ChangeDetectorRef) {
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
      console.log(this.package_viewing_count);

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
    this.loadData(tab);
    // this.rowData = this.data;
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
    this.userService.Base_PackageChannelList(this.role, this.username, tab, this.package_id).subscribe((data: any) => {
      this.packagename = data.packagename;
      this.packagerate = data.packagerate;
      this.subcount = data.subcount;
      this.rowData = data;
      this.count = data.length;
      this.updateColumnDefs(tab);
      this.cdr.detectChanges();

    });
  }
  private updateColumnDefs(tab: string): void {
    console.log('Tab', tab);

    if (tab === '1') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: 'CHANNEL NAME', field: 'channel_name', width: 250, },
        { headerName: 'PRODUCT ID', field: 'product_id', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'SERVICE ID', field: 'service_id', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'TS ID', field: 't_id', width: 200, cellStyle: { textAlign: 'center' }, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 200 }
      ];
    } else if (tab === '2') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: 'CHANNEL NAME', field: 'channel_name', width: 200 },
        { headerName: 'PRODUCT ID', field: 'product_id', width: 150, cellStyle: { textAlign: 'center' }, },
        { headerName: 'SERVICE ID', field: 'service_id', width: 150 },
        { headerName: 'TS ID', field: 't_id', cellStyle: { textAlign: 'center' }, width: 200 },
        { headerName: 'RATE', field: 'broadcaster_rate', cellStyle: { textAlign: 'center' }, width: 200 },
        { headerName: 'STATUS', field: 'statusdisplay', width: 160 }
      ];
    } else if (tab === '3') {
      this.columnDefs = [
        { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100, cellStyle: { textAlign: 'center' }, },
        { headerName: 'CHANNEL NAME', field: 'channel_name', width: 200 },
        { headerName: 'PRODUCT ID', field: 'product_id', cellStyle: { textAlign: 'center' }, width: 150 },
        { headerName: 'RATE', field: 'broadcaster_rate', cellStyle: { textAlign: 'center' }, width: 150 },
        { headerName: 'SERVICE ID', field: 'service_id', cellStyle: { textAlign: 'center' }, width: 200 },
        { headerName: 'TS ID', field: 't_id', cellStyle: { textAlign: 'center' }, width: 200 },
        { headerName: 'STATUS', field: 'statusdisplay', width: 160 }
      ];
    }
    // else if (tab === 'addon_view') {
    //   this.columnDefs = [
    //     { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
    //     { headerName: 'CHANNEL NAME', field: 'channel_name', width: 150 },
    //     { headerName: 'BROADCASTER NAME	', field: 'product_id', width: 150 },
    //     { headerName: 'SERIVICE ID	', field: 'broadcaster_rate', width: 150 },
    //     { headerName: 'RATE	', field: 'service_id', width: 140 },
    //     { headerName: 'STATUS', field: 'statusdisplay', width: 150 }
    //   ];
    // }
    // if (this.gridApi) {
    //   this.gridApi.setColumnDefs(this.columnDefs);
    // }
  }
  columnDefs1: any[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100, cellStyle: { textAlign: 'center' }, },
    { headerName: 'CHANNEL NAME', field: 'channel_name', width: 250, },
    { headerName: 'TRANSPORT ID', field: 't_id', width: 300, cellStyle: { textAlign: 'center' }, },
    { headerName: 'PRODUCT ID', field: 'product_id', width: 300, cellStyle: { textAlign: 'center' }, },
    { headerName: 'FREQUENCY', field: 'channel_freq', width: 200, cellStyle: { textAlign: 'center' },
    cellRenderer: (params: any) => `<span >${params.value ? params.value.toFixed(2) : '0.00'}</span> ` },
  ]
}
