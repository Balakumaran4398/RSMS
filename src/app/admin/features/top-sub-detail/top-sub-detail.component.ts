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
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return Number(valueA) - Number(valueB); 
        }
        if (!valueA) valueA = '';
        if (!valueB) valueB = '';
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
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
    { headerName: "PACKAGE NAME", field: 'productname', width: 350, filter: true, },
    { headerName: 'COUNT', field: 'count', width: 150, filter: false,
      
     },
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
  ngOnInit(): void {

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
