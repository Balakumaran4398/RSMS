import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lcodiscount',
  templateUrl: './lcodiscount.component.html',
  styleUrls: ['./lcodiscount.component.scss']
})
export class LcodiscountComponent implements OnInit {
  role: any;
  username: any;

  rowData: any[] = [];
  gridApi: any;

  columnDefs: any[] = [];

  type: any = 'All_area';

  selectedOption = '1';
  isTabDisabled = false;


  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
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
    paginationPageSize: 10,
    pagination: true,
    paginationPageSizeOptions: [5, 10, 15, 20, 25],
  }

  constructor(private userService: BaseService, private storageService: StorageService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }
  ngOnInit(): void {
    this.onColumnDefs();
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onRadioChange(event: any) {
    this.isTabDisabled = event.value === '2';
  }
  onTabChange(event: any) {
    const tabLabels = ["All_area", "area", "smartcard", "package"];
    this.type = tabLabels[event.index];
    this.onColumnDefs();
  }
  private onColumnDefs() {
    if (this.type == 'All_area') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, filter: false, },
        { headerName: 'PACKAGE NAME', width: 200, field: 'name', filter: true, },
        { headerName: 'CUSTOMER AMOUNT', width: 250, filter: false, },
        { headerName: 'LCO-COMMISION', width: 200, filter: false, },
        { headerName: 'MSO RATE', field: 'statusdisplay', width: 200, filter: false, },
        { headerName: 'DISCOUNT', width: 250, field: 'subscribercount', filter: true, },
        { headerName: 'CUSTOMER SELLING PRICE', field: 'pincode', width: 230, filter: true, },
        { headerName: 'ACTION', field: 'pincode', width: 150, filter: true, },
      ];
    } else if (this.type == 'area') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, filter: false, },
        { headerName: 'PACKAGE NAME', width: 200, field: 'name', filter: true, },
        { headerName: 'CUSTOMER AMOUNT', width: 250, filter: false, },
        { headerName: 'LCO-COMMISION', width: 200, filter: false, },
        { headerName: 'MSO RATE', field: 'statusdisplay', width: 200, filter: false, },
        { headerName: 'DISCOUNT', width: 250, field: 'subscribercount', filter: true, },
        { headerName: 'CUSTOMER SELLING PRICE', field: 'pincode', width: 230, filter: true, },
        { headerName: 'PINCODE', field: 'pincode', width: 150, filter: true, },
      ];
    } else if (this.type == 'smartcard') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, filter: false, },
        { headerName: "CUSTOMER NAME", valueGetter: 'node.rowIndex+1', width: 200, filter: false, },
        { headerName: 'AREA', width: 200, field: 'name', filter: true, },
        { headerName: 'MOBILE NUMBER', width: 250, filter: false, },
        { headerName: 'SMARTCARD', width: 200, filter: false, },
        { headerName: 'BOX ID', field: 'statusdisplay', width: 200, filter: false, },
        { headerName: 'CAS NAME', width: 250, field: 'subscribercount', filter: true, },
        { headerName: 'ACTION', field: 'pincode', width: 200, filter: true, },
      ];
    } else if (this.type == 'package') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, },
        { headerName: 'PACKAGE NAME', width: 300, field: 'name', filter: true, },
        { headerName: 'RATE', width: 300, filter: false, },
        { headerName: 'LCO-COMMISION', width: 300, filter: false, },
        { headerName: 'MSO RATE', field: 'statusdisplay', width: 300, filter: false, },
        { headerName: 'ACTION', field: 'pincode', width: 290, filter: true, },
      ];
    }
  }
}
