import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { PackageplandialogueComponent } from '../Dialogue/packageplandialogue/packageplandialogue.component';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-packageplan',
  templateUrl: './packageplan.component.html',
  styleUrls: ['./packageplan.component.scss']
})
export class PackageplanComponent implements OnInit {
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
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  id: any;
  role: any;
  type: number = 0;
  userid: any;
  accessip: any;
  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService, private swal: SwalService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
  }

  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false,
      checkboxSelection: true,
    },
    { headerName: 'COUNTRYNAME', field: 'planname', width: 250, },
    { headerName: 'DAYS', field: 'days', width: 250, },
    {
      headerName: 'IS ACTIVE', field: 'isactive', width: 270,
      cellRenderer: (params: { value: any; data: any }) => {
        const color = params.value ? 'green' : 'red';
        // const text = params.value ? 'True' : 'False' ;
        const text = params.value ? 'Active' : 'Deactive';
        return `<span style="color: ${color}; ">${text}</span>`;
      }
    },
    {
      headerName: 'Edit', minWidth: 200,
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
          this.openaddedlogue('editpackageplan', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
  ];
  ngOnInit(): void {
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.userservice.getAllPackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows[0].isactive;
    }
  }

  Active() {
    // this.swal.Loading();
    // this.userservice.activeORDeactivePackagePlan(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
    //   this.swal.success(res?.message);
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
      confirmButtonText: "Yes, Active it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while the Package Plan is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.activeORDeactivePackagePlan(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
          console.log(res);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your update was successful",
            showConfirmButton: false,
            timer: 1000
          });
          this.swal.success(res?.message);
          this.logCreate('Package Plan Active Button Clicked', !this.selectedtypes, 'Active');
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
    // this.swal.Loading();
    // this.userservice.activeORDeactivePackagePlan(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
    //   this.swal.success(res?.message);
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
          text: 'Please wait while the Package Plan is being Deactivated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
         this.userservice.activeORDeactivePackagePlan(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
          Swal.fire({
            title: 'Deactivated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.swal.success(res?.message);
          this.logCreate('Package Plan Deactive Button Clicked', !this.selectedtypes, 'Deactive');
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
  openaddedlogue(type: any, data: any) {
    let width = '500px';
    if (type === 'new') {
      width = '500px';
    } else if (type === 'editpackageplan') {
      width = '500px';
    }
    let dialogData = { type: type, data: data, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(PackageplandialogueComponent, {
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
