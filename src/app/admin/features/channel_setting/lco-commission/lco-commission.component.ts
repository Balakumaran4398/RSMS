import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLcoComponent } from '../_Dialogue/LCO-Commission/add-lco/add-lco.component';
import { CreateLcoComponent } from '../_Dialogue/LCO-Commission/create-lco/create-lco.component';
import { ChangeMembershipComponent } from '../_Dialogue/LCO-Commission/change-membership/change-membership.component';
import { UpdateLcoComponent } from '../_Dialogue/LCO-Commission/update-lco/update-lco.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { UpdateLcoCommissionComponent } from '../_Dialogue/LCO-Commission/update-lco-commission/update-lco-commission.component';
import { filter } from 'rxjs';
import { CreateLcoMembershipComponent } from '../_Dialogue/LCO-Commission/create-lco-membership/create-lco-membership.component';

@Component({
  selector: 'app-lco-commission',
  templateUrl: './lco-commission.component.html',
  styleUrls: ['./lco-commission.component.scss']
})
export class LcoCommissionComponent {

  role: any;
  username: any;
  rowData: any[] = [];
  rowData1: any[] = [];
  rowData2: any[] = [];
  rowData3: any[] = [];
  NotInLcogroupId: any[] = [];
  lcomembershipid: any = 0;
  lcomembershipList: any = 1;


  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];
  constructor(public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.lcomembershipList.sort((a: any, b: any) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      });
      console.log(this.lcomembershipList);

      this.lcomembershipid = this.lcomembershipList[0]?.value
      this.onoperatorchange("")
      this.onmembershipchange("")
    })
    this.LcoGroupDetails();
    // this.lcomembershipidNotInLcogroupId();
    this.getOperatorMembershipFUP();
  }
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
  create() {
    const dialogRef = this.dialog.open(CreateLcoMembershipComponent, {
      width: '500px',
      // height: '800px',
      panelClass: 'custom-dialog-container',

    });
  }
  public rowSelection: any = "multiple";
  gridOptions: any = {
    defaultany: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "PRODUCT NAME", field: 'productname', width: 200 },
    { headerName: "PRODUCT ID", field: 'productid', width: 150 },
    { headerName: "PRODUCT TYPE", field: 'productTypeDisplay', width: 150 },
    { headerName: "PRODUCT RATE", field: 'rate', width: 150 },
    {
      headerName: "EDIT", field: '', width: 100,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(2 85 13)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 220 },
    { headerName: "MSO AMOUNT", field: 'msoamount', width: 180 },
    { headerName: "COMMISSION", field: 'commissionvalue', width: 180 },
    {
      headerName: "	IS PERCENTAGE", field: 'ispercentage', width: 150,
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },

  ]

  columnDefs1: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: "GROUP NAME",
      field: 'groupName',
      width: 200,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "CREATED DATE",
      field: 'createdDate',
      width: 250,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "STATUS",
      field: 'isactiveDisplay',
      width: 200,
      filter: true,
      floatingFilter: true,
      cellRenderer: (params: any) => {
        if (params.value === 'Active') {
          return `<span style="color: green;">ACTIVE</span>`;
        } else {
          return `<span style="color: red;">DEACTIVE</span>`;
        }
      }
    }
  ];

  columnDefs2: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "GROUP NAME", field: 'operatorname', width: 250, },
    { headerName: "OPERATOR ID", field: 'operatorid', width: 220, },
    { headerName: "JOINING DATE", field: 'lcogroupupdateddate', width: 200, },
  ];
  columnDefs3: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "OPERATOR NAME", field: 'operatorname', width: 200 },
    {
      headerName: 'Actions', minWidth: 140,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pen" style="font-size:20px"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(37 144 147)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "22px";
        editButton.addEventListener('click', () => {
          this.EditmembershipDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "OPERATOR ID", field: 'operatorid', width: 250 },
    { headerName: "SHARE USED	", field: 'sharecount', width: 200 },
    { headerName: "MEMBERSHIP NAME", field: 'groupname', width: 250 },
    { headerName: "CREATED DATE", field: 'createddate', width: 200 },
    { headerName: "UPDATED DATE", field: 'updateddate', width: 200 },


  ]


  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }


  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((row: any) => row.operatorid); // Adjust 'id' to match your data structure
      this.selectedname = selectedRows.map((row: any) => row.operatorname); // Adjust 'name' to match your data structure
    }
  }



  change_membership() {
    const dialogRef = this.dialog.open(ChangeMembershipComponent, {
      width: '1200px',
      data: this.rows,
      panelClass: 'custom-dialog-container',
    });
  }

  Create_LCO(data: any) {
    const dialogRef = this.dialog.open(CreateLcoComponent, {
      width: '400px',
      height: '200px',
      panelClass: 'custom-dialog-container',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(UpdateLcoCommissionComponent, {
      width: '400px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  EditmembershipDialog(data: any): void {
    const dialogRef = this.dialog.open(UpdateLcoComponent, {
      width: '450px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + data);
    });
  }
  onoperatorchange(event: any) {
    if (this.lcomembershipid === '0') {
      this.lcomembershipid = 0;
    }
    this.userservice.getLcoCommissionListByLcoGroupId(this.role, this.username, this.lcomembershipid).subscribe(
      (data: any) => {
        console.log(data);
        this.rowData = data;
      },
      (error) => {
        console.error('Error fetching lcomembershipid details', error);
      }
    );
  }
  onmembershipchange(event: any) {
    this.userservice.getOperatorlistByGroupId(this.role, this.username, this.lcomembershipid).subscribe(
      (data: any) => {
        this.rowData2 = data;
      },
      (error) => {
        console.error('Error fetching lcomembershipid details', error);
      }
    );
  }
  LcoGroupDetails() {
    this.userservice.getLcoGroupDetails(this.role, this.username).subscribe((data: any) => {
      this.rowData1 = data
    })
  }
  // lcomembershipidNotInLcogroupId() {
  //   this.userservice.LcoGroupMasterListNotInLcogroupId(this.role, this.username).subscribe((data: any) => {
  //     this.NotInLcogroupId = data;

  //   })
  // }
  getOperatorMembershipFUP() {
    this.userservice.getOperatorMembershipFUP(this.role, this.username).subscribe((data: any) => {
      this.rowData3 = data;
    })
  }
}
