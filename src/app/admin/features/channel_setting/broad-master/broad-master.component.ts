import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { BroadCreateDialogComponent } from '../_Dialogue/broad-create-dialog/broad-create-dialog.component';
import { Tooltip } from 'chart.js';
import { TooltipPosition } from 'ag-charts-community/dist/types/src/module-support';
import { filter } from 'rxjs';
import { SwalService } from 'src/app/_core/service/swal.service';
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
    paginationPageSize: 100,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };


  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  selectedtstatus: any;
  hasSelectedRows: boolean = true;
  username: any;
  selectCount: any;
  id: any;
  role: any;
  userid: any;
  accessip: any;
  type: number = 0;
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    console.log('userid', this.userid);
    console.log('accessip', this.accessip);
  }

  ngOnInit(): void {
    this.userService.BroadcasterList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }
  status: any;
  columnDefs: any[] = [
    {
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false, width: 150,
      checkboxSelection: true,
    },

    {
      headerName: 'BROADCASTER NAME',
      field: 'broadcastername', width: 550,

      cellStyle: { textAlign: 'left', },
      editable: true,
      cellEditor: 'agTextCellEditor',
      tooltipValueGetter: (params: any) => {
        return `Edit The Broadcaster: ${params.value || ''}`;
      },
      onCellValueChanged: (event: any) => {
        console.log('Cell value changed:', event.data.name);
        this.updateDeviceModelname(event.data.broadcastername, event.data.isactive, event.data.id);
      },
      cellRenderer: (params: any) => {
        const toggleSwitch = document.createElement('div');
        toggleSwitch.textContent = params.value;
        toggleSwitch.style.cursor = 'pointer';
        toggleSwitch.title = `Edit The Broadcaster: ${params.value || ''}`;
        return toggleSwitch;
      }
    },
    {
      headerName: "STATUS",
      field: 'isactive', width: 500,
      cellStyle: { textAlign: 'center' },
      filter: false,
      cellRenderer: (params: any) => {
        var isActive = params.data.isactive;
        this.status = isActive;

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
            this.Active(params.data.id, params.data.statusdisplay);
          } else {
            this.Deactive(params.data.id, params.data.statusdisplay);
          }

        });
        toggleContainer.appendChild(toggleSwitch);
        return toggleContainer;
      }
    },

  ]

  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }
  oldbroadcastorName: any;
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.oldbroadcastorName = selectedRows[0].broadcastername;
      console.log(this.oldbroadcastorName);
      this.selectCount = selectedRows.length
      // Extracting IDs from selected rows
      this.selectedIds = selectedRows.map((e: any) => e.id);

      // Extracting 'isactive' from selected rows
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
      // this.selectedtstatus = selectedRows.map((e: any) => e.statusdisplay);
      this.selectedtstatus = selectedRows[0].statusdisplay;

      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected Status:", this.selectedtstatus);
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
      text: "You won't be able to Activate this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.swal.Loading();
        this.userService.Broadcaster_update(requestBody).subscribe(
          (res: any) => {
            console.log(res);
            this.swal.success(res?.message);
            // this.logCreate('Broadcaster Name Changed', broadcastername, this.oldbroadcastorName);
            this.logCreate(`Broadcaster [${this.oldbroadcastorName}] name changed`, broadcastername, this.oldbroadcastorName);

          },

          (err: any) => {
            this.swal.Error(err?.error?.message);
          }
        );
      }
    });
  }



  Deactive(ids: any, status: any) {
    console.log('dfsdfhsdjf', status);
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
        this.swal.Loading();
        this.userService.deleteBroadcaster(this.role, this.username, ids).subscribe((res: any) => {
          this.swal.success(res?.message);
          this.logCreate('Broadcaster Deactive Button Clicked', status, 'Deactive');
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });


  }
  Active(ids: any, status: any) {
    console.log('dfkdsjfskdfjkds', status);

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
        this.userService.ActiveBroadcaster(this.role, this.username, ids).subscribe((res: any) => {
          this.swal.success(res?.message);
          this.logCreate('Broadcaster Active Button Clicked', status, 'Active');
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });

  }

  logCreate(action: any, remarks: any, data: any) {
    console.log(remarks);

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
