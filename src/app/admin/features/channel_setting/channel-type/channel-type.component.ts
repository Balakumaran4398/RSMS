import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { CreateChannelTypeComponent } from '../_Dialogue/channel_Type/create-channel-type/create-channel-type.component';
import { SwalService } from 'src/app/_core/service/swal.service';
interface updateRequestbody {
  name: any,
  username: any,
  role: any,
  isactive: boolean,
  id: any;
}
@Component({
  selector: 'app-channel-type',
  templateUrl: './channel-type.component.html',
  styleUrls: ['./channel-type.component.scss']
})
export class ChannelTypeComponent {
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
    paginationPageSize: 100,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  selectedName: any
  hasSelectedRows: boolean = true;
  type: number = 0;
  public rowSelection: any = "multiple";
  userid: any;
  accessip: any;
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
  }
  ngOnInit(): void {
    this.userService.ChannelTypeList(this.role, this.username, this.type).subscribe((data) => {
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }
  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true, width: 90, filter: false
    },
    {
      headerName: 'CHANNEL TYPE NAME', width: 600,
      field: 'name',
      cellStyle: { textAlign: 'left' },
      editable: true,
      cellEditor: 'agTextCellEditor',
      tooltipValueGetter: (params: any) => {
        return `Edit The Channel: ${params.value || ''}`;
      },
      onCellValueChanged: (event: any) => {
        console.log('Cell value changed:', event.data.name);
        this.updateDeviceModelname(event.data.name, event.data.isactive, event.data.id);
      },
      cellRenderer: (params: any) => {
        const toggleSwitch = document.createElement('div');
        toggleSwitch.textContent = params.value;
        toggleSwitch.style.cursor = 'pointer';
        toggleSwitch.title = `Edit The Channel: ${params.value || ''}`;
        return toggleSwitch;
      }
    },

    {
      headerName: "STATUS",
      field: 'isactive',
      width: 870,
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
          toggleSwitch.style.backgroundColor = isActive ? '#93b6eb' : 'rgb(115 115 115)';
          toggleCircle.style.left = isActive ? 'calc(100% - 22px)' : '3px';

          if (isActive) {
            this.Active(params.data.id, params.data.isactive);
          } else {
            this.Deactive(params.data.id, params.data.isactive);
          }
        });
        toggleContainer.appendChild(toggleSwitch);
        return toggleContainer;
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
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows[0].isactive;
      this.selectedName = selectedRows[0].name;
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
        this.swal.Loading();
        this.userService.ChannelType_update(requestBody).subscribe(
          (res: any) => {
            this.swal.success(res?.message);
            // this.logCreate('ChannelType `${name}` name changed', name, this.selectedName);
            this.logCreate(`ChannelType [${this.selectedName}] name changed`, name, this.selectedName);

          },
          (err) => {
            this.swal.Error(err?.errror?.message);
          }
        );
      }
    });
  }
  adddelete1() {
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
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while the Channel Type is being deleted',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      if (result.isConfirmed) {
        this.userService.deleteChannelType(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          this.swal.success(res?.message);
        }, err => {
          this.swal.Error(err?.error?.message);
        });
      };
    });
  }
  Active(ids: any, status: any) {
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
        this.swal.Loading();
        this.userService.ActiveChannelTpe(this.role, this.username, ids).subscribe((res: any) => {
          this.swal.success(res?.message);
          this.logCreate('ChannelType Active Button Clicked', !this.selectedtypes, 'Active');
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });

  }
  Deactive(ids: any, status: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deactivate it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.swal.Loading();
        this.userService.deleteChannelType(this.role, this.username, ids).subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });
    this.logCreate('ChannelType Active Button Clicked', this.selectedtypes, 'Deactive');
  }
  addnew(): void {
    let dialogData = {};
    const dialogRef = this.dialog.open(CreateChannelTypeComponent, {
      width: '400px',
      // height: '200px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
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
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}
