import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { InventorycortonboxComponent } from '../Dialogue/inventorycortonbox/inventorycortonbox.component';
import { SwalService } from 'src/app/_core/service/swal.service';
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
  toppings: any;
  filteredModel: any[] = [];
  cortonBoxList: any[] = [];
  toppingList: any[] = [];
  cortonBox: any = '';
  model: any;

  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  rows: any[] = [];
  selectedSmartcard: number[] = [];
  hasSelectedRows: boolean = true;
  isRowSelected: boolean = false;

  modelName: any;
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

  public rowSelection: any = "multiple";
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();

  }
  ngOnInit(): void {
    this.userService.getModelList(this.username, this.role).subscribe((data: any) => {
      // this.model = data;
      console.log(this.model);
      this.filteredModel = data;
      console.log(this.filteredModel);
    })
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
  }
  onModelList(event: any) {
    console.log(event);
    this.userService.getCortonBoxList(this.role, this.username, this.model).subscribe((data: any) => {
      console.log(data);
      this.cortonBoxList = data.map((item: any) => item.cartonbox);
      // this.cortonBoxList=[...this.toppingList]
    })
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedSmartcard = selectedRows.map((e: any) => e.smartcard);
      console.log("Selected Smartcard:", this.selectedSmartcard);
    }
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: ColDef[] = [
    { headerName: 'S.No', lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true, },
    { headerName: 'SMARTCARD', width: 300, field: 'smartcard', },
    { headerName: 'BOX_ID', width: 470, cellStyle: { textAlign: 'center' }, field: 'boxid', },
    { headerName: 'CARTONBOX NO', width: 200, field: 'cottonbox', },
    { headerName: 'MODEL', width: 300, field: 'model', },
    { headerName: 'CHIP ID', width: 200, field: 'chipid', },
  ]
  openDialoguePage(type: any) {
    let dialogData = {
      type: type,
      smartcard: this.selectedSmartcard
    };
    console.log(dialogData);
    const dialogRef = this.dialog.open(InventorycortonboxComponent, {
      data: dialogData,
      width: type === 'allocatted' ? '1010px' : 'auto',
      maxWidth: type === ' allocatted' ? '100vw' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


  submit() {
    console.log('22222222222');
    console.log(this.cortonBox);

    this.userService.getCortonBoxDetails(this.role, this.username, this.model, this.cortonBox)
      .subscribe((data: any) => {
        this.rowData = data;
        console.log(data);
        // this.swal.success(data?.message);
      }, (err) => {
        this.swal.Error3(err?.error?.message || err?.error);
      });
  }

  onCortonBoxChange(selectedValues: any[]) {
    console.log("Selected Values: ", selectedValues);
    this.cortonBox = selectedValues;
    console.log(this.cortonBox);

    // if (this.cortonBox.length > 0) {
    //     this.userService.getCortonBoxDetails(this.role, this.username, this.model, this.cortonBox)
    //         .subscribe((data: any) => {
    //             this.rowData = data;
    //             console.log("Response Data: ", data);
    //         }, (err) => {
    //             this.swal.Error3(err?.error?.message || err?.error);
    //         });
    // } else {
    //     console.log("No selection made!");
    // }
  }
}
