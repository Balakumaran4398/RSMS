import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { UpdatePackageMasterComponent } from '../_Dialogue/package_master/update-package-master/update-package-master.component';

@Component({
  selector: 'app-package-master',
  templateUrl: './package-master.component.html',
  styleUrls: ['./package-master.component.scss']
})
export class PackageMasterComponent {
  selectedTab: string = '0';
  gridApi: any;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  isAnyRowSelected: boolean = false;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
  }
  username: any;
  user_role: any;
  rowData: any;
  type: number = 0;
  Castype: any = 0;
  cas: any[] = [];
  public rowSelection: any = "multiple";
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.user_role = storageService.getUserRole();
  }
  ngOnInit(): void {

  this.userService.PackagemasterList(this.user_role, this.username, this.type,this.Castype).subscribe((data) => {
      this.rowData = data;
    })
    this.userService.Cas_type(this.user_role, this.username).subscribe((data) => {
      this.cas = data;
    });
  }

  ngAfterViewInit(): void {
    this.loadData(this.selectedTab);
  }
  private loadData(tab: any): void {

  }
  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
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
  onSubscriberStatusChange() {
    this.userService.PackagemasterList(this.user_role, this.username, this.selectedTab,this.Castype).subscribe((data) => {
      this.updateColumnDefs(this.selectedTab);
    });

  }

  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "PRODUCT NAME", field: 'productname', width: 150, },
    { headerName: "CAS TYPE", field: 'castype', },
    { headerName: "REFERENCE ID", field: 'referenceid', },
    { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
    { headerName: "TYPE", field: 'type', },
    { headerName: "RATE", field: 'rate', },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
    { headerName: "MSO AMOUNT", field: 'msoamount', },
    { headerName: "LCO COMMISSION", field: 'lcocommission', },
    { headerName: "CREATED DATE", field: 'createddate', },

    {
      headerName: 'IS DELETE',
      field: 'active',
      cellRenderer: (params: { value: any }) => {
        const color = params.value ? 'pink' : 'blue';
        const text = params.value ? 'YES' : 'NO';
        return `<span style="color: ${color}">${text}</span>`;
      }
    },

    {
      headerName: 'ISACTIVE',
      field: '_delete',
      cellRenderer: (params: { value: any; }) => {
        const color = params.value ? 'green' : 'red';
        const text = params.value ? 'Active' : 'Deactive';
        return `<span style="color: ${color}">${text}</span>`;
      }
    },
    //  {
    //   headerName: 'Actions', minWidth: 140,
    //   cellRenderer: (params: any) => {
    //     const editButton = document.createElement('button');
    //     editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
    //     // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
    //     editButton.style.backgroundColor = 'transparent';
    //     editButton.style.color = 'rgb(2 85 13)';
    //     editButton.style.border = 'none';
    //     editButton.title = 'Edit the Customer';
    //     editButton.style.cursor = 'pointer';
    //     editButton.style.marginRight = '6px';
    //     editButton.addEventListener('click', () => {
    //       this.openUpdatepackage(params.data);
    //     });

    //     const div = document.createElement('div');
    //     div.appendChild(editButton);
    //     return div;
    //   }
    // },

  ]
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadData(tab);
  }
  private updateColumnDefs(tab: string): void {
    if (tab === '0') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 150,pinned: 'left' },
        {
          headerName: 'ACTION', width: 80,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
            editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(2 85 13)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";

            editButton.addEventListener('click', () => {
              this.openUpdatepackage(params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
        { headerName: "CAS TYPE", field: 'castype', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        { headerName: "TYPE", field: 'type', },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },

        {
          headerName: 'IS DELETE',
          field: 'active', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'pink' : 'blue';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: '_delete', width: 150,
          cellRenderer: (params: { value: any; }) => {
            const color = params.value ? 'green' : 'red';
            const text = params.value ? 'Active' : 'Deactive';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
      ]
    } else if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 150,pinned: 'left' },
        // {
        //   headerName: 'ACTION', width: 80,
        //   cellRenderer: (params: any) => {
        //     const editButton = document.createElement('button');
        //     // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
        //     editButton.innerHTML = '<i class="fa fa-pen-square" aria-hidden="true"></i>';
        //     editButton.style.backgroundColor = 'transparent';
        //     editButton.style.color = 'rgb(2 85 13)';
        //     editButton.style.border = 'none';
        //     editButton.title = 'Edit the Customer';
        //     editButton.style.cursor = 'pointer';
        //     editButton.style.marginRight = '6px';
        //     editButton.style.fontSize = "30px";

        //     editButton.addEventListener('click', () => {
        //       this.openUpdatepackage(params.data);
        //     });

        //     const div = document.createElement('div');
        //     div.appendChild(editButton);
        //     return div;
        //   }
        // },

        { headerName: "CAS TYPE", field: 'castype', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        { headerName: "TYPE", field: 'type', },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },

        {
          headerName: 'IS DELETE',
          field: 'active', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'pink' : 'blue';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: '_delete', width: 150,
          cellRenderer: (params: { value: any; }) => {
            const color = params.value ? 'green' : 'red';
            const text = params.value ? 'Active' : 'Deactive';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
      ]
    } else if (tab === '2') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 150, pinned: 'left'},
        // {
        //   headerName: 'ACTION', width: 80,
        //   cellRenderer: (params: any) => {
        //     const editButton = document.createElement('button');
        //     // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
        //     editButton.innerHTML = '<i class="fa fa-pen-square" aria-hidden="true"></i>';
        //     editButton.style.backgroundColor = 'transparent';
        //     editButton.style.color = 'rgb(2 85 13)';
        //     editButton.style.border = 'none';
        //     editButton.title = 'Edit the Customer';
        //     editButton.style.cursor = 'pointer';
        //     editButton.style.marginRight = '6px';
        //     editButton.style.fontSize = "30px";

        //     editButton.addEventListener('click', () => {
        //       this.openUpdatepackage(params.data);
        //     });

        //     const div = document.createElement('div');
        //     div.appendChild(editButton);
        //     return div;
        //   }
        // },
        { headerName: "CAS TYPE", field: 'castype', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        { headerName: "TYPE", field: 'type', },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },

        {
          headerName: 'IS DELETE',
          field: 'active', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'pink' : 'blue';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: '_delete', width: 150,
          cellRenderer: (params: { value: any; }) => {
            const color = params.value ? 'green' : 'red';
            const text = params.value ? 'Active' : 'Deactive';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
      ]
    } else if (tab === '3') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 150, pinned: 'left'},
        // {
        //   headerName: 'ACTION', width: 80,
        //   cellRenderer: (params: any) => {
        //     const editButton = document.createElement('button');
        //     // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
        //     editButton.innerHTML = '<i class="fa fa-pen-square" aria-hidden="true"></i>';
        //     editButton.style.backgroundColor = 'transparent';
        //     editButton.style.color = 'rgb(2 85 13)';
        //     editButton.style.border = 'none';
        //     editButton.title = 'Edit the Customer';
        //     editButton.style.cursor = 'pointer';
        //     editButton.style.marginRight = '6px';
        //     editButton.style.fontSize = "30px";

        //     editButton.addEventListener('click', () => {
        //       this.openUpdatepackage(params.data);
        //     });

        //     const div = document.createElement('div');
        //     div.appendChild(editButton);
        //     return div;
        //   }
        // },
        { headerName: "CAS TYPE", field: 'castype', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        { headerName: "TYPE", field: 'type', },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },
        {
          headerName: 'IS DELETE',
          field: 'active', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'pink' : 'blue';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: '_delete', width: 150,
          cellRenderer: (params: { value: any; }) => {
            const color = params.value ? 'green' : 'red';
            const text = params.value ? 'Active' : 'Deactive';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
      ]
    }
  }
  openUpdatepackage(data: any) {
    const dialogRef = this.dialog.open(UpdatePackageMasterComponent, {
      width: '400px',
      height: '220px',
      maxWidth: '100vw',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  // adddelete() {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         title: "Deleted!",
  //         text: "Your file has been deleted.",
  //         icon: "success",
  //       });
  //     }
  //   });
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     Swal.fire({
  //       title: 'Deleting...',
  //       text: 'Please wait while the Broadcaster is being deleted',
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading();
  //       }
  //     });
  //     if (result.isConfirmed) {
  //       this.userService.UpdatePackagemasterList(this.user_role, this.username, this.selectedIds).subscribe((res: any) => {
  //         console.log(this.selectedIds);
  //         Swal.fire({
  //           title: 'Deleted!',
  //           text: res.message,
  //           icon: 'success'
  //         })
  //         this.ngOnInit();
  //       }, (err: { error: { message: any; }; }) => {
  //         Swal.fire({
  //           title: 'Error!',
  //           text: err?.error?.message,
  //           icon: 'error'
  //         })
  //       });
  //       window.location.reload();
  //     };
  //   });
  // }



  Deactive() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delated it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait while the package master is being deleted',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.UpdatePackagemasterList(this.user_role, this.username, this.selectedIds).subscribe((res: any) => {
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
          text: 'Please wait while the package master is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.UpdatePackagemasterList(this.user_role, this.username, this.selectedIds).subscribe((res: any) => {
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
