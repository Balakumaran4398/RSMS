import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { CreateDistributorComponent } from '../_Dialogue/Distributor_dialog/create-distributor/create-distributor.component';
import { EditDistributorComponent } from '../_Dialogue/Distributor_dialog/edit-distributor/edit-distributor.component';
interface updateRequestbody {
  name: any,
  contact: any,
  address: any,
  email: any,
  role: any,
  username: any,
  isactive: boolean,
  id: number
}
@Component({
  selector: 'app-distributor-master',
  templateUrl: './distributor-master.component.html',
  styleUrls: ['./distributor-master.component.scss']
})
export class DistributorMasterComponent {
  rowData: any;
  username: any;
  role: any;
  isnew: boolean = false;
  isdelete: boolean = false;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
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
  type: number = 0;
  public rowSelection: any = "multiple";
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    this.userService.DistributorList(this.role, this.username, this.type).subscribe((data) => {
      this.rowData = data;
    })
  }
  enterPressed: boolean = false;
  columnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: "DISTRIBUTOR NAME", field: 'name', editable: true, cellEditor: 'agTextCellEditor', width: 300, },
    {
      headerName: "ISACTIVE",
      field: 'isactive',

      cellRenderer: (params: any) => {
        const isActive = params.data.isactive;
        const toggleButton = document.createElement('button');
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.marginRight = '6px';
        toggleButton.style.fontSize = '22px';
        toggleButton.style.cursor = 'auto';
        const icon = document.createElement('i');
        icon.className = 'fa';
        toggleButton.appendChild(icon);
        const updateButtonStyle = (active: boolean) => {
          if (active) {
            icon.className = 'fa-solid fa-toggle-on';
            toggleButton.style.color = '#4CAF50';
            toggleButton.style.fontSize = '24px'; // Medium size for the button
            icon.style.fontSize = '24px';
            toggleButton.title = 'Deactivate the Customer';
          } else {
            icon.className = 'fa-solid fa-toggle-off';
            toggleButton.style.color = 'rgb(248 92 133)';
            toggleButton.style.fontSize = '24px'; // Medium size for the button
            icon.style.fontSize = '24px';
            toggleButton.title = 'Activate the Customer';
          }
        };
        updateButtonStyle(isActive);
        toggleButton.addEventListener('click', () => {
        });

        const div = document.createElement('div');
        div.appendChild(toggleButton);
        return div;
      },
    },
    {
      headerName: "Edit", editable: true, cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(2 85 13)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "28px";
        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "DISTRIBUTOR ADDRESS", field: 'address', editable: true, cellEditor: 'agTextCellEditor', width: 300, },
    { headerName: "DISTRIBUTOR CONTACT", field: 'contact', editable: true, cellEditor: 'agTextCellEditor', width: 300 },
    { headerName: "DISTRIBUTOR EMAIL", field: 'email', editable: true, cellEditor: 'agTextCellEditor', width: 300, },
  ]


  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(EditDistributorComponent, {
      width: '500px',
      // height: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }




  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);

    }
  }
  addnew(type: string): void {
    let dialogData = {};
    switch (type) {
      case 'distributor':
        dialogData = { isdistributor: true };
        break;
    }
    const dialogRef = this.dialog.open(CreateDistributorComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  Active() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Active this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Active it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait while the Distributor is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.ActivateDistributor(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Activated!',
            text: res.message,
            icon: 'success'
          });
          this.ngOnInit();
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error'
          });
        });
      }
    });
  }
  Deactive() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while the Distributor is being deleted',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });

        this.userService.deleteDistributor(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
          this.ngOnInit();
        }, (err: { error: { message: any; }; }) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error'
          });
        });
      }
    });
  }
  updateDeviceModelname(distributor_name: string, distributor_contact: string, distributor_address: string, distributor_email: string, id: number, isactive: boolean) {
    let requestBody: updateRequestbody = {
      name: distributor_name,
      contact: distributor_contact,
      address: distributor_address,
      email: distributor_email,
      role: this.role,
      isactive: isactive,
      username: this.username,
      id: id
    };
    this.userService.Distributor_update(requestBody).subscribe(
      (res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your update was successful",
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          window.location.reload();
        });

      },
      (error) => {
        let errorMessage = 'Failed to update Distributor. Please try again.';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}
