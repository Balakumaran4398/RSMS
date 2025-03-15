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
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;
  
        if (isNumberA && isNumberB) {
          return valueA - valueB; 
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          return normalizedA.localeCompare(normalizedB); 
        }
      },
      filterParams: {
        textFormatter: (value: string) => {
          return value ? value.toString().toLowerCase() : '';
        },
        debounceMs: 200, 
      },
    },
    paginationPageSize: 10,
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
    this.userService.DistributorList(this.role, this.username, this.type).subscribe((data) => {
      this.rowData = data;
    })
  }
  enterPressed: boolean = false;
  columnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, checkboxSelection: true, filter: false },
    { headerName: "DISTRIBUTOR NAME", field: 'name', cellEditor: 'agTextCellEditor', width: 300, cellStyle: { textAlign: 'left' }, },
    {
      headerName: "STATUS",
      field: 'isactive',
      cellRenderer: (params: any) => {
        const isActive = params.data.isactive;
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
        toggleContainer.appendChild(toggleSwitch);
        return toggleContainer;
      }
    },
    {
      headerName: "Edit", cellStyle: { textAlign: 'center' }, width: 190, cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        // editButton.style.color = 'rgb(64 113 114)';
        editButton.style.color = 'var(--active-edit-icon)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "DISTRIBUTOR ADDRESS", field: 'address', editable: true, cellEditor: 'agTextCellEditor', width: 200, cellStyle: { textAlign: 'left' }, },
    { headerName: "DISTRIBUTOR CONTACT", field: 'contact', cellEditor: 'agTextCellEditor', width: 200 },
    { headerName: "DISTRIBUTOR EMAIL", field: 'email', cellEditor: 'agTextCellEditor', width: 260, cellStyle: { textAlign: 'left' }, },
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
  Deactive() {
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
          text: 'Please wait while the Distributor is being Deactivated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });

        this.userService.deleteDistributor(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Deactivated!',
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
