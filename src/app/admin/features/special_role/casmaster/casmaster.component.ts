import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
// import { filter } from 'node_modules1/jszip';
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
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };
  rowData: any;

  role: any;
  username: any;
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectednames: any[] = [];
  selectedisactive: any;
  hasSelectedRows: boolean = true;
  userid: any;
  accessip: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
  }
  columnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, width: 100, filter: false },
    { headerName: "CAS ID", field: 'id' },
    { headerName: "CAS NAME", field: 'casname', cellStyle: { textAlign: 'left' } },
    { headerName: "VENDOR", field: 'vendor', cellStyle: { textAlign: 'left' } },
    { headerName: "ADDRESS", field: 'address', cellStyle: { textAlign: 'left' } },
    { headerName: "SERVER IP", field: 'serverip', cellStyle: { textAlign: 'left' } },
    { headerName: "SERVER PORT", field: 'serverport', cellStyle: { textAlign: 'left' } },
    { headerName: "SMARTCARD LENGTH", field: 'smartcardlength', cellStyle: { textAlign: 'left' } },
    { headerName: "BOX ID LENGTH", field: 'boxlength', cellStyle: { textAlign: 'left' } },
    { headerName: "REFERENCE URL", field: 'referenceurl', cellStyle: { textAlign: 'left' } },
    { headerName: "WEBSITE", field: 'website', cellStyle: { textAlign: 'left' } },
    { headerName: "EMAIL", field: 'email', cellStyle: { textAlign: 'left' } },
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
      headerName: "EDIT", field: '', filter: false,
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
      this.selectedisactive = selectedRows[0].isactive;
      console.log(this.selectedIds);
      console.log(this.selectednames);

    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.userservice.casmaster(this.role, this.username).subscribe((response: HttpResponse<any[]>) => {
      if (response.status === 200) {
        this.rowData = response.body;
        const rowCount = this.rowData.length;
        if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
          this.gridOptions.paginationPageSizeSelector.push(rowCount);
        }
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
    // this.userservice.activeORDeactiveCas(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
    //   // this.swal.success(res?.message);
    //   this.logCreate('CAS Master Active Button Clicked', !this.selectedisactive, 'Active');
    // }, (err) => {
    //   this.swal.Error(err?.error?.message);
    // });

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Active this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while the CAS Master is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.activeORDeactiveCas(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
          console.log(res);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your update was successful",
            showConfirmButton: false,
            timer: 1000
          });
          this.swal.success(res?.message);
          this.logCreate('CAS Master Active Button Clicked', !this.selectedisactive, 'Active');
        },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              window.location.reload();

            });
          }
        );
      }
    });
  }
  Deactive() {
    // this.userservice.activeORDeactiveCas(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
    //   // this.swal.success(res?.message);
    //   this.logCreate('CAS Master Deactive Button Clicked', !this.selectedisactive, 'Deactive');
    // }, (err) => {
    //   this.swal.Error(err?.error?.message);
    // });


    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deactive it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deactivating...',
          text: 'Please wait while the CAS Master is being Deactivated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.activeORDeactiveCas(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
          Swal.fire({
            title: 'Deactivated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.swal.success(res?.message);
          this.logCreate('CAS Master Deactive Button Clicked', !this.selectedisactive, 'Deactive');
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
          });
        });
      }
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
