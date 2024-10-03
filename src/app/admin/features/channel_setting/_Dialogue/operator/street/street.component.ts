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
  constructor(public dialogRef: MatDialogRef<StreetComponent>, private swal: SwalService, public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log(data);
    this.area = data.name;
    this.id = data.id;
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, headerCheckboxSelection: true,
      checkboxSelection: true
    },
    {
      headerName: 'STREET NAME', width: 160, editable: true,
      field: 'name',
    },
    {
      headerName: 'STATUS ', editable: true,
      field: 'statusdisplay', width: 150
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
          // if (isEditing) {
            this.saveRow(params.data);
            console.log(params.data);
          // }
          // else {
          //   this.editingRow = { ...params.data };
          //   this.gridApi.refreshCells();
          // }
        });

        const closeButton = document.createElement('button');
        if (isEditing) {
          closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          closeButton.style.marginLeft = '10px';
          closeButton.style.cursor = 'pointer';
          closeButton.style.backgroundColor = 'transparent';
          closeButton.style.border = 'none';
          // closeButton.addEventListener('click', () => {
          //   this.saveRow(params.data);
          // });
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
    this.userservice.getStreetListByAreaId(this.role, this.username, this.id).subscribe((data: any) => {
      this.rowData = data;
      // this.areaid = data.map((item: any) => item.areaid);
      this.areaid = data.find((item: any) => item)?.areaid;
      console.log(this.areaid);

      console.log(this.rowData);

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
      isactive: rowData.isactive,
    };

    this.userservice.updateStreet(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  newStreet(): void {
    let dialogData = { areaid: this.areaid };

    const dialogRef = this.dialog.open(NewstreetComponent, {
      width: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
