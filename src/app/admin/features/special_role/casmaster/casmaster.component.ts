import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { filter } from 'node_modules1/jszip';
import { MatDialog } from '@angular/material/dialog';
import { CasdialogueComponent } from '../Dialogue/casdialogue/casdialogue.component';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-casmaster',
  templateUrl: './casmaster.component.html',
  styleUrls: ['./casmaster.component.scss']
})
export class CasmasterComponent {
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
  rowData: any;

  role: any;
  username: any;
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectednames: any[] = [];
  selectedisactive: any[] = [];
  hasSelectedRows: boolean = true;
  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  columnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, },
    { headerName: "CAS ID", field: 'id' },
    { headerName: "CAS NAME", field: 'casname' },
    { headerName: "VENDOR", field: 'vendor' },
    { headerName: "ADDRESS", field: 'address' },
    { headerName: "SERVER IP", field: 'serverip' },
    { headerName: "SERVER PORT", field: 'serverport' },
    { headerName: "SMARTCARD LENGTH", field: 'smartcardlength' },
    { headerName: "BOX ID LENGTH", field: 'boxlength' },
    { headerName: "REFERENCE URL", field: 'referenceurl' },
    { headerName: "WEBSITE", field: 'website' },
    { headerName: "EMAIL", field: 'email' },
    { headerName: "CONTACT NO", field: 'contactno' },
    {
      headerName: "IS ACTIVE", field: 'isactive',
      // cellRebderer: (params: any) => [

      // ]
      cellRenderer: (params: any) => {
        const isActive = params.value;
        const color = isActive ? 'green' : 'red';
        return `<span style="color: ${color}; ">
                  ${isActive ? 'Active' : 'Deactive'}
                </span>`;
      }
    },
    {
      headerName: "", field: '', filter: false,
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
          this.opendialogue('editcasmaster', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
  ]

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log('selectedRows', selectedRows);

      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectednames = selectedRows.map((e: any) => e.casname);
      this.selectednames = selectedRows.map((e: any) => e.casname);
      console.log(this.selectedIds);
      console.log(this.selectednames);

    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.userservice.casmaster(this.role, this.username).subscribe((response: HttpResponse<any[]>) => {
      if (response.status === 200) {
        this.rowData = response.body;
        // this.swal.Success_200();
      } else if (response.status === 204) {
        this.swal.Success_204();
      }
    },
      (error) => {
        this.handleApiError(error);
      }
    );

  }
  handleApiError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }
  Active() {
    this.userservice.activeORDeactiveCas(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  Deactive() {
    this.userservice.activeORDeactiveCas(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  opendialogue(type: any, data: any) {
    let width = '800px';
    if (type === 'newcasmaster') {
      width = '800px';
    } else if (type === 'deletecasmaster') {
      width = '400px';
    } else if (type === 'editcasmaster') {
      width = '800px';
    }
    let dialogData = { type: type, id: this.selectedIds, casname: this.selectednames, data: data };
    console.log(dialogData);

    const dialogRef = this.dialog.open(CasdialogueComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
