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
      floatingFilter: true,
      comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: boolean) => {
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
    paginationPageSizeSelector: [10,20,50],
    pagination: true,
  };
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
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }

  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, headerCheckboxSelection: true,
      checkboxSelection: true,filter: false
    },

    {
      headerName: 'CATEGORY NAME',
      field: 'name', 
      width: 600,
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellStyle: { textAlign: 'left'}, 
      // onCellValueChanged: (event) => {
      //   console.log('Cell value changed:', event.data.name);
      //   this.updateDeviceModelname(event.data.name, event.data.isactive, event.data.id);
      // },

      tooltipValueGetter: (params: any) => {
        return `Edit The Category: ${params.value || ''}`; 
      },
      onCellValueChanged: (event: any) => {
        console.log('Cell value changed:', event.data.name);
        this.updateDeviceModelname(event.data.name, event.data.isactive, event.data.id);
      },
      cellRenderer: (params: any) => {
        const toggleSwitch = document.createElement('div');
        toggleSwitch.textContent = params.value; 
        toggleSwitch.style.cursor = 'pointer'; 
        toggleSwitch.title = `Edit The Category: ${params.value || ''}`; 
        return toggleSwitch;
      }
    },

    {
      headerName: "ACTIVE STATUS",
      field: 'isactive',
      width: 600,
      cellRenderer: (params: any) => {
        var isActive = params.data.isactive;

        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.justifyContent = 'center';

        const toggleSwitch = document.createElement('div');
        toggleSwitch.style.width = '45px';
        toggleSwitch.style.height = '25px';
        toggleSwitch.style.borderRadius = '15px';
        toggleSwitch.style.backgroundColor = isActive ? 'var(--active-icon)' : 'rgb(115 115 115)';
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.cursor = 'pointer';
        toggleSwitch.style.transition = 'background-color 0.3s ease';

        const toggleCircle = document.createElement('div');
        toggleCircle.style.width = '15px';
        toggleCircle.style.height = '15px';
        toggleCircle.style.borderRadius = '50%';
        toggleCircle.style.backgroundColor = '#fff';
        toggleCircle.style.position = 'absolute';
        toggleCircle.style.top = '50%';
        toggleCircle.style.transform = 'translateY(-50%)';
        toggleCircle.style.left = isActive ? 'calc(100% - 22px)' : '3px';
        toggleCircle.style.transition = 'left 0.3s ease';

        toggleSwitch.appendChild(toggleCircle);
        toggleSwitch.addEventListener('click', () => {
          isActive = !isActive;
          console.log(isActive);

          toggleSwitch.style.backgroundColor = isActive ? '#93b6eb' : 'rgb(115 115 115)';

          toggleCircle.style.left = isActive ? 'calc(100% - 22px)' : '3px';

          console.log(params.data.id);
          if (isActive) {
            this.Active(params.data.id);
          } else {
            this.Deactive(params.data.id);
          }

        });
        // const updateToggleStyle = (active: boolean) => {
        //   toggleSwitch.style.backgroundColor = active ? '#4CAF50' : '#616060';
        //   toggleCircle.style.left = active ? 'calc(100% - 22px)' : '3px';
        //   toggleSwitch.title = active ? 'Deactivate the Customer' : 'Activate the Customer';
        // };

        // toggleSwitch.addEventListener('click', () => {
        //   const currentStatus = params.data.isactive;
        //   const newStatus = !currentStatus;
        //   params.data.isactive = newStatus; 
        //   updateToggleStyle(newStatus);

        //   console.log(`Status changed to: ${newStatus ? 'Active' : 'Inactive'}`);
        // });
        toggleContainer.appendChild(toggleSwitch);
        return toggleContainer;
      }



    }
  ]


  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
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

  Active(ids:any) {
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
  Deactive(ids:any) {
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
          text: 'Please wait while the Category is being Deactivated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });

        this.userService.deleteCategory(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Deactivated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.ngOnInit();
        }, (err: { error: { message: any; }; }) => {
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
