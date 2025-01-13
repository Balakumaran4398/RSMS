import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-top-sub-detail',
  templateUrl: './top-sub-detail.component.html',
  styleUrls: ['./top-sub-detail.component.scss']
})
export class TopSubDetailComponent implements OnInit {
  gridApi: any;
  username: any;
  role: any;
  rowData: any[] = [];
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: false,
      filter: false,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },

    // pagination: true,
    // paginationPageSize: 13,
    autoHeight: true,
  }

  baseRowData: any[] = [];
  addonRowData: any[] = [];
  alacarteRowData: any[] = [];
  columnDefs: any[] = [
    { headerName: "PACKAGE NAME", field: 'productname', flex: 1, filter: true,  sortable: true, },
    {
      headerName: 'COUNT', field: 'count', flex: 1, filter: false,  sortable: true,

    },
  ];
  constructor(private userservise: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();

  }
  ngOnInit(): void {
    this.userservise.getAllSubscriptionDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.baseRowData = data.baselist || [];
      this.addonRowData = data.addonlist || [];
      this.alacarteRowData = data.alacartelist || [];
    })
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();

  }
}
