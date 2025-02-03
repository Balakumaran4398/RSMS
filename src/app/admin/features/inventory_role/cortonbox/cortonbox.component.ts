import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { InventorycortonboxComponent } from '../Dialogue/inventorycortonbox/inventorycortonbox.component';
declare var $: any;
@Component({
  selector: 'app-cortonbox',
  templateUrl: './cortonbox.component.html',
  styleUrls: ['./cortonbox.component.scss']
})
export class CortonboxComponent implements OnInit {
  username: any;
  role: any;
  cas: any;

  rowData: any[] = [];
  gridApi: any;

  filteredModel: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  model: any;

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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit() {
    $('#model').select2({
      placeholder: 'Select Model',
      allowClear: true
    });
    $('#model').on('change', (event: any) => {
      this.model = event.target.value;
      this.onModelList(this.model);
    });
    $('#modelList').select2({
      placeholder: 'Select ModelList',
      allowClear: true
    });
    $('#modelList').on('change', (event: any) => {
      this.model = event.target.value;
      this.onModelList(this.model);
    });
  }
  onModelList(event: any) {
    console.log(event);

  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: ColDef[] = [
    { headerName: 'S.No', lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: 'SMARTCARD', width: 300, field: 'smartcard', },
    { headerName: 'BOX_ID', width: 470, cellStyle: { textAlign: 'center' }, field: 'boxid', },
    { headerName: 'CARTONBOX NO', width: 200, field: 'cottonbox', },
    { headerName: 'MODEL', width: 300, field: 'cottonbox', },
    { headerName: 'CHIP ID', width: 200, field: 'cottonbox', },
  ]
  openDialoguePage(type: any) {
    let dialogData = type;
    console.log(dialogData);
    const dialogRef = this.dialog.open(InventorycortonboxComponent, {
      data: dialogData,
      width: type === 'allocatted' ? '990px' : 'auto',
      maxWidth:type === ' allocatted' ? '100vw': 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  submit() {

  }
}
