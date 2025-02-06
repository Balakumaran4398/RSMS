import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { InventorycortonboxComponent } from '../Dialogue/inventorycortonbox/inventorycortonbox.component';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
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

  }
  ngOnInit(): void {
    this.userService.getInvent_License_Extend(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: ColDef[] = [
    { headerName: 'S.No', lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: 'ROLE', width: 500, field: 'role', cellStyle: { textAlign: 'left' }, },
    {
      headerName: 'STATUS',
      width: 470,
      field: 'valid',
      cellRenderer: (params: { value: any; data: any }) => {
        const color = params.value ? 'green' : 'red';
        const text = params.value ?  'Active': 'Deactive' ;
        return `<span style="color: ${color}; ">${text}</span>`;
      }
    },
    { headerName: 'LICENSE EXPIRY DATE', width: 500, field: 'expiryDate', },
  ]
  openDialoguePage(type: any) {
    let dialogData = {
      type:type,
      smartcard: ''
    };
    console.log(dialogData);
    const dialogRef = this.dialog.open(InventorycortonboxComponent, {
      data: dialogData,

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
