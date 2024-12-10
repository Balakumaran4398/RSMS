import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { BroadCreateDialogComponent } from '../_Dialogue/broad-create-dialog/broad-create-dialog.component';
interface updateRequestbody {
  broadcastername: any,
  username: any,
  role: any,
  isactive: boolean,
  id: any;
}
@Component({
  selector: 'app-broad-master',
  templateUrl: './broad-master.component.html',
  styleUrls: ['./broad-master.component.scss']
})
export class BroadMasterComponent implements OnInit {
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
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }

  ngOnInit(): void {
    this.userService.BroadcasterList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.rowData = data;
    })
  }



  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: 'BroadCaster Name',
      field: 'broadcastername',
      width: 690,
      editable: true,
      cellEditor: 'agTextCellEditor',
      onCellValueChanged: (event: { data: { broadcastername: string; isactive: boolean; id: number; }; }) => {
        console.log('Cell value changed:', event.data.broadcastername);
        this.updateDeviceModelname(event.data.broadcastername, event.data.isactive, event.data.id);
      }
    },
    {
      headerName: "ISACTIVE",
      field: 'isactive',
      width: 600,
      cellRenderer: (params: any) => {
        const isActive = params.data.isactive;
        const toggleButton = document.createElement('button');
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '22px';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';
        const icon = document.createElement('i');
        icon.className = 'fa';
        toggleButton.appendChild(icon);
        const updateButtonStyle = (active: boolean) => {
          if (active) {
            icon.className = 'fa-solid fa-toggle-on';
            toggleButton.style.color = '#4CAF50';
            toggleButton.style.fontSize = '24px';
            icon.style.fontSize = '24px';
            toggleButton.title = 'Deactivate the Customer';
          } else {
            icon.className = 'fa-solid fa-toggle-off';
            toggleButton.style.color = 'rgb(248 92 133)';
            toggleButton.style.fontSize = '24px';
            icon.style.fontSize = '24px';
            toggleButton.title = 'Activate the Customer';
          }
        };

        updateButtonStyle(isActive);
        toggleButton.addEventListener('click', () => {
          const newIsActive = !params.data.isactive;
          params.data.isactive = newIsActive;
          updateButtonStyle(newIsActive);
          params.node.setDataValue('isactive', newIsActive);
          console.log('Toggle button clicked:', newIsActive);
          this.updateDeviceModelname(params.data.broadcastername, newIsActive, params.data.id);
        });

        const div = document.createElement('div');
        div.style.display = 'flex';
        // div.style.alignItems = 'center';
        // div.style.justifyContent = 'center';
        div.appendChild(toggleButton);
        return div;
      },
      cellEditor: 'agTextCellEditor',
      onCellValueChanged: (event: { data: { broadcastername: string; isactive: boolean; id: number; }; }) => {
        console.log('Cell value changed:', event.data.broadcastername);
        this.updateDeviceModelname(event.data.broadcastername, event.data.isactive, event.data.id);
      }
    },

  ]

  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);

      // Extracting IDs from selected rows
      this.selectedIds = selectedRows.map((e: any) => e.id);

      // Extracting 'isactive' from selected rows
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);

      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected Types:", this.selectedtypes);
    }
  }

  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(BroadCreateDialogComponent, {
      width: '500px',
      height: '580px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  updateDeviceModelname(broadcastername: string, isactive: boolean, id: number) {
    let requestBody: updateRequestbody = {
      broadcastername: broadcastername,
      username: this.username,
      role: this.role,
      isactive: isactive,
      id: id
    };
    console.log(requestBody);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while the Broadcaster is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.Broadcaster_update(requestBody).subscribe(
          (res) => {
            console.log(res);
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
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
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
          text: 'Please wait while the Broadcaster is being deleted',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });

        this.userService.deleteBroadcaster(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.ngOnInit();
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
          text: 'Please wait while the Broadcaster is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.ActiveBroadcaster(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Activated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.ngOnInit();
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

  addnew(): void {
    let dialogData = {};
    // switch (type) {
    //   case 'broadcaster':
    //     dialogData = { isbroadcaster: true };
    //     break;
    // }
    const dialogRef = this.dialog.open(BroadCreateDialogComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  reloadData() {
    window.location.reload();
  }
}
