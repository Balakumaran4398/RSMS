import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-change-membership',
  templateUrl: './change-membership.component.html',
  styleUrls: ['./change-membership.component.scss']
})
export class ChangeMembershipComponent {
  lcoForm !: FormGroup<any>;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeMembershipComponent>) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,

      floatingFilter: true
    },

  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    { headerName: "PRODUCT NAME", field: 'name', width: 450 },

  ]
  rowData = [

  ];
  change() {
    console.log('Success');

  }
  ngOnInit(): void {
    this.lcoForm = this.fb.group({
      usedCount: [''],
      sharedCount: [''],
      selectMembership: ['']
    });
  }
}
