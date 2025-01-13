import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { LogindialogueComponent } from '../Dialogue/logindialogue/logindialogue.component';

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
  type: number = 0;
  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService, private swal: SwalService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  columnDefs: any[] = [
    {
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1',
    },
    { headerName: 'USER NAME	', field: 'username', width: 250, },
    { headerName: 'PASSWORD	', field: 'password', width: 350, },
    { headerName: 'ROLE	', field: 'rolename', width: 150, filter: false },
    { headerName: 'EXPIRY DATE', field: 'expirydate', width: 150, },
    {
      headerName: 'STATUS', field: 'statusdisplay', width: 250,
      cellRenderer: (params: { value: any; data: any }) => {
        const color = params.value ? 'green' : 'red';
        const text = params.value ? 'Active' : 'Deactive';
        return `<span style="color: ${color};">${text}</span>`;
      }
    },
    { headerName: 'CREATED DATE	', field: 'createddate', width: 150, },
    {
      headerName: 'ACTION', minWidth: 140, filter: false,
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
  ];
  ngOnInit(): void {
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.userservice.getAllLoginList(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
    })
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
}
