import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { NewstreetComponent } from '../newstreet/newstreet.component';

@Component({
  selector: 'app-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.scss']
})
export class StreetComponent implements OnInit {
  editingRow: any;
  rowData: any[] = [];
  username: any;
  operatorid: any;
  role: any;
  area: any;
  id: any
  areaid: any;
  public rowSelection: any = "multiple";
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];

  IsOperator: boolean = false;
  Isuser: boolean = false;

  constructor(public dialogRef: MatDialogRef<StreetComponent>, private swal: SwalService, public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log(data);
    this.area = data.name;
    this.id = data.id;
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(this.role);

  }
  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80,
    },
    {
      headerName: 'STREET NAME', width: 400, editable: true,
      field: 'name',
    },
    {
      headerName: 'STATUS ', editable: true,
      field: 'statusdisplay', width: 300,
      cellRenderer: (params: { value: any; data: any }) => {
        const status = params.data?.statusdisplay;
        const color = status === 'Active' ? 'green' : 'red';
        const text = status === 'Active' ? 'Active' : 'Deactive';
        return `<span style="color: ${color}; ">${text}</span>`;
      }
    },
    {
      headerName: 'EDIT', width: 180,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        const isEditing = this.editingRow && this.editingRow.id === params.data.id;
        console.log(params.data.id);
        editButton.innerHTML = isEditing ? '<i class="fa-solid fa-check"></i>' : '<img src="/assets/images/icons/editstreet2.png" style="width:30px">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.editarea('editstreet', params.data);
        });
        const closeButton = document.createElement('button');
        if (isEditing) {
          closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          closeButton.style.marginLeft = '10px';
          closeButton.style.cursor = 'pointer';
          closeButton.style.backgroundColor = 'transparent';
          closeButton.style.border = 'none';
          closeButton.addEventListener('click', () => {
            this.editingRow = null;
            this.gridApi.refreshCells();
          });
        }

        const div = document.createElement('div');
        div.appendChild(editButton);
        if (isEditing) {
          div.appendChild(closeButton);
        }
        return div;
      }
    }
  ]
  columnDefs1: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80,
    },
    {
      headerName: 'AREA NAME', width: 300, editable: true,
      field: 'areaname',
    },
    {
      headerName: 'STREET NAME', width: 300, editable: true,
      field: 'name',
    },
    {
      headerName: 'STATUS ', editable: true,
      field: 'statusdisplay', width: 200,
      cellRenderer: (params: { value: any; data: any }) => {
        const status = params.data?.statusdisplay;
        const color = status === 'Active' ? 'green' : 'red';
        const text = status === 'Active' ? 'Active' : 'Deactive';
        return `<span style="color: ${color}; ">${text}</span>`;
      }
    },
    {
      headerName: 'EDIT', width: 80,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        const isEditing = this.editingRow && this.editingRow.id === params.data.id;
        console.log(params.data.id);
        editButton.innerHTML = isEditing ? '<i class="fa-solid fa-check"></i>' : '<img src="/assets/images/icons/editstreet2.png" style="width:30px">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.editarea('editstreet', params.data);
        });
        const closeButton = document.createElement('button');
        if (isEditing) {
          closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          closeButton.style.marginLeft = '10px';
          closeButton.style.cursor = 'pointer';
          closeButton.style.backgroundColor = 'transparent';
          closeButton.style.border = 'none';
          closeButton.addEventListener('click', () => {
            this.editingRow = null;
            this.gridApi.refreshCells();
          });
        }

        const div = document.createElement('div');
        div.appendChild(editButton);
        if (isEditing) {
          div.appendChild(closeButton);
        }
        return div;
      }
    }
  ]
  ngOnInit(): void {

    this.getstreetList();

    if (this.role === 'ROLE_ADMIN' || this.role === 'ROLE_SPECIAL') {
      this.Isuser = true;
      this.IsOperator = false;
      // this.getstreetList();
    } else if (this.role === 'ROLE_OPERATOR') {
      this.Isuser = false;
      this.IsOperator = true;
      // this.getLCOstreetList();
    }

  }
  getstreetList() {
    this.swal.Loading();
    this.userservice.getStreetListByAreaId(this.role, this.username, this.id).subscribe((data: any) => {
      if (data?.length > 0) {  
        this.rowData = data;
        this.areaid = data.find((item: any) => item)?.areaid;
      } else {
        this.swal.Error('Street list is empty.');
      }
      this.swal.Close();
    },
      (error) => {
        console.error('API Error:', error); 
        this.swal.Close();
        if (error.status === 204 || error.status === 404) {
          this.swal.Error('Street list not found.');
        } else {
          this.swal.Error(error?.error?.message || 'Something went wrong.');
        }
      })
  }

  getLCOstreetList() {
    console.log(this.id);
    this.swal.Loading();
    this.userservice.getOperatorAllStreetList(this.role, this.username, this.id).subscribe((data: any) => {
      this.rowData = data;
      this.areaid = data.find((item: any) => item)?.areaid;
      this.swal.Close();
    },
      (error) => {
        this.swal.Close();
        if (error.status === 204) {
          this.swal.Error('Street list not found.');
        } else {
          this.swal.Error(error?.error?.message || 'Something went wrong.');
        }
      })
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((row: any) => row.packageid);
      this.selectedname = selectedRows.map((row: any) => row.productname);

    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  saveRow(rowData: any) {

    const requestBody = {
      role: this.role,
      username: this.username,
      streetname: rowData.name,
      areaid: rowData.areaid,
      id: rowData.id,
      isdelete: rowData.isactive,
    };
    console.log(requestBody);

    this.userservice.updateStreet(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  newStreet(type: any): void {
    let dialogData = { areaid: this.areaid || this.id, type: type };
    console.log('AREA ID             ' + this.areaid);

    const dialogRef = this.dialog.open(NewstreetComponent, {
      width: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  editarea(type: any, data: any): void {
    let dialogData = { data: data, type: type };

    const dialogRef = this.dialog.open(NewstreetComponent, {
      width: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
