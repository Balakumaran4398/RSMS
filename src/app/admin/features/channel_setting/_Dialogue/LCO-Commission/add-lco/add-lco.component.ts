import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-add-lco',
  templateUrl: './add-lco.component.html',
  styleUrls: ['./add-lco.component.scss']
})
export class AddLcoComponent {
  constructor(
    public dialogRef: MatDialogRef<AddLcoComponent>) {
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  gridOptions = {
    defaultColDef: {

    },

  }
 
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, cellClass: 'locked-col', width: 100 },
    { headerName: "PRODUCT NAME", field: 'name', },
    { headerName: "PRODUCT ID", field: 'city', },
    { headerName: "PRODUCT TYPE", field: 'name', },
    { headerName: "CUSTOMER AMOUNT", field: 'city', },
    { headerName: "MSO AMOUNT", field: 'name', },
    { headerName: "COMMISSION", field: 'city', },
    { headerName: "	IS PERCENTAGE", field: 'name', },
    { headerName: "EDIT", field: 'city', },
  ]
  rowData = [
    // { name: 'John Doe', city: 'New York' },
    // { name: 'Jane Smith', city: 'Los Angeles' },
    // { name: 'Mike Johnson', city: 'Chicago' }
  ];
}
