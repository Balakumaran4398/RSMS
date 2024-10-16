import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { CategoryDialogComponent } from '../_Dialogue/category_master/category-dialog/category-dialog.component';

interface updateRequestbody {
  name: any,
  username: any,
  role: any,
  isactive: boolean,
  id: any;
}
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
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
      // width: 180,
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
    this.userService.CategoryList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.rowData = data;
    })
  }

  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 140, headerCheckboxSelection: true,
      checkboxSelection: true,
    },

    {
      headerName: 'CATEGORY NAME',
      field: 'name',
      width: 340,
      editable: true,
      cellEditor: 'agTextCellEditor',
      onCellValueChanged: (event) => {
        console.log('Cell value changed:', event.data.name);
        this.updateDeviceModelname(event.data.name, event.data.isactive, event.data.id);
      }
    },

    {
      headerName: "ISACTIVE",
      field: 'isactive',
      width: 300,
      cellRenderer: (params: any) => {
        const isActive = params.data.isactive;
        const toggleButton = document.createElement('button');
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginRight = '6px';
        toggleButton.style.fontSize = '22px';
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
          const newIsActive = !params.data.isactive;
          params.data.isactive = newIsActive;
          updateButtonStyle(newIsActive);
          params.node.setDataValue('isactive', newIsActive);
          console.log('Toggle button clicked:', newIsActive);
          this.updateDeviceModelname(params.data.name, newIsActive, params.data.id);
        });

        const div = document.createElement('div');
        div.appendChild(toggleButton);
        return div;
      },
      cellEditor: 'agTextCellEditor',
      onCellValueChanged: (event) => {
        console.log('Cell value changed:', event.data.name);
        this.updateDeviceModelname(event.data.name, event.data.isactive, event.data.id);
      }
    }
  ]


  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
      console.log(this.selectedIds);
    }
  }

  updateDeviceModelname(name: string, isactive: boolean, id: number) {
    let requestBody: updateRequestbody = {
      name: name,
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
          text: 'Please wait while the Category is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.Category_update(requestBody).subscribe(
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
          text: 'Please wait while the Category is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.ActiveCategory(this.role, this.username, this.selectedIds).subscribe((res: any) => {
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
          text: 'Please wait while the Category is being deleted',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });

        this.userService.deleteCategory(this.role, this.username, this.selectedIds).subscribe((res: any) => {
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

  addnew(type: string): void {
    let dialogData = {};
    switch (type) {
      case 'category':
        dialogData = { iscategory: true };
        break;
      case 'broadcaster':
        dialogData = { isbroadcaster: true };
        break;
      case 'channeltype':
        dialogData = { ischanneltype: true };
        break;
      case 'distributor':
        dialogData = { isdistributor: true };
        break;
    }

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      // height: '200px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
