import { Component } from '@angular/core';
import { AdsdialogueComponent } from '../Dialogue/adsdialogue/adsdialogue.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-adsdetails',
  templateUrl: './adsdetails.component.html',
  styleUrls: ['./adsdetails.component.scss']
})
export class AdsdetailsComponent {
  rowData: any[]=[];
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
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', filter: false
    },
    { headerName: 'AD NAME', field: 'adName', width: 200, },
    { headerName: 'AD URL', field: 'adUrl', width: 400, },
    { headerName: 'SITE URL	', field: 'siteUrl', width: 300, filter: false },
    {
      headerName: 'IS ACTIVE', field: 'statusdisplay', width: 250,
      cellRenderer: (params: { value: any; data: any }) => {
        const isActive = params.value === 'Active';
        const color = isActive ? 'green' : 'red';
        const text = isActive ? 'Active' : 'Deactive';
        return `<span style="color: ${color};">${text}</span>`;
      }
    },
    {
      headerName: 'ACTION', minWidth: 140, filter: false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(1 31 78)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openaddedlogue('editAdd', params.data);
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
    this.userservice.getAllAdMasterList(this.role, this.username).subscribe((data: any) => {
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
    if (type === 'createadd') {
      width = '500px';
    } else if (type === 'editAdd') {
      width = '500px';
    }
    let dialogData = { type: type, data: data, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(AdsdialogueComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
