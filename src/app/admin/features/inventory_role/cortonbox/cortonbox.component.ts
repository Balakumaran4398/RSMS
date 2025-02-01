import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-cortonbox',
  templateUrl: './cortonbox.component.html',
  styleUrls: ['./cortonbox.component.scss']
})
export class CortonboxComponent {
  username: any;
  role: any;
  cas: any;

  rowData: any[] = [];
  gridApi: any;



  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      width: 250,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userService.Not_Allocated(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data[0].notallocatedsmartcard;
      // this.lco_list = data[0].operatorid;
      // this.caslist = data[0].castype;
      // this.isemi = data[0].isemi;
    })
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: ColDef[] = [
    { headerName: 'S.No', lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: 'SMARTCARD', width: 300, field: 'smartcard', },
    { headerName: 'BOX_ID', width: 470, cellStyle: { textAlign: 'center' }, field: 'boxid', },
    { headerName: 'CARTONBOX NO', width:200, field: 'cottonbox', },
    { headerName: 'MODEL', width: 300, field: 'cottonbox', },
    { headerName: 'CHIP ID', width: 200, field: 'cottonbox', },
  ]

}
