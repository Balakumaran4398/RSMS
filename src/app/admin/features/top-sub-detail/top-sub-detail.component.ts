import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-top-sub-detail',
  templateUrl: './top-sub-detail.component.html',
  styleUrls: ['./top-sub-detail.component.scss']
})
export class TopSubDetailComponent {
  gridApi: any;
  username: any;
  role: any;
  rowData: any[] = [];
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      suppressCellSelection: true,
      width: 250,
      floatingFilter: true
    },
    headerComponentParams: { textAlign: 'center' },
    // pagination: true,
    // paginationPageSize: 13,
    autoHeight: true,
  }

  baseRowData: any[] = [];
  addonRowData: any[] = [];
  alacarteRowData: any[] = [];
  columnDefs: any[] = [
    { headerName: "PACKAGE NAME", field: 'productname', },
    { headerName: 'COUNT', field: 'count', },
  ];
  constructor(private userservise: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    userservise.getAllSubscriptionDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.baseRowData = data.baselist || [];
      this.addonRowData = data.addonlist || [];
      this.alacarteRowData = data.alacartelist || [];
    })
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
