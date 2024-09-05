import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLcoComponent } from '../_Dialogue/LCO-Commission/add-lco/add-lco.component';
import { CreateLcoComponent } from '../_Dialogue/LCO-Commission/create-lco/create-lco.component';
import { ChangeMembershipComponent } from '../_Dialogue/LCO-Commission/change-membership/change-membership.component';
import { UpdateLcoComponent } from '../_Dialogue/LCO-Commission/update-lco/update-lco.component';

@Component({
  selector: 'app-lco-commission',
  templateUrl: './lco-commission.component.html',
  styleUrls: ['./lco-commission.component.scss']
})
export class LcoCommissionComponent {
  constructor(public dialog: MatDialog) { }
  selectedTab: string = 'commission';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  add() {
    const dialogRef = this.dialog.open(AddLcoComponent, {
      width: '1800px',
      // height: '800px',
      panelClass: 'custom-dialog-container',

    });

  
  }
  gridOptions:any = {
    defaultany: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 180,
      floatingFilter: true
    },
    // paginationPageSize: 10,
    // pagination: true,
  }

  domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,  
    },
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
    { name: 'John Doe', city: 'New York' },
    { name: 'Jane Smith', city: 'Los Angeles' },
    { name: 'Mike Johnson', city: 'Chicago' }
  ];
  columnDefs1: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    { headerName: "OPERATOR NAME", field: 'name', width: 200 },
    { headerName: "OPERATOR ID", field: 'city', width: 250 },
    { headerName: "JOINING DATE", field: 'name', width: 200 },
  ]
  rowData1 = [
    { name: 'John Doe', city: 'New York' },
    { name: 'Jane Smith', city: 'Los Angeles' },
    { name: 'Mike Johnson', city: 'Chicago' }
  ];
  columnDefs2: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    { headerName: "OPERATOR NAME", field: 'name', width: 200 },
    { headerName: "OPERATOR ID", field: 'city', width: 250 },
    { headerName: "SHARE USED	", field: 'name', width: 200 },
    { headerName: "MEMBERSHIP NAME", field: 'city', width: 250 },
    { headerName: "CREATED DATE", field: 'name', width: 200 },
    { headerName: "UPDATED DATE", field: 'name', width: 200 },
    {
      headerName: 'Actions', minWidth: 140,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-edit"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '#E545D1';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "22px";

        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },

  ]
  rowData2 = [
    { name: 'John Doe', city: 'New York' },
    { name: 'Jane Smith', city: 'Los Angeles' },
    { name: 'Mike Johnson', city: 'Chicago' }
  ];
  Create_LCO() {
    const dialogRef = this.dialog.open(CreateLcoComponent, {
      width: '400px',
      height: '200px',
      panelClass: 'custom-dialog-container',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  change_membership() {
    const dialogRef = this.dialog.open(ChangeMembershipComponent, {
      width: '1200px',
      // height: '500px',
      panelClass: 'custom-dialog-container',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(UpdateLcoComponent, {
      width: '400px',
      // height: '350px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
