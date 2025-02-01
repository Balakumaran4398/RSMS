import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { InventoryloginComponent } from '../Dialogue/inventorylogin/inventorylogin.component';

@Component({
  selector: 'app-inventoryrole',
  templateUrl: './inventoryrole.component.html',
  styleUrls: ['./inventoryrole.component.scss']
})
export class InventoryroleComponent {
  username: any;
  role: any;
  cas: any;

  rowData: any[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectsmartcard: number[] = [];
  selectedtypes: number[] = [];
  selectedisEmi: boolean = false;
  hasSelectedRows: boolean = true;


  public rowSelection: any = "multiple";
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

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectsmartcard = selectedRows.map((e: any) => e.smartcard);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
      this.selectedisEmi = selectedRows.map((e: any) => e.isemi);
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100,
    },
    {
      headerName: 'SMARTCARD', width: 400,
      field: 'smartcard',
    },
    {
      headerName: 'BOX_ID', width: 400, cellStyle: { textAlign: 'center' },
      field: 'boxid',
    },
    {
      headerName: 'MODEL', width: 340,
      field: 'cottonbox',

    },
    {
      headerName: 'CHIP ID', width: 330, cellStyle: { textAlign: 'center' },
      field: 'casname',
    }
  ]
  openLoginPage(){
     const dialogRef = this.dialog.open(InventoryloginComponent, {
          // data: dialogData,
         
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);
        });
  }
}
