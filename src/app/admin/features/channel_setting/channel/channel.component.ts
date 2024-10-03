import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

import Swal from 'sweetalert2';
import { ChannelCreateComponent } from '../_Dialogue/Channel_dialog/channel-create/channel-create.component';
import { ChannelEditComponent } from '../_Dialogue/Channel_dialog/channel-edit/channel-edit.component';
import { ChannelUploadComponent } from '../_Dialogue/Channel_dialog/channel-upload/channel-upload.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
  isupload: boolean = false;
  isaddnew: boolean = false;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
    },
    paginationPageSize: 10,
    pagination: true,
  };

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  public rowSelection: any = "multiple";
  username: string;
  role: string;
  rowData: any;
  type: string[] = ['All', 'ACTIVE', 'DEACTIVE'];
  selectedType: string = 'ALL';

  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.username)
    console.log(this.role);

  }
  ngOnInit(): void {
    this.getChannelList(this.selectedType);
  }
  getChannelList(selectedType: string): void {
    this.userService.ChannelList(this.role, this.username, selectedType).subscribe((data) => {
      console.log(data);
      this.rowData = data;
    });
  }

  // onTypeChange(newType: string): void {
  //   this.selectedType = newType;
  //   this.getChannelList(this.selectedType);
  // }
  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedType = selectElement.value;
  
    this.selectedType = selectedType;
    this.getChannelList(this.selectedType);
  }
  
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true, width: 100
    },
    { headerName: "BROADCASTER", field: 'broadcastername', editable: true, },
    {
      headerName: 'Actions', minWidth: 140,
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
          this.openEditDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "SERVICE ID", field: 'service_id', editable: true, width: 130 },
    { headerName: "PRODUCT ID", field: 'product_id', editable: true },
    {
      headerName: "STATUS", field: 'statusdisplay', editable: true,
      cellRenderer: (params: { value: any; }) => {
        const color = params.value ? 'red' : 'Green';
        const text = params.value ? 'Deactive' : 'Active';
        return `<span style="color: ${color}">${text}</span>`;
      }
    },
    { headerName: "INR AMOUNT", field: 'inr_amt', editable: true },
    { headerName: "STATUS", field: 'paidstatus', editable: true },
    { headerName: "LOGO", field: 'channel_logo', editable: true },

   
  ];
  onSelectionChange(event: MatSelectChange): void {
    this.selectedType = event.value;
    this.getChannelList(this.selectedType);
  } 
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);

      this.selectedIds = selectedRows.map((e: any) => e.channel_id);
      this.selectedtypes = selectedRows.map((e: any) => e.statusdisplay);
      console.log(this.selectedIds);
    }
  }
  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(ChannelEditComponent, {
      // width: '500px',
      // height: '600px',
      maxWidth: "500px",
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  upload(data: any): void {
    const dialogRef = this.dialog.open(ChannelUploadComponent, {
      width: '800px',
      // height: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addnew() {
    this.isaddnew = !this.isaddnew;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ChannelCreateComponent, {
      width: '700px',
      maxHeight:700,
      // height: '900px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
          text: 'Please wait while the Channel is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.ActiveChannel(this.role, this.username, this.selectedIds).subscribe((res: any) => {
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
          text: 'Please wait while the Channel is being deleted',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.deleteChannel(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Deleted!',
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
}
