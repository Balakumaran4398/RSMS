import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-logmaintain',
  templateUrl: './logmaintain.component.html',
  styleUrls: ['./logmaintain.component.scss']
})
export class LogmaintainComponent implements OnInit {


  public rowSelection: any = "multiple";
  rowData: any[] = [];
  gridApi: any;

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };
  ngOnInit(): void {

  }
  columnDefs: ColDef[] = [
    { headerName: 'S.NO', valueGetter: 'node.rowIndex+1', width: 100, filter: false },
    // { headerCheckboxSelection: true, headerName: 'S.NO', valueGetter: 'node.rowIndex+1', checkboxSelection: true, width: 100, filter: false },
    {
      headerName: 'SMARTCARD', width: 250,
      field: 'smartcard',

    },
    {
      headerName: 'BOX_ID', width: 250, cellStyle: { textAlign: 'left' },
      field: 'boxid',
    },
    {
      headerName: 'CARTON BOX', width: 220, cellStyle: { textAlign: 'center' },
      field: 'cottonbox',
    },

    {
      headerName: 'IS_ALLOCATED',
      field: 'isallocated', width: 200, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'DE_ALLOCATED', width: 200, cellStyle: { textAlign: 'center' },
      field: 'deallocateddisplay',
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
      },
    },
    {
      headerName: 'IS_DEFECTIVE',
      field: 'defectivedisplay', width: 200, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
      },
    },

  ]
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
}
