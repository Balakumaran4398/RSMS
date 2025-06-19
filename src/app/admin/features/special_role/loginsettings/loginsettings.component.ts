import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { LogindialogueComponent } from '../Dialogue/logindialogue/logindialogue.component';
import { EditDismembershipComponent } from '../../channel_setting/_Dialogue/LCO-Commission/edit-dismembership/edit-dismembership.component';
import { SidenavpermissionComponent } from '../Dialogue/sidenavpermission/sidenavpermission.component';

@Component({
  selector: 'app-loginsettings',
  templateUrl: './loginsettings.component.html',
  styleUrls: ['./loginsettings.component.scss']
})
export class LoginsettingsComponent {
  rowData: any;
  public rowSelection: any = "multiple";

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  }

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  id: any;
  role: any;
  userid: any;
  accessip: any;
  type: number = 0;

  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService, private swal: SwalService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    console.log('role', this.role);


  }
  columnDefs: any[] = [
    {
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
    },
    { headerName: 'USER NAME	', field: 'username', width: 200, cellStyle: { textAlign: 'left' } },
    { headerName: 'PASSWORD	', field: 'password', width: 250, cellStyle: { textAlign: 'left' } },
    // { headerName: 'ROLE	', field: 'rolename', width: 150, filter: false, cellStyle: { textAlign: 'left' } },
    { headerName: 'ROLE	', field: 'role', width: 150, filter: false, cellStyle: { textAlign: 'left' } },
    { headerName: 'EXPIRY DATE', field: 'expiryDate', width: 200, },
    {
      headerName: 'STATUS', field: 'valid', width: 130, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: { value: any; data: any }) => {
        const color = params.value ? 'green' : 'red';
        const text = params.value ? 'Active' : 'Deactive';
        return `<span style="color: ${color};">${text}</span>`;
      }
    },
    { headerName: 'CREATED DATE	', field: 'createdDate', width: 200, },
    {
      headerName: 'ACTION', width: 150, filter: false, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(1 31 78)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Username and Password';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openaddedlogue('editlogin', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
 
    {
      headerName: "CHANGE SIDENAV", width: 200,
      cellRenderer: (params: any) => {
        const allowedRoles = ['Admin', 'Special', 'Reception', 'cus_service', 'service_center'];

        if (!allowedRoles.includes(params.data.role)) {
          return '';
        }

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-list" style="font-size:25px;color:#035678"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(29 1 11)';
        editButton.style.border = 'none';
        editButton.title = 'Operator List';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';

        editButton.addEventListener('click', () => {
          this.openEditDismembershipDialog(params.data);
        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    }

  ];
  openEditDismembershipDialog(data: any) {
    console.log(data);

    const dialogRef = this.dialog.open(SidenavpermissionComponent, {
      width: '800px',
      // height: '1000px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }
  ngOnInit(): void {
    this.userservice.getInvent_License_Extend(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    // this.userservice.getAllLoginList(this.role, this.username).subscribe((data: any) => {
    //   this.rowData = data;
    // })
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }


  Active() { }
  Deactive() { }
  openaddedlogue(type: any, data: any) {
    let width = '500px';
    if (type === 'newlogin') {
      width = '500px';
    } else if (type === 'editlogin') {
      width = '500px';
    }
    let dialogData = { type: type, data: data, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(LogindialogueComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);
    })
  }
}
