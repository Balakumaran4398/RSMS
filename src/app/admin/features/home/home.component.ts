import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  rowData: any[] = [];
  gridOptions = {
    defaultColDef: {
      // sortable: true,
      // resizable: true,
      // filter: true,
      // floatingFilter: true,
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
  columnnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: "CAS ID", cellStyle: { textAlign: 'left' },
      field: 'groupName',
      width: 100,
    },
    {
      headerName: "CAS NAME",
      field: 'createdDate',
      width: 150,
    },
    {
      headerName: "CONNECTION STATUS",
      field: 'createdDate',
      width: 190,
    },
    {
      headerName: "TOTAL STB`S",
      field: 'createdDate',
      width: 140,
     },
  ]
}
