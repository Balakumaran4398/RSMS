import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { PackageplandialogueComponent } from '../Dialogue/packageplandialogue/packageplandialogue.component';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-packageplan',
  templateUrl: './packageplan.component.html',
  styleUrls: ['./packageplan.component.scss']
})
export class PackageplanComponent implements OnInit {
  modellist: any;
  rowData: any;
  isnew: boolean = false;
  isdelete: boolean = false;
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
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: 'COUNTRYNAME', field: 'planname', width: 250, },
    { headerName: 'DAYS', field: 'days', width: 250, },
    {
      headerName: 'IS ACTIVE', field: 'isactive', width: 250,
      cellRenderer: (params: { value: any; data: any }) => {
        const color = params.value ? 'green' : 'red';
        // const text = params.value ? 'True' : 'False' ;
        const text = params.value ?  'Active': 'Deactive' ;
        return `<span style="color: ${color}; ">${text}</span>`;
      }
    },
    {
      headerName: 'Edit', minWidth: 160,
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
          this.openaddedlogue('editpackageplan', params.data);
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
    this.userservice.getAllPackagePlanList(this.role, this.username).subscribe((data: any) => {
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

  Active() {
    this.swal.Loading();
    this.userservice.activeORDeactivePackagePlan(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
      // this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  Deactive() {
    this.swal.Loading();
    this.userservice.activeORDeactivePackagePlan(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
      // this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  openaddedlogue(type: any, data: any) {
    let width = '500px';
    if (type === 'new') {
      width = '500px';
    } else if (type === 'editpackageplan') {
      width = '500px';
    }
    let dialogData = { type: type, data: data, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(PackageplandialogueComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
